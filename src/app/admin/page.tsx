'use client'

import { useState } from 'react'
import Link from 'next/link'
import Auth from '@/components/Auth'
import NewsForm from '@/components/NewsForm'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            ⚙️ Admin Panel
          </h1>

          {!isAuthenticated ? (
            <Auth onLogin={() => setIsAuthenticated(true)} />
          ) : (
            <div>
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✅ Admin Login Successful!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  अब आप news add कर सकते हैं या news page पर जाकर edit/delete कर सकते हैं।
                </p>
              </div>

              <NewsForm />

              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
                >
                  📰 View News & Edit/Delete
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
