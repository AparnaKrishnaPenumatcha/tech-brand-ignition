
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GlobalNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/profile-builder', label: 'Profile Builder', badge: 'Build' },
    { path: '/', label: 'Portfolio Page', badge: 'View' },
    { path: '/career-tools', label: 'Career Tools', badge: 'AI' }
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-navy-900">
            Future<span className="text-electric-500">Leader</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center gap-2 ${
                      isActive 
                        ? "bg-electric-500 hover:bg-electric-600 text-white" 
                        : "hover:bg-electric-50 hover:text-electric-600"
                    }`}
                  >
                    {item.label}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        isActive ? "bg-white/20 text-white" : "bg-electric-100 text-electric-600"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <select 
              value={location.pathname} 
              onChange={(e) => window.location.href = e.target.value}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalNavigation;
