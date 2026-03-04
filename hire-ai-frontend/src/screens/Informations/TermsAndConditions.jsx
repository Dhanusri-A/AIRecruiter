import { FiFileText, FiMail, FiShield } from "react-icons/fi";
import { IndianRupee } from "lucide-react";

const TermsAndConditions = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Terms and Conditions
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            The rules governing use of Profile AI services
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-8">
              These Terms and Conditions ("Terms") govern your use of the Profile AI website and services. 
              By accessing or using our services, you agree to be bound by these Terms.
            </p>
            
            <div className="space-y-8">
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiFileText className="text-blue-600 mr-3" /> Account Registration
                </h2>
                <p className="mb-4">
                  To access certain features, you may need to register an account:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </section>
              
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiShield className="text-blue-600 mr-3" /> User Responsibilities
                </h2>
                <p className="mb-4">
                  When using our services, you agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Engage in fraudulent activity</li>
                  <li>Disrupt service operations</li>
                </ul>
              </section>
              
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <IndianRupee className="text-blue-600 mr-3" /> Payments
                </h2>
                <p className="mb-4">
                  For paid services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You agree to pay all applicable fees</li>
                  <li>Fees are non-refundable except as specified in our Refund Policy</li>
                  <li>We may change prices with prior notice</li>
                </ul>
              </section>
              
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiShield className="text-blue-600 mr-3" /> Limitation of Liability
                </h2>
                <p>
                  Profile AI shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of our services.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMail className="text-blue-600 mr-3" /> Contact Information
                </h2>
                <p>
                  For questions about these Terms, contact us at:
                </p>
                <a
                  href="mailto:support@jobportal.com"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 inline-block mt-2"
                >
                  support@jobportal.com
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default TermsAndConditions;