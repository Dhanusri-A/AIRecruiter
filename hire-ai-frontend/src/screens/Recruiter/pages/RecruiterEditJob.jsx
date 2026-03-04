import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { getJobById, updateJobDescription } from "../../../api/api";
import RecruiterGenerateJD from "./RecruiterGenerateJD";

export default function RecruiterEditJob() {
  const { id: jobId } = useParams();

  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await getJobById(jobId);

        setInitialData({
          jobTitle: job.job_title,
          companyName: job.company_name,
          industry: job.department,
          location: job.location,
          experienceLevel: job.level,
          tone: job.tone_style,
          skills: job.skills,
          responsibilities: job.responsibilities,
          additionalContext: job.additional_data,
        });
      } catch (err) {
        navigate("/recruiter/my-jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <RecruiterGenerateJD
      mode="edit"
      jobId={jobId}
      initialData={initialData}
      onSubmit={async (payload) => {
        const updated = await updateJobDescription(jobId, payload);
        navigate("/recruiter/show-jd", {
          state: { generatedJob: updated },
        });
      }}
    />
  );
}
