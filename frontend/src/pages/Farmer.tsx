import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useI18n } from "../i18n/I18nContext";
import VoiceInput from "../components/VoiceInput";

function Farmer() {
  const { t } = useI18n();
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [newBatch, setNewBatch] = useState({
    product: "",
    variety: "",
    weight: "",
    harvestDate: "",
    basePrice: "",
    certifications: [] as string[],
    photos: [] as string[],
    farmerName: "",
    farmerId: ""
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for farmer dashboard (will be replaced with real data)
  const farmerData = {
    name: user?.username || "Green Valley Farm",
    location: "Punjab, India",
    rating: 4.8,
    totalBatches: products.length,
    activeBatches: products.filter(p => p.status === 'ACTIVE').length,
    totalEarnings: 245000,
    monthlyEarnings: 45000
  };

  // Mock recent batches data
  const recentBatches = products.length > 0 ? products.slice(0, 5).map((product, index) => ({
    id: product.productId || `BATCH-${index + 1}`,
    product: product.productType || "Sample Product",
    variety: product.variety || "Standard",
    weight: product.batchSize || "25 kg",
    status: product.status || "Ready for Pickup",
    createdDate: new Date(product.createdAt || Date.now()).toLocaleDateString(),
    buyer: "Agro Supply Co.",
    price: product.basePrice || 45,
    qrGenerated: true
  })) : [
    {
      id: "BATCH-001",
      product: "Organic Tomatoes",
      variety: "Roma",
      weight: "50 kg",
      status: "Ready for Pickup",
      createdDate: "2024-01-15",
      buyer: "Agro Supply Co.",
      price: 45,
      qrGenerated: true
    },
    {
      id: "BATCH-002", 
      product: "Fresh Carrots",
      variety: "Nantes",
      weight: "30 kg",
      status: "In Transit",
      createdDate: "2024-01-14",
      buyer: "Fresh Mart",
      price: 35,
      qrGenerated: true
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllProducts();
      setProducts(response.products || []);
    } catch (error: any) {
      console.error('Failed to load products:', error);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const certificationOptions = ["Organic", "Fair Trade", "Local", "Pesticide Free", "Non-GMO"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready for Pickup": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Transit": return "bg-blue-100 text-blue-800 border-blue-200";
      case "At Retailer": return "bg-green-100 text-green-800 border-green-200";
      case "Sold": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCertificationToggle = (cert: string) => {
    setNewBatch(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleCreateBatch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const farmerDetails = {
        name: user?.username || "Farmer",
        location: "Punjab, India",
        phone: user?.phone || "+91-9876543210"
      };

      const productDetails = {
        productType: newBatch.product,
        variety: newBatch.variety,
        batchSize: `${newBatch.weight} kg`,
        harvestDate: newBatch.harvestDate,
        basePrice: parseFloat(newBatch.basePrice),
        certifications: newBatch.certifications
      };

      const response = await apiService.registerProduct(farmerDetails, productDetails);
      
      if (response.success) {
        // Generate QR code for the new product
        try {
          await apiService.saveQRCode(response.productId);
        } catch (qrError) {
          console.warn('QR code generation failed:', qrError);
        }

        // Reload products
        await loadProducts();
        
        setShowCreateBatch(false);
        setNewBatch({
          product: "",
          variety: "",
          weight: "",
          harvestDate: "",
          basePrice: "",
          certifications: [],
          photos: [],
          farmerName: "",
          farmerId: ""
        });
      } else {
        setError(response.error || 'Failed to create product');
      }
    } catch (error: any) {
      console.error('Failed to create product:', error);
      setError(error.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen textured-bg farm-bg font-body">
      {/* Header */}
      <header className="rustic-header shadow-lg border-b-2 border-warm-brown">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg swaying-leaf hand-drawn-icon">🌱</span>
              </div>
              <span className="text-xl font-bold text-white drop-shadow-sm font-heading">{t('app_name')}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-green-100">{t('retailer_welcome')}, {farmerData.name}</span>
              <button className="text-white hover:text-green-200 bg-white bg-opacity-10 px-3 py-1 rounded-lg backdrop-blur-sm transition-colors">
                {t('profile')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-deep-green mb-2 drop-shadow-sm font-heading">{t('farmer_dashboard')}</h1>
              <p className="text-warm-brown bg-soft-cream px-4 py-2 rounded-full shadow-sm font-body">{farmerData.location} • ⭐ {farmerData.rating}/5</p>
            </div>
            <button
              onClick={() => setShowCreateBatch(true)}
              className="rustic-btn px-6 py-3 font-medium flex items-center gap-2 font-body"
            >
              <span className="hand-drawn-icon">➕</span>
              {t('create_new_batch')}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="parchment-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warm-brown text-sm font-body">{t('total_batches')}</span>
              <span className="text-2xl hand-drawn-icon">📦</span>
            </div>
            <div className="text-2xl font-bold text-deep-green font-heading">{farmerData.totalBatches}</div>
          </div>
          
          <div className="parchment-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warm-brown text-sm font-body">{t('active_batches')}</span>
              <span className="text-2xl hand-drawn-icon">🚛</span>
            </div>
            <div className="text-2xl font-bold text-deep-green font-heading">{farmerData.activeBatches}</div>
          </div>
          
          <div className="parchment-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warm-brown text-sm font-body">{t('total_earnings')}</span>
              <span className="text-2xl hand-drawn-icon">💰</span>
            </div>
            <div className="text-2xl font-bold text-accent-yellow font-heading">₹{farmerData.totalEarnings.toLocaleString()}</div>
          </div>
          
          <div className="parchment-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warm-brown text-sm font-body">{t('this_month')}</span>
              <span className="text-2xl hand-drawn-icon">📈</span>
            </div>
            <div className="text-2xl font-bold text-accent-yellow font-heading">₹{farmerData.monthlyEarnings.toLocaleString()}</div>
          </div>
        </motion.div>

        {/* Recent Batches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rustic-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('recent_batches')}</h2>
            <button className="text-green-600 hover:text-green-700 font-medium">{t('view_all')}</button>
          </div>
          
          <div className="space-y-4">
            {recentBatches.map((batch) => (
              <div key={batch.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{batch.product}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">
                      ID: {batch.id} • {batch.variety} • {batch.weight}
                    </p>
                    <p className="text-gray-500 text-sm">{t('created')}: {batch.createdDate} • {t('buyer')}: {batch.buyer}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">₹{batch.price}/kg</div>
                      <div className="text-sm text-gray-500">{t('base_price')}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/trace/${batch.id}`}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                      >
                        {t('track')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create Batch Modal */}
      {showCreateBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('create_new_batch_title')}</h2>
              <button
                onClick={() => setShowCreateBatch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Farmer Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👨‍🌾 Farmer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VoiceInput
                    value={newBatch.farmerName}
                    onChange={(value) => setNewBatch(prev => ({ ...prev, farmerName: value }))}
                    placeholder="Enter farmer name"
                    label="Farmer Name *"
                  />
                  <VoiceInput
                    value={newBatch.farmerId}
                    onChange={(value) => setNewBatch(prev => ({ ...prev, farmerId: value }))}
                    placeholder="Enter farmer ID"
                    label="Farmer ID *"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('product_name')} *</label>
                  <input
                    type="text"
                    value={newBatch.product}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, product: e.target.value }))}
                    placeholder="e.g., Organic Tomatoes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('variety')} *</label>
                  <input
                    type="text"
                    value={newBatch.variety}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, variety: e.target.value }))}
                    placeholder="e.g., Roma"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('weight_kg')} *</label>
                  <input
                    type="number"
                    value={newBatch.weight}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('base_price_per_kg')} *</label>
                  <input
                    type="number"
                    value={newBatch.basePrice}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, basePrice: e.target.value }))}
                    placeholder="45"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('harvest_date')} *</label>
                <input
                  type="date"
                  value={newBatch.harvestDate}
                  onChange={(e) => setNewBatch(prev => ({ ...prev, harvestDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('certifications_label')}</label>
                <div className="flex flex-wrap gap-2">
                  {certificationOptions.map((cert) => (
                    <button
                      key={cert}
                      onClick={() => handleCertificationToggle(cert)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newBatch.certifications.includes(cert)
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {newBatch.certifications.includes(cert) ? "✓ " : ""}{cert}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('product_photos')}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600 mb-2">{t('click_to_upload')}</p>
                  <p className="text-sm text-gray-500">{t('png_jpg_hint')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowCreateBatch(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleCreateBatch}
                  disabled={!newBatch.product || !newBatch.variety || !newBatch.weight || !newBatch.basePrice || !newBatch.harvestDate || !newBatch.farmerName || !newBatch.farmerId}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>📦</span>
                  {t('create_batch') || 'Create Batch'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Farmer;