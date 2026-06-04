'use client'

import React, { createContext, useContext } from 'react'

const GlobalSettingsContext = createContext<any>(null)

export function GlobalSettingsProvider({ settings, children }: { settings: any, children: React.ReactNode }) {
  return (
    <GlobalSettingsContext.Provider value={settings}>
      {children}
    </GlobalSettingsContext.Provider>
  )
}

export function useGlobalSettings() {
  return useContext(GlobalSettingsContext)
}
