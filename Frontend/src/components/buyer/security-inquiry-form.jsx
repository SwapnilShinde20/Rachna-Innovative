import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'

export default function SecurityInquiryForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    type: 'Individual',
    subject: '',
    description: '',
    files: [],
    consent: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Detailed description is required'
    }

    if (!formData.consent) {
      newErrors.consent = 'You must confirm to proceed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: Array.from(e.target.files),
      }))
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      consent: checked,
    }))

    if (errors.consent) {
      setErrors((prev) => ({
        ...prev,
        consent: '',
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    console.log('Form submitted:', formData)
    setSubmitted(true)

    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        type: 'Individual',
        subject: '',
        description: '',
        files: [],
        consent: false,
      })
      setSubmitted(false)
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Thank You</h3>
          <p className="text-gray-600">
            Our security team will review your request and contact you shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="font-semibold">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-semibold">
            Phone Number (optional)
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Organization Type */}
        <div className="space-y-2">
          <Label className="font-semibold">Organization Type</Label>
          <Select value={formData.type} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="font-semibold">
            Subject / Short Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Brief title of your security concern"
            className={errors.subject ? 'border-red-500' : ''}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold">
            Detailed Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please provide a detailed explanation of your security or privacy concern..."
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.description}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="font-semibold">Upload Documents (optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition">
            <input
              id="files"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="files"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">
                {formData.files.length > 0
                  ? `${formData.files.length} file(s) selected`
                  : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500">
                PDF, DOC, DOCX, JPG, PNG
              </span>
            </label>
          </div>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            htmlFor="consent"
            className="text-sm cursor-pointer leading-relaxed flex-1"
          >
            I confirm the information provided is accurate and I agree to be
            contacted by our team. <span className="text-red-500">*</span>
          </Label>
        </div>

        {errors.consent && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.consent}
          </p>
        )}

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full">
          Submit Inquiry
        </Button>
      </form>
    </Card>
  )
}
