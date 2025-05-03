"use client"

import { useState, useEffect } from "react"
import { getStats, incrementAndLog } from "./counter"

export default function HomePage() {
  const [stats, setStats] = useState(() => getStats())

  useEffect(() => {
    document.title = `Count: ${stats.count}`
  }, [stats])

  const handleClick = () => {
    incrementAndLog()
    setStats(getStats())
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Current count: {stats.count}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        Increment
      </button>
    </div>
  )
}
