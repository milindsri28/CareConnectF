'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import { useState, useEffect } from 'react'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Client-side check to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // After the component mounts, we set 'mounted' to true
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent rendering the theme-related components on the server
    return null
  }

  return (
    <NextThemesProvider {...props} attribute="class" disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
