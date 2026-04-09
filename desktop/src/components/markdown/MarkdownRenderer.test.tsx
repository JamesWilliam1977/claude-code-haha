import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { MarkdownRenderer } from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('applies document prose classes and custom width classes', () => {
    const { container } = render(
      <MarkdownRenderer
        content={'# Skill Title\n\nReadable paragraph text.'}
        variant="document"
        className="mx-auto max-w-[72ch]"
      />,
    )

    const root = container.firstChild as HTMLDivElement
    expect(root).toBeInTheDocument()
    expect(root.className).toContain('prose-p:text-[15px]')
    expect(root.className).toContain('prose-h2:border-b')
    expect(root.className).toContain('mx-auto')
    expect(root.className).toContain('max-w-[72ch]')
    expect(screen.getByText('Skill Title')).toBeInTheDocument()
    expect(screen.getByText('Readable paragraph text.')).toBeInTheDocument()
  })

  it('keeps default variant free of document-only typography classes', () => {
    const { container } = render(
      <MarkdownRenderer content={'## Default Heading\n\nBody copy.'} />,
    )

    const root = container.firstChild as HTMLDivElement
    expect(root).toBeInTheDocument()
    expect(root.className).not.toContain('prose-p:text-[15px]')
    expect(root.className).not.toContain('prose-h2:border-b')
    expect(screen.getByText('Default Heading')).toBeInTheDocument()
    expect(screen.getByText('Body copy.')).toBeInTheDocument()
  })
})
