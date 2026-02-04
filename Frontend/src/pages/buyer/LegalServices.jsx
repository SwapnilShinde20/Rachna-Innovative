import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import LegalInquiryForm from '@/components/buyer/legal-inquiry-form'

export default function LegalSupportPage() {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Legal Support | Service Inquiry</title>
        <meta
          name="description"
          content="Request legal services and consultations"
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
              Legal Support Request
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Need legal assistance or consultation? Submit your inquiry below
              and our legal team will review your request and respond with
              information about how we can help.
            </p>
          </div>

          {/* Form */}
          <LegalInquiryForm />

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-amber-600 mb-2">1</div>
              <h3 className="text-lg font-semibold mb-2">
                Submit Your Details
              </h3>
              <p className="text-gray-600 text-sm">
                Describe your legal matter in detail, including any relevant
                documents.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-amber-600 mb-2">2</div>
              <h3 className="text-lg font-semibold mb-2">Legal Review</h3>
              <p className="text-gray-600 text-sm">
                Our legal team will evaluate your case and assess our ability to
                assist.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-amber-600 mb-2">3</div>
              <h3 className="text-lg font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600 text-sm">
                We'll reach out to discuss your case and propose next steps.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
