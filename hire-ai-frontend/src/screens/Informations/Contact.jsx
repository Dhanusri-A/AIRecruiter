import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Contact = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Get in touch with our team for any questions or support needs
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-8">
              We're here to help! Whether you have questions about our services, need technical support, 
              or want to provide feedback, our team is ready to assist you.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMail className="text-blue-600 mr-3" /> Email Us
                </h3>
                <p className="mb-4">
                  For general inquiries and support:
                </p>
                <a
                  href="mailto:support@jobportal.com"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-lg"
                >
                  support@jobportal.com
                </a>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiPhone className="text-blue-600 mr-3" /> Call Us
                </h3>
                <p className="mb-4">
                  Phone support coming soon:
                </p>
                <div className="text-gray-600 font-medium text-lg">
                  (Will be updated)
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiMapPin className="text-blue-600 mr-3" /> Our Location
              </h3>
              <p className="text-gray-700">
                Address details will be provided when available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default Contact;