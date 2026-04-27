import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../../../src/components/ErrorBoundary/ErrorBoundary'

vi.mock('../../../src/helperFunctions/logError', () => ({
  logError: vi.fn(),
}))

function BrokenComponent() {
  throw new Error('Test render crash')
}

describe('ErrorBoundary', () => {
  it('renders children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    )

    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders fallback UI when a child component throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()

    consoleError.mockRestore()
  })

  it('does not render the broken child when hasError is true', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Test render crash')).not.toBeInTheDocument()

    consoleError.mockRestore()
  })
})
