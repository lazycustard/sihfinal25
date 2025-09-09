import React from 'react';
import { Link } from 'react-router-dom';
import RoleCard from '../RoleCard';

const Index: React.FC = () => {
  const roles = [
    {
      title: 'Farmer',
      description: 'Register products and manage farm operations',
      icon: '🌾',
      link: '/farmer',
      color: 'border-green-500',
      features: [
        'Register new products',
        'Generate QR codes',
        'Track product batches',
        'Manage farm inventory'
      ]
    },
    {
      title: 'Distributor',
      description: 'Handle product distribution and logistics',
      icon: '🚚',
      link: '/distributor',
      color: 'border-blue-500',
      features: [
        'Receive products from farmers',
        'Update product locations',
        'Transfer ownership',
        'Manage distribution network'
      ]
    },
    {
      title: 'Retailer',
      description: 'Manage retail operations and customer sales',
      icon: '🏪',
      link: '/retailer',
      color: 'border-purple-500',
      features: [
        'Receive products from distributors',
        'Update inventory status',
        'Track sales',
        'Manage retail operations'
      ]
    },
    {
      title: 'Consumer',
      description: 'Verify product authenticity and traceability',
      icon: '👥',
      link: '/consumer',
      color: 'border-orange-500',
      features: [
        'Scan QR codes',
        'Verify product authenticity',
        'View product journey',
        'Report issues'
      ]
    },
    {
      title: 'Admin',
      description: 'System administration and analytics',
      icon: '⚙️',
      link: '/admin',
      color: 'border-red-500',
      features: [
        'System overview',
        'User management',
        'Analytics dashboard',
        'System configuration'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                FarmTrace
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Blockchain-powered product traceability system ensuring transparency from farm to consumer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/consumer"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors"
              >
                Verify Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h2>
          <p className="text-lg text-gray-600">
            Select your role to access the appropriate dashboard and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <RoleCard key={index} {...role} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FarmTrace?
            </h2>
            <p className="text-lg text-gray-600">
              Advanced blockchain technology for complete product transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Immutable</h3>
              <p className="text-gray-600">
                Blockchain technology ensures data integrity and prevents tampering
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Integration</h3>
              <p className="text-gray-600">
                Easy scanning and verification with QR code technology
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track products in real-time throughout the supply chain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
