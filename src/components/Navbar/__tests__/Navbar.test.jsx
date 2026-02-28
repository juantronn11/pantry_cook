// Unit tests for Navbar component (src/components/Navbar/Navbar.jsx)
//
// Navbar uses useRecipeContext and React Router, so we wrap it in both
// a RecipeProvider and a MemoryRouter for tests.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RecipeProvider } from '../../../context/RecipeContext'
import Navbar from '../Navbar'

// Helper: renders Navbar wrapped in the providers it depends on
function renderNavbar() {
  return render(
    <MemoryRouter>
      <RecipeProvider>
        <Navbar />
      </RecipeProvider>
    </MemoryRouter>
  )
}

describe('Navbar', () => {

  it('renders the app name "Pantry Cook"', () => {
    renderNavbar()
    expect(screen.getByText('Pantry Cook')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderNavbar()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Saved Recipes')).toBeInTheDocument()
    expect(screen.getByText('New Search')).toBeInTheDocument()
  })

  it('renders the hamburger button', () => {
    renderNavbar()
    expect(screen.getByTitle('Open navigation menu')).toBeInTheDocument()
  })

  it('toggles navLinksOpen class when hamburger is clicked', async () => {
    const user = userEvent.setup()
    renderNavbar()

    const hamburger = screen.getByTitle('Open navigation menu')
    const navList = screen.getByRole('list')

    // Initially no navLinksOpen class
    expect(navList.className).not.toContain('navLinksOpen')

    // Click hamburger — should add navLinksOpen
    await user.click(hamburger)
    expect(navList.className).toContain('navLinksOpen')

    // Click again — should remove it
    await user.click(hamburger)
    expect(navList.className).not.toContain('navLinksOpen')
  })

  it('has correct tooltip titles on all elements', () => {
    renderNavbar()
    expect(screen.getByTitle('Go to home page')).toBeInTheDocument()
    expect(screen.getByTitle('Open navigation menu')).toBeInTheDocument()
    expect(screen.getByTitle('Search for recipes by ingredient')).toBeInTheDocument()
    expect(screen.getByTitle('View your previous searches')).toBeInTheDocument()
    expect(screen.getByTitle('View your saved recipes')).toBeInTheDocument()
    expect(screen.getByTitle('Clear current search and start over')).toBeInTheDocument()
  })
})
