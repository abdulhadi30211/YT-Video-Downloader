import React, { useState } from 'react';
import { Youtube, Globe, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Tublyx Logo" className="h-8 w-8 rounded-md" />
          <h1 className="text-2xl font-bold">Tublyx</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'text-white font-semibold' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                <Youtube className="h-5 w-5" />
                YouTube
              </Link>
            </li>
            <li>
              <Link 
                to="/universal" 
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/universal' ? 'text-white font-semibold' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                <Globe className="h-5 w-5" />
                Universal
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/about' ? 'text-white font-semibold' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/help" 
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/help' ? 'text-white font-semibold' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                Help
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/contact' ? 'text-white font-semibold' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy" 
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/privacy' ? 'text-white font-semibold' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
        <div className="md:hidden">
          <button 
            className="p-2 rounded-md text-primary-foreground/80 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-4 top-16 mt-2 w-48 bg-card rounded-md shadow-lg py-2 z-50 border">
              <Link 
                to="/" 
                className={`block px-4 py-2 ${location.pathname === '/' ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                YouTube
              </Link>
              <Link 
                to="/universal" 
                className={`block px-4 py-2 ${location.pathname === '/universal' ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Universal
              </Link>
              <Link 
                to="/about" 
                className={`block px-4 py-2 ${location.pathname === '/about' ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/help" 
                className={`block px-4 py-2 ${location.pathname === '/help' ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <Link 
                to="/contact" 
                className={`block px-4 py-2 ${location.pathname === '/contact' ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/privacy" 
                className={`block px-4 py-2 ${location.pathname === '/privacy' ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;