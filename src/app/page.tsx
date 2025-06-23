import { Suspense } from 'react'
import NewsDisplay from '@/components/NewsDisplay'

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NewsDisplay />
      </Suspense>
    </div>
  )
}