'use client'

import { useMemo } from 'react'
import { remark } from 'remark'
import html from 'remark-html'

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  const htmlContent = useMemo(() => {
    try {
      const processedContent = remark()
        .use(html)
        .processSync(content)
      return String(processedContent)
    } catch (error) {
      console.error('Error processing markdown:', error)
      return content.replace(/\n/g, '<br>')
    }
  }, [content])

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="markdown-content"
    />
  )
}
