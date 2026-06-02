'use client'

import mermaid from 'mermaid'
import { useEffect, useId, useRef } from 'react'
import { useTheme } from 'next-themes'

type MermaidProps = {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    let cancelled = false

    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    })

    const renderChart = async () => {
      if (!containerRef.current) return

      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim())
        if (!cancelled) {
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<pre>${String(error)}</pre>`
        }
      }
    }

    renderChart()

    return () => {
      cancelled = true
    }
  }, [chart, id, resolvedTheme])

  return (
    <div
      ref={containerRef}
      className="mermaid my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full"
      aria-label="Mermaid diagram"
    />
  )
}
