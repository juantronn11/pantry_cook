// Unit tests for DownloadButton component (src/components/DownloadButton/DownloadButton.jsx)
//
// DownloadButton calls window.print() on click.
// We mock window.print to verify it gets called without opening a real print dialog.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DownloadButton from '../DownloadButton'

describe('DownloadButton', () => {

  it('renders with "Download / Print" text', () => {
    render(<DownloadButton />)
    expect(screen.getByText('Download / Print')).toBeInTheDocument()
  })

  it('calls window.print() when clicked', async () => {
    const user = userEvent.setup()
    // Replace window.print with a mock so it doesn't open a real dialog
    window.print = vi.fn()

    render(<DownloadButton />)
    await user.click(screen.getByText('Download / Print'))

    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it('renders as a button element', () => {
    render(<DownloadButton />)
    const button = screen.getByText('Download / Print')
    expect(button.tagName).toBe('BUTTON')
  })
})
