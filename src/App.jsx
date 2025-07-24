import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import AnalysisResults from './pages/AnalysisResults'
import LandingPage from './pages/LandingPage'
import LocationSelector from './pages/LocationSelector'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LocationSelector />
    },
    {
      path: "/result",
      element: <AnalysisResults />
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
