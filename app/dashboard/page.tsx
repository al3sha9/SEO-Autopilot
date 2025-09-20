"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Copy, Download, Loader2, LogOut, ExternalLink, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { removeAuthCookie } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { createBlogPost } from "@/lib/blog"

interface SEOResults {
  keywords: string[]
  competitors: Array<{ title: string; url: string }>
  competitorInsights: string
  socialPosts: string[]
  slug: string
  title: string
  message: string
  imageUrl?: string
}

function DashboardContent() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<SEOResults | null>(null)
  const [createdBlogPost, setCreatedBlogPost] = useState<{ slug: string; title: string } | null>(null)
  const router = useRouter()

  const handleLogout = () => {
    removeAuthCookie()
    router.push("/")
  }

  const handleRunAgent = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setCreatedBlogPost(null) // Reset previous blog post
    setResults(null) // Reset previous results

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()

      const apiResults: SEOResults = {
        keywords: data.keywords,
        competitors: data.competitors || [],
        competitorInsights: data.competitorInsights,
        socialPosts: data.socialPosts,
        slug: data.slug,
        title: data.title,
        message: data.message,
      }

      setResults(apiResults)
      setCreatedBlogPost({ slug: data.slug, title: data.title })

    } catch (error) {
      console.error("Failed to generate content:", error)
      // You could add error state here
    }

    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const postOnX = (text: string) => {
    const tweetText = encodeURIComponent(text)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
  }

  const downloadBlogPost = async () => {
    if (!createdBlogPost?.slug) return

    try {
      const response = await fetch(`/api/blogs/${createdBlogPost.slug}`)
      const data = await response.json()
      
      if (data.content) {
        const blob = new Blob([data.content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${createdBlogPost.slug}-blog-post.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading blog post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">SEO Agent</h1>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How this works</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Generate SEO-optimized content instantly.
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Enter a topic and let the agent research, write, and prepare social media posts for you.
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-left block">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="e.g. Sustainable fashion"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
                onKeyDown={(e) => e.key === "Enter" && handleRunAgent()}
              />
            </div>

            <Button
              onClick={handleRunAgent}
              disabled={!topic.trim() || isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Run Agent"
              )}
            </Button>
          </div>
        </div>

        {createdBlogPost && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-green-800 font-medium">Blog post created successfully!</p>
                    <p className="text-green-700 text-sm">"{createdBlogPost.title}" has been published to your blog.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${createdBlogPost.slug}`, "_blank")}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Post
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("/", "_blank")}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      View Blog
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {results && (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="keywords" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="competitors">Competitor Insights</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="blog">Blog Post</TabsTrigger>
                <TabsTrigger value="social">Social Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="keywords">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Keywords</CardTitle>
                      <CardDescription>SEO keywords for your topic</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(results.keywords.join(", "))}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                          onClick={() => copyToClipboard(keyword)}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="competitors">
                <Card>
                  <CardHeader>
                    <CardTitle>Competitor Insights</CardTitle>
                    <CardDescription>Analysis of your topic's competitive landscape</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Competitor Analysis Insights */}
                      <div className="p-4 border border-border rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2 text-foreground">Analysis Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {results.competitorInsights || 'No competitor insights available.'}
                        </p>
                      </div>
                      
                      {/* Top Competitors */}
                      {results.competitors && results.competitors.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-foreground">Top 3 Search Results</h4>
                          <div className="space-y-3">
                            {results.competitors.map((competitor, index) => (
                              <div key={index} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-foreground mb-1 leading-tight">
                                      {index + 1}. {competitor.title}
                                    </h5>
                                    <a 
                                      href={competitor.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                                    >
                                      {competitor.url}
                                    </a>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(competitor.url, '_blank')}
                                    className="shrink-0"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Image</CardTitle>
                    <CardDescription>AI-generated blog banner and thumbnail</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.imageUrl ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <img 
                            src={results.imageUrl} 
                            alt={`Generated image for ${results.title}`}
                            className="w-full h-64 object-cover rounded-lg border border-border"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(results.imageUrl!)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Image URL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(results.imageUrl!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Full Size
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Image URL: <code className="text-xs bg-muted px-1 py-0.5 rounded">{results.imageUrl}</code></p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No image was generated for this blog post.</p>
                        <p className="text-sm mt-2">This may be because the Hugging Face API key is not configured.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blog">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Blog Post</CardTitle>
                      <CardDescription>SEO-optimized article automatically published to your blog</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {createdBlogPost && (
                        <Button variant="outline" size="sm" onClick={() => window.open(`/blog/${createdBlogPost.slug}`, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Blog Post
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={downloadBlogPost}>
                        <Download className="h-4 w-4 mr-2" />
                        Download as .txt
                      </Button>
                      {createdBlogPost && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/blog/${createdBlogPost.slug}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Published
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      {createdBlogPost ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Blog Post Created Successfully!</h3>
                          <p className="text-muted-foreground mb-4">
                            Your blog post "{createdBlogPost.title}" has been published.
                          </p>
                          <Button onClick={() => window.open(`/blog/${createdBlogPost.slug}`, '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Blog Post
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          Generate content to see your blog post here.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Posts</CardTitle>
                    <CardDescription>Ready-to-use social media captions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.socialPosts.map((post, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg relative">
                          <p className="text-foreground leading-relaxed pr-24">{post}</p>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(post)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => postOnX(post)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">Built with LangChain + Hugging Face</p>
        </footer>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
