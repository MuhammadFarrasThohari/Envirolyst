import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Map, APIProvider } from '@vis.gl/react-google-maps'
import './App.css'

// pages
import AnalysisResults from './pages/AnalysisResults'
import LandingPage from './pages/LandingPage'
import LocationSelector from './pages/LocationSelector'
import NearbyInitiatives from './pages/NearbyInitiatives'

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
    {
      path: "/initiatives",
      element: <NearbyInitiatives />
    },
  ])

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
      onLoad={() => console.log("Google Maps API loaded successfully")}>
      <RouterProvider router={router} />
    </APIProvider>
  )
}

export default App
