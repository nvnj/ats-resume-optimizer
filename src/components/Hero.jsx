import React from 'react'

function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Something
            <span className="text-primary-600"> Amazing</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create modern, responsive web applications with cutting-edge technology. 
            Fast, scalable, and beautiful by default.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">
              Start Building
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <div className="w-64 h-48 bg-gradient-to-br from-primary-100 to-blue-200 rounded-xl flex items-center justify-center">
              <svg className="w-24 h-24 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Your amazing app here</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

