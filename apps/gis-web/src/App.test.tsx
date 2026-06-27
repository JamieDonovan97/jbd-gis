import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the platform heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /gis platform/i }),
    ).toBeInTheDocument()
  })
})
