'use client'
import { Suspense } from 'react'
import NewsDisplay from './NewsDisplay'

export default function NewsDisplayWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsDisplay />
    </Suspense>
  )
}