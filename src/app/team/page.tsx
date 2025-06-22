'use client'

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">👥 हमारी टीम</h1>
      </div>

      {/* संरक्षक */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-6">
        <div className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
              सं
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              संरक्षक
            </h2>
            <h3 className="text-xl font-semibold text-purple-600">
              चीकू सिंह बुंदेला उर्फ दीवान जी
            </h3>
          </div>
        </div>
      </div>

      {/* प्रधान संपादक */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-6">
        <div className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
              प्र
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              प्रधान संपादक
            </h2>
            <h3 className="text-xl font-semibold text-red-600">
              दिगंत शुक्ला
            </h3>
          </div>
        </div>
      </div>

      {/* संपादक */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-6">
        <div className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
              सं
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              संपादक
            </h2>
            <h3 className="text-xl font-semibold text-green-600">
              अद्वय शुक्ला
            </h3>
          </div>
        </div>
      </div>

      {/* कार्यकारी संपादक */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
              का
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              कार्यकारी संपादक
            </h2>
            <h3 className="text-xl font-semibold text-blue-600">
              कामता प्रसाद
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}
