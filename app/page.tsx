"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { type BlogPost } from "@/lib/blog"

export default function BlogHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set page title
    document.title = "BlogBot - AI-Powered SEO Content Generator"
  }, [])

  useEffect(() => {
    // Load blog posts from API
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blogs')
        if (response.ok) {
          const data = await response.json()
          // Firebase API returns { posts: [] } format
          setBlogPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const featuredPosts = blogPosts.slice(0, 3)
  const recentPosts = blogPosts.slice(3, 6)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">BlogBot</h1>
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
              <Link href="/about" className="block px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50">
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
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-semibold text-gray-900 mb-8 leading-tight tracking-tight">
              AI-Powered Content
              <span className="block text-gray-700">for the Modern Web</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Generate SEO-optimized blog posts instantly with AI. From keyword research to content creation, BlogBot handles it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/blogs">
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Explore Articles
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Generate comprehensive blog posts in seconds with advanced AI technology.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2m-2 6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">SEO Optimized</h3>
              <p className="text-gray-600 leading-relaxed">Built-in keyword research and optimization ensures maximum visibility.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Content</h3>
              <p className="text-gray-600 leading-relaxed">AI-powered research and competitor analysis for engaging content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h3 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">Featured Stories</h3>
              <p className="text-lg text-gray-600">Discover our latest AI-generated insights and trends</p>
            </div>
            <Link href="/blogs">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-100 animate-pulse"></div>
                  <div className="p-8">
                    <div className="h-4 bg-gray-100 animate-pulse rounded-full mb-4 w-20"></div>
                    <div className="h-6 bg-gray-100 animate-pulse rounded-full mb-4"></div>
                    <div className="h-16 bg-gray-100 animate-pulse rounded-xl mb-6"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded-full w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="group cursor-pointer bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-gray-300/50">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg?height=300&width=400"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors flex items-center">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h3 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">Recent Articles</h3>
                <p className="text-lg text-gray-600">Stay up to date with our latest insights</p>
              </div>
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="group cursor-pointer bg-white rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-gray-300/50">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg?height=300&width=400"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors flex items-center">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">Stay Updated</h3>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get notified when new AI-generated content is published. Quality articles created by BlogBot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white p-2 rounded-2xl shadow-lg border border-gray-200/50">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-lg"
            />
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-md">
              Subscribe
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
