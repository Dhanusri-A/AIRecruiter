// screens/Candidate/pages/CandidateAIInterview.jsx
//
// SETUP — run this in your project root first:
//   npm install lottie-react
//
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import patrickAnimation from "../../../assets/Lottie/ai.json";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Clock,
  Settings,
  Volume2,
  CheckCircle,
  Play,
  HelpCircle,
  Upload,
  CloudOff,
} from "lucide-react";
import {
  getInterviewQuestions,
  evaluateInterview,
  getRecordingPresignedUrl,
  markRecordingComplete,
} from "../../../api/api";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────────────────
// Fullscreen helpers
// ─────────────────────────────────────────────────────────────────────────────
function enterFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
  return Promise.resolve();
}
function exitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
  return Promise.resolve();
}
const safeExitFullscreen = () => exitFullscreen().catch(() => {});

// ─────────────────────────────────────────────────────────────────────────────
// Chrome keep-alive — only resumes if already paused, never interrupts
// ─────────────────────────────────────────────────────────────────────────────
let _pingInterval = null;
function startChromePing() {
  stopChromePing();
  _pingInterval = setInterval(() => {
    if (window.speechSynthesis?.paused) window.speechSynthesis.resume();
  }, 5000);
}
function stopChromePing() {
  clearInterval(_pingInterval);
  _pingInterval = null;
}

// ─────────────────────────────────────────────────────────────────────────────
// speak() — no timeout, resolves only on onend/onerror
// ─────────────────────────────────────────────────────────────────────────────
function speak(text) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang === "en-IN") ||
        voices.find((v) => v.name.toLowerCase().includes("raveena")) ||
        voices.find((v) => v.name.toLowerCase().includes("heera")) ||
        voices.find((v) => v.name.toLowerCase().includes("india")) ||
        voices.find((v) => v.name.includes("Google US English")) ||
        voices.find((v) => v.name.includes("Samantha")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.rate = 0.78;
      u.pitch = 1.0;
      u.volume = 1.0;
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      u.onend = done;
      u.onerror = (e) => {
        console.warn("TTS:", e.error);
        done();
      };
      window.speechSynthesis.speak(u);
    }, 250);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SpeechRecognizer
