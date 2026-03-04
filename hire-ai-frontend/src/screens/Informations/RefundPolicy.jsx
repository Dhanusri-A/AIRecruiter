import { FiDollarSign, FiFileText, FiMail } from "react-icons/fi";
import { IndianRupee } from "lucide-react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Refund Policy
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Our policy on refunds for paid services at Profile AI
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-8">
              We want you to be completely satisfied with your purchase. If you're not satisfied, 
              we offer refunds under the following conditions.
            </p>
            
            <div className="space-y-8">
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <IndianRupee className="text-blue-600 mr-3" /> Eligibility for Refunds
                </h2>
                <p className="mb-4">
                  You may be eligible for a full refund under these circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The request is made within 7 days of purchase</li>
                  <li>The service was not provided as described</li>
                  <li>Technical issues prevented service delivery</li>
                  <li>Duplicate or accidental charges</li>
                </ul>
              </section>
              
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiFileText className="text-blue-600 mr-3" /> Non-Refundable Items
                </h2>
                <p className="mb-4">
                  The following are not eligible for refunds:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Services already rendered or completed</li>
                  <li>Downloadable products that have been accessed</li>
                  <li>Requests made after 7 days of purchase</li>
                  <li>Change of mind after service has begun</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMail className="text-blue-600 mr-3" /> How to Request a Refund
                </h2>
                <p className="mb-4">
                  To request a refund, please email us at:
                </p>
                <a
                  href="mailto:support@jobportal.com"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 inline-block mb-4"
                >
                  support@jobportal.com
                </a>
                <p>
                  Include your purchase details and reason for the refund request. 
                  We typically process refunds within 5-7 business days.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default RefundPolicy;