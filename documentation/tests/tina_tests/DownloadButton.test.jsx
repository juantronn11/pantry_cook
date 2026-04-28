import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DownloadButton from '../../../src/components/DownloadButton/DownloadButton.jsx'

describe('DownloadButton', () => {
  it('renders the download button', () => {
    render(<DownloadButton />)
    expect(screen.getByRole('button', { name: /download \/ print/i })).toBeInTheDocument()
  })

  it('calls window.print when clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<DownloadButton />)

    fireEvent.click(screen.getByRole('button'))

    expect(printSpy).toHaveBeenCalledTimes(1)
  })
})
