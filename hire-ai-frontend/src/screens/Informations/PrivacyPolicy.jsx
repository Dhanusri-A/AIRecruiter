import { FiCheckCircle, FiMail, FiShield } from "react-icons/fi";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Your privacy is important to us at Profile AI
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-8">
              This Privacy Policy explains how Profile AI collects, uses, discloses, and safeguards your 
              information when you use our website and services. Please read this policy carefully.
            </p>
            
            <div className="space-y-8">
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiShield className="text-blue-600 mr-3" /> Information We Collect
                </h2>
                <p className="mb-4">
                  We collect several types of information from and about users of our website:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact details</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
                </ul>
              </section>
              
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="text-blue-600 mr-3" /> How We Use Your Information
                </h2>
                <p className="mb-4">
                  We use the information we collect for various purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To allow you to participate in interactive features</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information</li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </section>
              
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiShield className="text-blue-600 mr-3" /> Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMail className="text-blue-600 mr-3" /> Contact Us
                </h2>
                <p>
                  If you have questions about this Privacy Policy, contact us at:
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

export default PrivacyPolicy;