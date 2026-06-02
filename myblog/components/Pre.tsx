import Pre from 'pliny/ui/Pre'
import { isValidElement, ReactNode } from 'react'
import Mermaid from './Mermaid'

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }

  if (isValidElement(node)) {
    return extractText(node.props.children)
  }

  return ''
}

function getMermaidChart(children: ReactNode): string | null {
  if (!isValidElement(children)) {
    return null
  }

  const className = children.props.className
  if (typeof className !== 'string' || !className.includes('language-mermaid')) {
    return null
  }

  const chart = extractText(children.props.children).trim()
  return chart || null
}

export default function PreWithMermaid(props: React.ComponentProps<'pre'>) {
  const chart = getMermaidChart(props.children)

  if (chart) {
    return <Mermaid chart={chart} />
  }

  return <Pre {...props} />
}
