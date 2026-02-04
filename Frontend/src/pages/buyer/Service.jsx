import {Link} from 'react-router-dom'
import { Shield, Briefcase } from "lucide-react";
import Navbar from '../../components/buyer/Navbar';

export const metadata = {
  title: "Professional Services",
  description: "Security & Privacy and Legal Support Services",
};

export default function Service() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar/>
      {/* Header */}
      <header className=" border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Professional Services
          </h1>
          <p className="text-gray-600 mt-2">
            Custom inquiries for Security & Privacy and Legal Support
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Security & Privacy Service */}
          <Link
            to="/service/security-privacy"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition p-8 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                Security & Privacy
              </h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Have security or privacy concerns? Submit a detailed inquiry and
              our security team will review your request and respond with whether
              we can provide the service.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition">
              <span>Submit Inquiry</span>
              <span>→</span>
            </div>
          </Link>

          {/* Legal Support Service */}
          <Link
            to="/service/legal-support"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition p-8 border border-gray-200 hover:border-amber-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition">
                <Briefcase className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition">
                Legal Support
              </h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Need legal assistance or consultation? Submit your legal matter for
              review, and our legal team will evaluate your case and respond with
              next steps.
            </p>
            <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:gap-3 transition">
              <span>Request Service</span>
              <span>→</span>
            </div>
          </Link>
        </div>

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-lg p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">How It Works</h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Submit Your Request
                </h4>
                <p className="text-gray-600 text-sm">
                  Fill out a detailed form describing your needs, concerns, or
                  legal matter.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Expert Review</h4>
                <p className="text-gray-600 text-sm">
                  Our specialized team reviews your inquiry and assesses
                  feasibility and scope.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  We Get Back to You
                </h4>
                <p className="text-gray-600 text-sm">
                  Our team contacts you with our determination and next steps.
                  No automatic approval—manual review only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
