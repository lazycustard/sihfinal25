import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiService from "../services/api";
import QRScanner from "../QRScanner";
import { useI18n } from "../i18n/I18nContext";

function Consumer() {
  const { t } = useI18n();
  const [searchId, setSearchId] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();

  // Mock data for consumer dashboard
  const recentTraces = [
    {
      id: "TOM001",
      product: "Organic Tomatoes",
      farmer: "Green Valley Farm",
      location: "Punjab, India",
      tracedDate: "2024-01-17",
      freshnessScore: 92,
      price: 65,
      image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
      certifications: ["Organic", "Fair Trade"]
    },
    {
      id: "CAR002",
      product: "Carrots",
      farmer: "Sunrise Organic Farm",
      location: "Maharashtra, India",
      tracedDate: "2024-01-16",
      freshnessScore: 88,
      price: 42,
      image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400",
      certifications: ["Organic", "Local"]
    },
    {
      id: "POT003",
      product: "Red Potatoes",
      farmer: "Mountain View Farm",
      location: "Himachal Pradesh, India",
      tracedDate: "2024-01-15",
      freshnessScore: 85,
      price: 28,
      image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400",
      certifications: ["Pesticide Free"]
    }
  ];

  const favorites = [
    {
      id: "GVF001",
      name: "Green Valley Farm",
      location: "Punjab, India",
      rating: 4.8,
      specialties: ["Tomatoes", "Peppers", "Herbs"],
      image: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
      lastOrder: "2024-01-17"
    },
    {
      id: "SOF002",
      name: "Sunrise Organic Farm",
      location: "Maharashtra, India", 
      rating: 4.6,
      specialties: ["Root Vegetables", "Leafy Greens"],
      image: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400",
      lastOrder: "2024-01-16"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "price_drop",
      message: "Organic Tomatoes from Green Valley Farm dropped to ₹58/kg",
      time: "2 hours ago",
      icon: "💰"
    },
    {
      id: 2,
      type: "new_harvest",
      message: "Fresh harvest available from Sunrise Organic Farm",
      time: "1 day ago",
      icon: "🌱"
    },
    {
      id: 3,
      type: "certification",
      message: "Mountain View Farm received new Fair Trade certification",
      time: "3 days ago",
      icon: "✅"
    }
  ];

  const handleTrace = async () => {
    if (!searchId.trim()) {
      setError("Please enter a product ID");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Verify the product and get its details
      const response = await apiService.verifyProduct(searchId.trim());
      
      if (response.success) {
        // Navigate to trace view with the product data
        navigate(`/trace/${searchId.trim()}`, { state: { product: response.product } });
      } else {
        setError("Product not found or invalid ID");
      }
    } catch (error: any) {
      console.error('Trace failed:', error);
      setError(error.message || "Failed to trace product");
    } finally {
      setIsLoading(false);
    }
  };

  const getFreshnessColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen textured-bg farm-bg font-body">
      {/* Header */}
      <header className="wooden-signboard shadow-lg border-b-2 border-dark-brown">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg swaying-leaf hand-drawn-icon">🌱</span>
              </div>
              <span className="text-xl font-bold text-white drop-shadow-sm font-heading">{t('app_name')}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-violet-100">{t('consumer_welcome')}</span>
              <button className="text-white hover:text-violet-200 bg-white bg-opacity-10 px-3 py-1 rounded-lg backdrop-blur-sm transition-colors">
                {t('profile')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rustic-card p-6 mb-8"
        >
          <h1 className="text-2xl font-bold text-deep-green mb-4 drop-shadow-sm font-heading">{t('consumer_trace_food')}</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={t('consumer_enter_id_placeholder')}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleTrace()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleTrace}
                disabled={isLoading}
                className="px-6 py-3 rustic-btn font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed font-body"
              >
                {isLoading ? t('tracing') : t('trace')}
              </button>
              <button 
                onClick={() => setShowQRScanner(true)}
                className="px-4 py-3 rustic-btn-secondary rounded-lg transition-all font-body"
              >
                <span className="hand-drawn-icon">📱</span> {t('scan_qr')}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "recent"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t('consumer_recent_traces')}
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "favorites"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t('consumer_favorite_farms')}
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "alerts"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t('consumer_alerts')}
            </button>
          </div>
        </motion.div>

        {/* Recent Traces Tab */}
        {activeTab === "recent" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {recentTraces.map((trace) => (
              <div key={trace.id} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-white border-opacity-20" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
              }}>
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={trace.image}
                    alt={trace.product}
                    className="w-full md:w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{trace.product}</h3>
                        <p className="text-gray-600 mb-1">From: {trace.farmer}</p>
                        <p className="text-gray-500 text-sm mb-2">{trace.location}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {trace.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                            >
                              ✓ {cert}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">Traced on: {trace.tracedDate}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getFreshnessColor(trace.freshnessScore)} mb-1`}>
                          {trace.freshnessScore}%
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Freshness</p>
                        <div className="text-lg font-bold text-gray-900 mb-3">₹{trace.price}/kg</div>
                        <Link
                          to={`/trace/${trace.id}`}
                          className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Favorite Farms Tab */}
        {activeTab === "favorites" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {favorites.map((farm) => (
              <div key={farm.id} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-white border-opacity-20" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
              }}>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={farm.image}
                    alt={farm.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{farm.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{farm.location}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(farm.rating))}
                      </div>
                      <span className="text-sm text-gray-600">{farm.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {farm.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Last order: {farm.lastOrder}</p>
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-white border-opacity-20" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
              }}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{alert.icon}</div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-green-100 to-emerald-100 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-30"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
          }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 drop-shadow-sm">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl hover:bg-opacity-100 transition-all shadow-sm border border-white border-opacity-50">
              <span className="text-2xl">📱</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Scan QR Code</div>
                <div className="text-sm text-gray-600">Quick trace with camera</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl hover:bg-opacity-100 transition-all shadow-sm border border-white border-opacity-50">
              <span className="text-2xl">🔔</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Set Price Alerts</div>
                <div className="text-sm text-gray-600">Get notified of deals</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl hover:bg-opacity-100 transition-all shadow-sm border border-white border-opacity-50">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Compare Prices</div>
                <div className="text-sm text-gray-600">Find best deals</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={(productId) => {
            setSearchId(productId);
            setShowQRScanner(false);
            handleTrace();
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}

export default Consumer;