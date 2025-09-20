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
          const posts = await response.json()
          setBlogPosts(posts)
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">BlogBot</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-muted-foreground transition-colors">
              Home
            </Link>
            <Link href="/blogs" className="text-foreground hover:text-muted-foreground transition-colors">
              Articles
            </Link>
            <Link href="/about" className="text-foreground hover:text-muted-foreground transition-colors">
              About
            </Link>
            <Link href="/categories" className="text-foreground hover:text-muted-foreground transition-colors">
              Categories
            </Link>
            <Link href="/contact" className="text-foreground hover:text-muted-foreground transition-colors">
              Contact
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="/" className="block text-foreground hover:text-muted-foreground transition-colors">
                Home
              </Link>
              <Link href="/blogs" className="block text-foreground hover:text-muted-foreground transition-colors">
                Articles
              </Link>
              <Link href="/about" className="block text-foreground hover:text-muted-foreground transition-colors">
                About
              </Link>
              <Link href="/categories" className="block text-foreground hover:text-muted-foreground transition-colors">
                Categories
              </Link>
              <Link href="/contact" className="block text-foreground hover:text-muted-foreground transition-colors">
                Contact
              </Link>
              <Link href="/dashboard" className="block">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            AI-Powered Content
            <span className="block">for the Modern Web</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Generate SEO-optimized blog posts instantly with AI. From keyword research to content creation, BlogBot handles it all.
          </p>
          <Link href="/blogs">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Explore Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-foreground">Featured Stories</h3>
            <Link href="/blogs">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border">
                  <div className="aspect-[4/3] bg-muted animate-pulse rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted animate-pulse rounded mb-3"></div>
                    <div className="h-6 bg-muted animate-pulse rounded mb-3"></div>
                    <div className="h-16 bg-muted animate-pulse rounded mb-4"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group cursor-pointer border-border hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={post.image || "/placeholder.svg?height=300&width=400"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors text-balance">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-pretty">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-bold text-foreground">Recent Articles</h3>
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group cursor-pointer border-border hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={post.image || "/placeholder.svg?height=300&width=400"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors text-balance">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground mb-4 leading-relaxed text-pretty">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                        <Button variant="ghost" size="sm" className="group-hover:text-primary">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Get notified when new AI-generated content is published. Quality articles created by BlogBot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-foreground mb-4">BlogBot</h4>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered SEO content generator that creates optimized blog posts, conducts keyword research, and generates social media content automatically.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Categories</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/category/technology" className="hover:text-foreground transition-colors">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link href="/category/design" className="hover:text-foreground transition-colors">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="/category/business" className="hover:text-foreground transition-colors">
                    Business
                  </Link>
                </li>
                <li>
                  <Link href="/category/culture" className="hover:text-foreground transition-colors">
                    Culture
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Connect</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BlogBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
