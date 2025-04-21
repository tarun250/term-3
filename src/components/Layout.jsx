import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { 
  FiHome, 
  FiDollarSign, 
  FiRefreshCw, 
  FiMessageSquare, 
  FiMenu, 
  FiX
} from 'react-icons/fi'

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [window.location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-primary-500 text-2xl" />
            <h1 className="text-xl font-bold">FinSight</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavItem to="/" icon={<FiHome />} text="Dashboard" />
            <NavItem to="/tracker" icon={<FiDollarSign />} text="Tracker" />
            <NavItem to="/convert" icon={<FiRefreshCw />} text="Converter" />
            <NavItem to="/quotes" icon={<FiMessageSquare />} text="Quotes" />
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-primary-100 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-primary-900 px-4 py-2 border-t border-primary-800 animate-fade-in">
            <div className="flex flex-col gap-2">
              <NavItem to="/" icon={<FiHome />} text="Dashboard" mobile />
              <NavItem to="/tracker" icon={<FiDollarSign />} text="Tracker" mobile />
              <NavItem to="/convert" icon={<FiRefreshCw />} text="Converter" mobile />
              <NavItem to="/quotes" icon={<FiMessageSquare />} text="Quotes" mobile />
            </div>
          </nav>
        )}
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <footer className="bg-primary-900 text-primary-400 text-sm py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} FinSight - Track your finances with insight</p>
        </div>
      </footer>
    </div>
  )
}

function NavItem({ to, icon, text, mobile = false }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-2 nav-link ${isActive ? 'active' : ''} ${
          mobile ? 'py-3 border-b border-primary-800 w-full' : ''
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  )
}

export default Layout