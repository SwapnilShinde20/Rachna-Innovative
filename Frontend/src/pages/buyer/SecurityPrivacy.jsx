import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import SecurityInquiryForm from '../../components/buyer/security-inquiry-form'

export default function SecurityPrivacyPage() {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Security & Privacy | Service Inquiry</title>
        <meta
          name="description"
          content="Submit your security and privacy concerns for review"
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Services</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Security & Privacy Inquiry
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Have a security or privacy concern? Our team is here to help. Submit
              your detailed request below, and our security experts will review it
              and respond with next steps.
            </p>
          </div>

          {/* Form */}
          <SecurityInquiryForm />

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="text-lg font-semibold mb-2">
                Submit Your Request
              </h3>
              <p className="text-gray-600 text-sm">
                Fill out the form with details about your security or privacy
                concern.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <h3 className="text-lg font-semibold mb-2">Expert Review</h3>
              <p className="text-gray-600 text-sm">
                Our security team will carefully review your inquiry and assess
                feasibility.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <h3 className="text-lg font-semibold mb-2">Get Response</h3>
              <p className="text-gray-600 text-sm">
                We'll contact you with our determination and next steps.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
