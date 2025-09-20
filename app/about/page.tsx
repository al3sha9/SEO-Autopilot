"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Target, Zap, Award, Menu, X } from "lucide-react"

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <Link href="/about" className="px-4 py-2 text-gray-900 bg-gray-50 text-sm font-medium transition-colors duration-200 rounded-lg">
              About
            </Link>
            <Link href="/categories" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Categories
            </Link>
            <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
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
              <Link href="/about" className="block px-4 py-3 text-gray-900 bg-gray-50 text-sm font-medium transition-colors duration-200 rounded-lg">
                About
              </Link>
              <Link href="/categories" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
                Categories
              </Link>
              <Link href="/contact" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
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
            About BlogBot
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            We're revolutionizing content creation with AI-powered tools that help businesses and creators generate high-quality, SEO-optimized blog posts in seconds.
          </p>
          <Link href="/dashboard">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-semibold text-gray-900 mb-8 tracking-tight">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                At BlogBot, we believe that great content should be accessible to everyone. Our AI-powered platform democratizes content creation, enabling businesses of all sizes to produce professional, engaging blog posts that drive results.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine cutting-edge AI technology with deep understanding of SEO best practices to deliver content that not only reads well but performs exceptionally in search rankings.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200/50">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
                  <div className="text-gray-600">Blog Posts Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at BlogBot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We constantly push the boundaries of what's possible with AI technology to deliver cutting-edge solutions.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Centric</h3>
              <p className="text-gray-600 leading-relaxed">
                Every feature we build is designed with our users' success in mind, ensuring intuitive and effective tools.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest standards in content generation, ensuring every blog post meets professional quality.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in everything we do, from our technology to our customer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              BlogBot leverages the latest in artificial intelligence and machine learning to deliver unparalleled content creation capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">LangChain Integration</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Advanced multi-agent system that coordinates keyword research, competitor analysis, and content generation seamlessly.
              </p>
              <div className="text-sm font-medium text-gray-900">Multi-Tool Architecture</div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Google Gemini AI</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Powered by Google's most advanced language model for natural, engaging content that resonates with your audience.
              </p>
              <div className="text-sm font-medium text-gray-900">State-of-the-art NLP</div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time Data</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Integration with Google Trends and web scraping for the most current and relevant content insights.
              </p>
              <div className="text-sm font-medium text-gray-900">Live Market Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of content creators who trust BlogBot to power their content strategy. Start creating amazing blog posts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Start Creating
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/blogs">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
                View Examples
              </Button>
            </Link>
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
