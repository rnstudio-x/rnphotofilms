import React from 'react'
import { FaBars } from 'react-icons/fa'

const CRMHeader = ({ title, subtitle, setMobileMenuOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden text-2xl text-charcoal"
        >
          <FaBars />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-charcoal">Admin User</p>
          <p className="text-xs text-gray-500">
            Last login: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-charcoal">
          AD
        </div>
      </div>
    </header>
  )
}

export default CRMHeader
