import React from 'react'

export default function Footer() {
  return (
   <footer className='bg-gray-900 text-gray-300 py-8'>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo or Brand */}
        <div className="text-lg font-semibold text-white">Brevity</div>

        {/* Navigation Links */}
        <nav className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </nav>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.28 4.28 0 0 0 1.88-2.37 8.52 8.52 0 0 1-2.7 1.03A4.24 4.24 0 0 0 16.06 4a4.24 4.24 0 0 0-4.18 5.2A12 12 0 0 1 3.15 5.4a4.24 4.24 0 0 0 1.31 5.67 4.16 4.16 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.4 4.15 4.2 4.2 0 0 1-1.91.07 4.24 4.24 0 0 0 3.96 2.95A8.49 8.49 0 0 1 2 19.54a12 12 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.36 8.36 0 0 0 22.46 6z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.6 3H4.4C3.63 3 3 3.63 3 4.4v15.2c0 .77.63 1.4 1.4 1.4h8.12v-6.59h-2.2v-2.58h2.2V9.05c0-2.18 1.33-3.37 3.26-3.37.92 0 1.71.07 1.94.1v2.25h-1.33c-1.04 0-1.24.49-1.24 1.22v1.6h2.49l-.33 2.58h-2.16V21h4.23c.77 0 1.4-.63 1.4-1.4V4.4c0-.77-.63-1.4-1.4-1.4z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 3.6 8.06 8 8.66v-6.13h-2.4V12h2.4v-1.8c0-2.35 1.38-3.66 3.49-3.66.7 0 1.45.05 1.94.1v2.1h-1.3c-1.02 0-1.35.49-1.35 1.24V12h2.68l-.35 2.57h-2.33v6.13c4.4-.6 8-4.24 8-8.66 0-5.52-4.48-10-10-10z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} Brevity. All rights reserved.
      </div>
   </footer>
  )
}
