"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { BlogPost } from "@/lib/blog"
import ReactMarkdown from 'react-markdown'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.slug}`)
        if (response.ok) {
          const postData = await response.json()
          setPost(postData)
        } else if (response.status === 404) {
          setError('Blog post not found')
        } else {
          setError('Failed to load blog post')
        }
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError('Failed to load blog post')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchBlogPost()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Blog post not found'}
          </h1>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>
            {post.keywords && post.keywords.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {post.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{post.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">{post.excerpt}</p>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-sm text-muted-foreground">Keywords:</span>
              {post.keywords.map((keyword: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-12 mb-6 first:mt-0 text-foreground" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground" {...props} />,
                p: ({node, ...props}) => <p className="mb-6 text-foreground leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="mb-6 space-y-2 text-foreground" {...props} />,
                ol: ({node, ...props}) => <ol className="mb-6 space-y-2 text-foreground" {...props} />,
                li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-6" {...props} />
                ),
                code: ({node, ...props}) => (
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props} />
                ),
                pre: ({node, ...props}) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6" {...props} />
                ),
              }}
            >
              {post.content || ''}
            </ReactMarkdown>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{post.category}</Badge>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  )
}
