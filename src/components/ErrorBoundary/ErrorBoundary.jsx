import { Component } from 'react'
import { logError } from '../../helperFunctions/logError.js'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logError(error.message, `ErrorBoundary:${info.componentStack?.split('\n')[1]?.trim() || 'unknown'}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>Try refreshing the page. If the problem persists, check your network connection or try logging out and back in.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