// ─────────────────────────────────────────────────────────────────────────────
class SpeechRecognizer {
  constructor() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      this.supported = false;
      return;
    }
    this.supported = true;
    this.rec = new SR();
    this.rec.continuous = true;
    this.rec.interimResults = true;
    this.rec.lang = "en-US";
    this._transcript = "";
    this._running = false;
    this._cb = null;
    this.rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++)
        if (e.results[i].isFinal) {
          this._transcript += e.results[i][0].transcript + " ";
          this._cb?.(this._transcript);
        }
    };
    this.rec.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted")
        console.warn("SR:", e.error);
    };
    this.rec.onend = () => {
      if (this._running)
        try {
          this.rec.start();
        } catch (_) {}
    };
  }
  start(cb) {
    if (!this.supported) return;
    this._transcript = "";
    this._running = true;
    this._cb = cb;
    try {
      this.rec.start();
    } catch (_) {}
  }
  stop() {
    this._running = false;
    try {
      this.rec.stop();
    } catch (_) {}
    return this._transcript;
  }
  destroy() {
    this._running = false;
    this._cb = null;
    try {
      this.rec.stop();
    } catch (_) {}
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// QuestionRecorder
// Encapsulates MediaRecorder lifecycle for one question answer window.
// Usage:
//   const rec = new QuestionRecorder(stream);
//   await rec.start();          // fetches presigned URL + starts recording
//   const blob = await rec.stop();  // stops, returns blob
//   await rec.upload();         // uploads blob to S3, marks complete
// ─────────────────────────────────────────────────────────────────────────────
class QuestionRecorder {
  constructor(stream, interviewId, questionIndex) {
    this.stream = stream;
    this.interviewId = interviewId;
    this.questionIndex = questionIndex;
    this._chunks = [];
    this._mediaRecorder = null;
    this._presignedUrl = null;
    this._objectKey = null;
    this._blob = null;
    this._uploadStatus = "idle"; // idle | uploading | done | failed
  }

  // Pick the best supported MIME type for this browser
  static _bestMime() {
    const candidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";
  }

  // Fetch presigned URL ahead of time (call during "gap" phase so it's ready)
  async prefetch() {
    try {
      const data = await getRecordingPresignedUrl(
        this.interviewId,
        this.questionIndex,
      );
      this._presignedUrl = data.presigned_url;
      this._objectKey = data.object_key;
      console.log(`✓ Presigned URL ready for Q${this.questionIndex + 1}`);
    } catch (err) {
      console.error("Presigned URL fetch failed:", err);
      // Non-fatal — recording will still happen, upload will just fail gracefully
    }
  }

  // Start recording (call at start of answering phase)
  start() {
    this._chunks = [];
    const mime = QuestionRecorder._bestMime();
    try {
      this._mediaRecorder = new MediaRecorder(
        this.stream,
        mime ? { mimeType: mime } : undefined,
      );
      this._mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this._chunks.push(e.data);
      };
      // Collect chunks every 5s — prevents data loss if tab crashes
      this._mediaRecorder.start(5000);
      console.log(
        `▶ Recording Q${this.questionIndex + 1} [${mime || "default"}]`,
      );
    } catch (err) {
      console.error("MediaRecorder start error:", err);
    }
  }

  // Stop recording, return Blob
  stop() {
    return new Promise((resolve) => {
      const mr = this._mediaRecorder;
      if (!mr || mr.state === "inactive") {
        resolve(null);
        return;
      }
      mr.onstop = () => {
        const mime = mr.mimeType || "video/webm";
        this._blob = new Blob(this._chunks, { type: mime });
        console.log(
          `■ Recording stopped Q${this.questionIndex + 1} — size: ${(this._blob.size / 1024).toFixed(0)} KB`,
        );
        resolve(this._blob);
      };
      mr.stop();
    });
  }

  // Upload blob to S3 presigned URL, then mark complete in backend
  async upload() {
    if (!this._blob || this._blob.size < 1000) {
      console.warn(
        `Q${this.questionIndex + 1}: blob too small, skipping upload`,
      );
      return;
    }
    if (!this._presignedUrl) {
      console.warn(
        `Q${this.questionIndex + 1}: no presigned URL, skipping upload`,
      );
      toast.error(
        `Q${this.questionIndex + 1} recording could not be saved — missing upload URL`,
      );
      return;
    }

    this._uploadStatus = "uploading";
    try {
      console.log(`⬆ Uploading Q${this.questionIndex + 1} to S3…`);

      // ✅ NO custom headers — this makes it a simple CORS request (no preflight).
      // Adding Content-Type here would trigger a preflight OPTIONS that S3
      // rejects for presigned URLs, causing a CORS error.
      const res = await fetch(this._presignedUrl, {
        method: "PUT",
        body: this._blob,
        // headers: { "Content-Type": ... }  ← DO NOT include this
      });

      if (!res.ok)
        throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`);
      console.log(`✓ S3 upload done Q${this.questionIndex + 1}`);

      // Notify backend to save the object_key in DB
      await markRecordingComplete(
        this.interviewId,
        this.questionIndex,
        this._objectKey,
      );
      console.log(`✓ Backend marked complete Q${this.questionIndex + 1}`);

      this._uploadStatus = "done";
    } catch (err) {
      this._uploadStatus = "failed";
      console.error(`✗ Upload failed Q${this.questionIndex + 1}:`, err);
    }
  }

  get uploadStatus() {
    return this._uploadStatus;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PatrickAvatar
// ─────────────────────────────────────────────────────────────────────────────
function PatrickAvatar({ isTalking }) {
  const lottieRef = useRef(null);

  useEffect(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isTalking) {
      anim.play();
    } else {
      anim.stop();
    }
  }, [isTalking]);

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden transition-all duration-500"
        style={{
          width: 220,
          height: 220,
          boxShadow: isTalking
            ? "0 0 0 4px #34d399, 0 0 32px 8px rgba(52,211,153,0.45)"
            : "0 0 0 2px rgba(52,211,153,0.2)",
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={patrickAnimation}
          loop={true}
          autoplay={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {isTalking && (
        <div
          className="absolute rounded-full border-4 border-emerald-400 animate-ping opacity-30 pointer-events-none"
          style={{ inset: 0, width: 220, height: 220 }}
        />
      )}
      {isTalking && (
        <div className="flex items-end gap-1 mt-4 h-8">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-emerald-400 rounded-full"
              style={{
                height: `${(i % 5) * 5 + 4}px`,
                animation: `pulse ${0.25 + (i % 5) * 0.1}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CandidateVideo — isolated, never re-mounts → no black flashes
// ─────────────────────────────────────────────────────────────────────────────
function CandidateVideo({ stream, videoOff, candidateName }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: videoOff ? "none" : "block" }}
        className="w-full h-full object-cover"
      />
      {videoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl font-bold text-gray-400">
                {candidateName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "YOU"}
              </span>
            </div>
            <p className="text-gray-500">Camera Off</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EvaluatingOverlay
// ─────────────────────────────────────────────────────────────────────────────
function EvaluatingOverlay({ uploadingCount }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setFlipped((p) => !p), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center gap-8">
      <div
        className="text-9xl select-none"
        style={{
          transform: flipped ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          filter: "drop-shadow(0 0 20px rgba(16,185,129,0.5))",
        }}
      >
        ⏳
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Evaluating Your Interview
        </h2>
        <p className="text-emerald-400">AI is analysing your responses...</p>
        {uploadingCount > 0 && (
          <p className="text-blue-400 text-sm mt-2 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 animate-bounce" />
            Uploading {uploadingCount} recording{uploadingCount > 1 ? "s" : ""}{" "}
            in background…
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function CandidateAIInterview() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [interview] = useState(state?.interview || null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [phase, setPhase] = useState("setup");
  const [currentSpeakingQuestion, setCurrentSpeakingQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(40);
  const [breakTimer, setBreakTimer] = useState(5);
  const [gapTimer, setGapTimer] = useState(5);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [candidateVideoOff, setCandidateVideoOff] = useState(false);
  const [candidateMuted, setCandidateMuted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [candidateStream, setCandidateStream] = useState(null);
  const [pendingUploads, setPendingUploads] = useState(0);
  // Per-question upload status shown in the top bar: { [qIdx]: 'uploading'|'done'|'failed' }
  const [uploadStatus, setUploadStatus] = useState({});

  const recognizerRef = useRef(null);
  const abortRef = useRef(false);
  const evaluateCalledRef = useRef(false);
  const qaRef = useRef([]);
  const questionTimerRef = useRef(null);
  const breakTimerRef = useRef(null);
  const gapTimerRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const streamRef = useRef(null);
  // Holds the active QuestionRecorder for the current question
  const currentRecorderRef = useRef(null);
  // Holds all recorders (for pending uploads at evaluation time)
  const allRecordersRef = useRef([]);

  const isGreeting = phase === "greeting";
  const isGap = phase === "gap";
  const isSpeaking = phase === "speaking";
  const isAnswering = phase === "answering";
  const isBreak = phase === "break";
  const avatarTalking = isGreeting || isSpeaking;
  const showQuestion = (isSpeaking || isAnswering) && currentSpeakingQuestion;

  // ── Guards ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!interview) {
      toast.error("Interview details not found");
      navigate("/candidate/my-interviews");
    }
  }, []);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.addEventListener("voiceschanged", () => {});
    return () => {};
  }, []);

  useEffect(() => {
    enterFullscreen().catch(() => {});
    return () => {
      safeExitFullscreen();
    };
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current = true;
      recognizerRef.current?.destroy();
      clearAllTimers();
      stopChromePing();
      window.speechSynthesis?.cancel();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      // Stop any active recorder on unmount
      currentRecorderRef.current?.stop();
    };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function clearAllTimers() {
    clearInterval(questionTimerRef.current);
    clearInterval(breakTimerRef.current);
    clearInterval(gapTimerRef.current);
    clearInterval(elapsedTimerRef.current);
  }

  function startCountdown(durationSec, setter, timerRef) {
    setter(durationSec);
    let remaining = durationSec;
    clearInterval(timerRef.current);
    return new Promise((resolve) => {
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setter(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          resolve();
        }
      }, 1000);
    });
  }

  // Upload all pending recordings in the background, update status
  async function uploadAllRecordings() {
    const recorders = allRecordersRef.current;
    const pending = recorders.filter(
      (r) => r._blob && r.uploadStatus !== "done",
    );
    if (!pending.length) return;

    setPendingUploads(pending.length);

    await Promise.allSettled(
      pending.map(async (rec) => {
        setUploadStatus((s) => ({ ...s, [rec.questionIndex]: "uploading" }));
        await rec.upload();
        setUploadStatus((s) => ({
          ...s,
          [rec.questionIndex]: rec.uploadStatus,
        }));
        setPendingUploads((n) => Math.max(0, n - 1));
      }),
    );
  }

  // ── Interview flow ───────────────────────────────────────────────────────────
  async function runInterviewFlow(qs) {
    if (abortRef.current) return;
    elapsedTimerRef.current = setInterval(
      () => setElapsedTime((p) => p + 1),
      1000,
    );
    recognizerRef.current = new SpeechRecognizer();
    startChromePing();

    try {
      // Greeting
      setPhase("greeting");
      setCurrentSpeakingQuestion("");
      await speak(
        `Hello ${interview.candidate_name}. ` +
          `Welcome to your ${interview.job_title} interview. ` +
          `I am your AI Interviewer. ` +
          `We have ${qs.length} question${qs.length > 1 ? "s" : ""} today. ` +
          `Your 40 second timer starts after I finish reading each question. ` +
          `Let us begin.`,
      );
      if (abortRef.current) return;

      for (let i = 0; i < qs.length; i++) {
        if (abortRef.current) return;

        // ── GAP phase — prefetch presigned URL while counting down ────────────
        setPhase("gap");
        setCurrentQIdx(i);
        setCurrentSpeakingQuestion("");

        // Create recorder for this question and prefetch URL during gap
        const recorder = new QuestionRecorder(
          streamRef.current,
          interview.id,
          i,
        );
        currentRecorderRef.current = recorder;
        allRecordersRef.current.push(recorder);

        // Prefetch happens in parallel with the 5s gap countdown
        const [_] = await Promise.all([
          recorder.prefetch(),
          startCountdown(5, setGapTimer, gapTimerRef),
        ]);
        if (abortRef.current) return;

        // ── SPEAKING phase ────────────────────────────────────────────────────
        setPhase("speaking");
        setCurrentSpeakingQuestion(qs[i]);
        await speak(`Question ${i + 1}. ${qs[i]}`);
        if (abortRef.current) return;
        await wait(500);
        if (abortRef.current) return;

        // ── ANSWERING phase — start recording immediately ─────────────────────
        setLiveTranscript("");
        setPhase("answering");

        // Start recording and speech recognition together
        recorder.start();
        recognizerRef.current.start((t) => setLiveTranscript(t));

        await startCountdown(40, setQuestionTimer, questionTimerRef);
        if (abortRef.current) {
          // Still stop recorder to preserve what was captured
          await recorder.stop();
          break;
        }

        // ── Stop recording and speech recognition ─────────────────────────────
        const [blob] = await Promise.all([
          recorder.stop(),
          Promise.resolve(recognizerRef.current.stop()),
        ]);

        // Upload this question's recording in the background (don't await)
        // so the interview flow continues without delay
        setUploadStatus((s) => ({ ...s, [i]: "uploading" }));
        recorder.upload().then(() => {
          setUploadStatus((s) => ({ ...s, [i]: recorder.uploadStatus }));
        });

        const answer =
          recognizerRef.current._transcript?.trim() || "[No answer provided]";
        setLiveTranscript("");
        setCurrentSpeakingQuestion("");
        qaRef.current.push({ question: qs[i], answer });

        // ── BREAK phase ───────────────────────────────────────────────────────
        if (i < qs.length - 1) {
          setPhase("break");
          await startCountdown(5, setBreakTimer, breakTimerRef);
          if (abortRef.current) return;
        }
      }

      await doEvaluate();
    } catch (err) {
      console.error("Flow error:", err);
      toast.error("An error occurred during the interview");
    }
  }

  async function doEvaluate() {
    if (evaluateCalledRef.current) return;
    evaluateCalledRef.current = true;
    abortRef.current = true;
    clearAllTimers();
    stopChromePing();
    window.speechSynthesis?.cancel();
    recognizerRef.current?.destroy();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("evaluating");

    // Wait for all recordings that haven't finished uploading yet
    await uploadAllRecordings();

    try {
      const result = await evaluateInterview(interview.id, {
        qa: qaRef.current,
      });
      toast.success("Interview completed!");
      await safeExitFullscreen();
      navigate(`/candidate/interview-result/${interview.id}`, {
        state: { result },
      });
    } catch (err) {
      toast.error(err.message || "Failed to evaluate");
      await safeExitFullscreen();
      navigate(`/candidate/interview-result/${interview.id}`);
    }
  }

  const handleEndInterview = async () => {
    if (evaluateCalledRef.current) return;
    abortRef.current = true;
    clearAllTimers();

    if (phase === "answering") {
      // Stop active recorder
      const recorder = currentRecorderRef.current;
      if (recorder) await recorder.stop();

      // Save partial answer
      const partial =
        recognizerRef.current?.stop().trim() || "[No answer provided]";
      const currentQ = questions[currentQIdx];
      if (!qaRef.current.some((qa) => qa.question === currentQ))
        qaRef.current.push({ question: currentQ, answer: partial });
    }

    doEvaluate();
  };

  // ── Start ────────────────────────────────────────────────────────────────────
  const handleStartInterview = async () => {
    if (starting) return;
    setStarting(true);

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      setCandidateStream(stream);
    } catch {
      toast.error(
        "Camera/microphone access denied. Please allow and try again.",
      );
      setStarting(false);
      return;
    }

    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      await ac.resume();
      ac.close();
    } catch (_) {}

    await new Promise((resolve) => {
      const primer = new SpeechSynthesisUtterance(".");
      primer.volume = 0.01;
      primer.rate = 2.0;
      primer.onend = resolve;
      primer.onerror = resolve;
      setTimeout(resolve, 1000);
      window.speechSynthesis.speak(primer);
    });
    await wait(300);

    try {
      const data = await getInterviewQuestions(interview.id);
      if (!data?.questions?.length) {
        toast.error("No questions available");
        setStarting(false);
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      setQuestions(data.questions);
      setInterviewStarted(true);
      abortRef.current = false;
      await wait(150);
      runInterviewFlow(data.questions);
    } catch (err) {
      toast.error(err.message || "Failed to start interview");
      setStarting(false);
      stream.getTracks().forEach((t) => t.stop());
    }
  };

  const toggleMute = () => {
    setCandidateMuted((prev) => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = !next;
      });
      return next;
    });
  };
  const toggleVideo = () => {
    setCandidateVideoOff((prev) => {
      const next = !prev;
      streamRef.current?.getVideoTracks().forEach((t) => {
        t.enabled = !next;
      });
      return next;
    });
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (phase === "evaluating")
    return <EvaluatingOverlay uploadingCount={pendingUploads} />;

  // ── Setup screen ─────────────────────────────────────────────────────────────
  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">AI Interview Setup</h1>
            <p className="text-emerald-100">
              Prepare for your interview session
            </p>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {interview?.candidate_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "C"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {interview?.candidate_name}
                  </h2>
                  <p className="text-gray-600 mb-3">{interview?.job_title}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                      {interview?.interview_type}
                    </span>
                    {interview?.duration && (
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                        {interview.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Check Your Setup
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Video,
                    label: "Camera",
                    sub: "Will be enabled on start",
                  },
                  {
                    icon: Mic,
                    label: "Microphone",
                    sub: "Will be enabled on start",
                  },
                  { icon: Volume2, label: "Speaker", sub: "System Audio" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">{sub}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 flex-shrink-0 mt-0.5">✨</span>
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">
                    AI-Assisted Interview — Full Screen Mode
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs mt-2">
                    <li>The interview runs in full screen automatically</li>
                    <li>Each answer is recorded and securely stored</li>
                    <li>Each question has a 40-second time limit</li>
                    <li>5-second break between questions</li>
                    <li>Questions are displayed and read aloud slowly</li>
                    <li>Your answers are automatically transcribed</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={starting}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Setting up...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Live interview screen ─────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-medium text-sm">
              Live Interview
            </span>
          </div>
          <div className="h-5 w-px bg-gray-600" />
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
          </div>
          <div className="h-5 w-px bg-gray-600" />
          <span className="text-sm text-white">
            {isGreeting && (
              <span className="text-emerald-300">Introduction</span>
            )}
            {isGap && (
              <span className="text-yellow-300">
                Preparing Q{currentQIdx + 1}… {gapTimer}s
              </span>
            )}
            {isSpeaking && (
              <span className="text-blue-300">Reading Q{currentQIdx + 1}</span>
            )}
            {isAnswering && (
              <span className="font-semibold">
                Question{" "}
                <span className="text-emerald-400">{currentQIdx + 1}</span>
                <span className="text-gray-400"> / {questions.length}</span>
              </span>
            )}
            {isBreak && (
              <span className="text-amber-300">
                Break — next in {breakTimer}s
              </span>
            )}
          </span>

          {/* Per-question upload badges */}
          {Object.entries(uploadStatus).map(([qIdx, status]) => (
            <div
              key={qIdx}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                status === "uploading"
                  ? "bg-blue-900 text-blue-300"
                  : status === "done"
                    ? "bg-emerald-900 text-emerald-300"
                    : "bg-red-900 text-red-300"
              }`}
            >
              {status === "uploading" && (
                <Upload className="w-3 h-3 animate-bounce" />
              )}
              {status === "done" && <CheckCircle className="w-3 h-3" />}
              {status === "failed" && <CloudOff className="w-3 h-3" />}Q
              {Number(qIdx) + 1}
            </div>
          ))}
        </div>

        <button
          onClick={handleEndInterview}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          End Interview
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — AI panel */}
        <div className="flex-1 bg-gradient-to-br from-emerald-900 to-teal-900 flex flex-col items-center justify-center relative overflow-hidden">
          <PatrickAvatar isTalking={avatarTalking} />
          <h2 className="text-3xl font-bold text-white mt-5 mb-2">
            AI Interviewer
          </h2>

          <div className="text-center px-8 mt-1">
            {isGreeting && (
              <p className="text-emerald-200 text-base animate-pulse">
                👋 Welcoming you…
              </p>
            )}
            {isGap && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-emerald-200 text-sm">
                  Preparing next question in
                </p>
                <p className="text-5xl font-bold text-emerald-400 font-mono">
                  {gapTimer}
                </p>
              </div>
            )}
            {isSpeaking && (
              <p className="text-blue-200 text-base animate-pulse">
                🔊 Reading question aloud…
              </p>
            )}
            {isAnswering && (
              <p className="text-emerald-200 text-base animate-pulse flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                Recording your answer…
              </p>
            )}
            {isBreak && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-emerald-200 text-sm">Next question in</p>
                <p className="text-5xl font-bold text-emerald-400 font-mono">
                  {breakTimer}
                </p>
              </div>
            )}
          </div>

          {/* Question card */}
          {showQuestion && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <div className="max-w-3xl mx-auto bg-gray-900/95 backdrop-blur-sm rounded-xl p-5 border border-gray-600 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-2">
                      Question {currentQIdx + 1} of {questions.length}
                      {isSpeaking && (
                        <span className="ml-2 text-blue-400 animate-pulse">
                          🔊 Reading aloud…
                        </span>
                      )}
                      {isAnswering && (
                        <span className="ml-2 text-red-400 flex items-center gap-1 inline-flex">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          Recording
                        </span>
                      )}
                    </p>
                    <p className="text-base text-white leading-relaxed">
                      {currentSpeakingQuestion}
                    </p>
                    {isAnswering && (
                      <div className="mt-3 flex items-center gap-3">
                        <Clock
                          className={`w-4 h-4 ${questionTimer <= 10 ? "text-red-400" : "text-emerald-400"}`}
                        />
                        <span
                          className={`font-mono font-bold text-xl ${questionTimer <= 10 ? "text-red-400" : "text-emerald-400"}`}
                        >
                          {questionTimer}s
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${questionTimer <= 10 ? "bg-red-500" : "bg-emerald-500"}`}
                            style={{ width: `${(questionTimer / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isBreak && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-900 rounded-2xl p-10 text-center border border-gray-700 shadow-2xl">
                <Clock className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Next Question In
                </h3>
                <p className="text-7xl font-bold text-emerald-500 font-mono">
                  {breakTimer}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Candidate panel */}
        <div className="w-[40%] bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="relative flex-1 overflow-hidden">
            <CandidateVideo
              stream={candidateStream}
              videoOff={candidateVideoOff}
              candidateName={interview?.candidate_name}
            />

            {/* Recording indicator overlay */}
            {isAnswering && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-red-600/90 text-white px-2 py-1 rounded text-xs font-semibold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                REC
              </div>
            )}

            {isAnswering && !candidateMuted && (
              <div className="absolute top-3 left-3 z-10 bg-emerald-600/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <Mic className="w-3 h-3" />
                <span className="animate-pulse">Listening</span>
              </div>
            )}
            {candidateMuted && (
              <div className="absolute top-3 left-3 z-10 bg-red-600/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <MicOff className="w-3 h-3" /> Muted
              </div>
            )}
            {!candidateVideoOff && (
              <div className="absolute bottom-16 left-3 z-10 bg-black/60 px-3 py-1 rounded-lg">
                <p className="text-white text-sm font-medium">
                  {interview?.candidate_name || "You"}
                </p>
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors shadow-lg ${candidateMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {candidateMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors shadow-lg ${candidateVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {candidateVideoOff ? (
                  <VideoOff className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Live transcript */}
          <div className="p-4 border-t border-gray-700 max-h-44 overflow-y-auto bg-gray-900 flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Your Answer (Live)
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {liveTranscript ||
                (isAnswering
                  ? "🎙 Speak now…"
                  : "Transcript will appear here when you answer.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
