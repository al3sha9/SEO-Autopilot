"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle, Menu, X } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    }, 3000)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "hello@blogbot.com",
      action: "mailto:hello@blogbot.com"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 24/7",
      action: "#"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      contact: "San Francisco, CA",
      action: "#"
    }
  ]

  const faqs = [
    {
      question: "How does BlogBot generate content?",
      answer: "BlogBot uses advanced AI technology including Google's Gemini AI and LangChain to create high-quality, SEO-optimized content. Our multi-agent system conducts keyword research, competitor analysis, and generates engaging blog posts tailored to your needs."
    },
    {
      question: "What types of content can BlogBot create?",
      answer: "BlogBot can generate blog posts across various categories including technology, business, design, marketing, lifestyle, and culture. Each post includes SEO optimization, relevant images, and social media content."
    },
    {
      question: "How long does it take to generate a blog post?",
      answer: "BlogBot typically generates a complete blog post in 30-60 seconds, including keyword research, content creation, image generation, and SEO optimization."
    },
    {
      question: "Can I customize the generated content?",
      answer: "Yes! BlogBot provides a solid foundation that you can edit, customize, and enhance to match your brand voice and specific requirements."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">BlogBot</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Home
            </Link>
            <Link href="/blogs" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Articles
            </Link>
            <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              About
            </Link>
            <Link href="/categories" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Categories
            </Link>
            <Link href="/contact" className="px-4 py-2 text-gray-900 bg-gray-50 text-sm font-medium transition-colors duration-200 rounded-lg">
              Contact
            </Link>
            <Link href="/dashboard" className="ml-4">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
              <Link href="/" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Home
              </Link>
              <Link href="/blogs" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Articles
              </Link>
              <Link href="/about" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                About
              </Link>
              <Link href="/categories" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Categories
              </Link>
              <Link href="/contact" className="block px-4 py-3 text-gray-900 bg-gray-50 text-sm font-medium transition-colors duration-200 rounded-lg">
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link href="/dashboard" className="block">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 text-sm font-medium rounded-full transition-all duration-200">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 mb-8 leading-tight tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Have questions about BlogBot? Need help getting started? We're here to help you succeed with AI-powered content creation.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              How Can We Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the best way to reach out to our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <a
                  key={index}
                  href={method.action}
                  className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/50 text-center"
                >
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-800 transition-colors">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {method.description}
                  </p>
                  <div className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                    {method.contact}
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="p-12">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-lg"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-3">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-lg"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-lg resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-3 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about BlogBot
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6 text-lg">
              Can't find what you're looking for?
            </p>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-semibold text-gray-900 mb-6">BlogBot</h4>
              <p className="text-gray-600 leading-relaxed text-lg max-w-md">
                AI-powered SEO content generator that creates optimized blog posts, conducts keyword research, and generates social media content automatically.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-6">Categories</h5>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/category/technology" className="hover:text-gray-900 transition-colors text-lg">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link href="/category/design" className="hover:text-gray-900 transition-colors text-lg">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="/category/business" className="hover:text-gray-900 transition-colors text-lg">
                    Business
                  </Link>
                </li>
                <li>
                  <Link href="/category/culture" className="hover:text-gray-900 transition-colors text-lg">
                    Culture
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-6">Connect</h5>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-gray-900 transition-colors text-lg">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-900 transition-colors text-lg">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-gray-900 transition-colors text-lg">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-900 transition-colors text-lg">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200/50 mt-16 pt-8 text-center">
            <p className="text-gray-500 text-lg">&copy; 2024 BlogBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
