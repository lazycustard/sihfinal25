import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
                <span className="text-xl font-bold text-gray-800">FarmTrace</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold">{user?.username}</span>
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 FarmTrace. Blockchain-powered product traceability.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
