import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MultilingualProduct from '../components/MultilingualProduct';
import { motion } from "framer-motion";
import { useI18n } from '../i18n/I18nContext';

function Retailer() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("inventory");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newOrder, setNewOrder] = useState({
    product: "",
    quantity: "",
    supplier: "",
    expectedDate: "",
    notes: ""
  });

  // Mock data for retailer dashboard
  const retailerData = {
    name: "Fresh Mart Delhi",
    location: "Delhi, India",
    rating: 4.6,
    totalProducts: 156,
    lowStockItems: 8,
    monthlyRevenue: 125000,
    activeSuppliers: 12
  };

  const inventory = [
    {
      id: "TOM001",
      product: "Organic Tomatoes",
      supplier: "Green Valley Farm",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      costPrice: 45,
      sellingPrice: 65,
      margin: 44.4,
      status: "in_stock",
      lastRestocked: "2024-01-15",
      expiryDate: "2024-01-25",
      qualityScore: 92,
      category: "Vegetables"
    },
    {
      id: "CAR002",
      product: "Carrots",
      supplier: "Sunrise Organic Farm",
      currentStock: 12,
      minStock: 15,
      maxStock: 80,
      costPrice: 35,
      sellingPrice: 50,
      margin: 42.9,
      status: "low_stock",
      lastRestocked: "2024-01-14",
      expiryDate: "2024-01-22",
      qualityScore: 88,
      category: "Vegetables"
    },
    {
      id: "POT003",
      product: "potato",
      supplier: "Mountain View Farm",
      currentStock: 78,
      minStock: 25,
      maxStock: 120,
      costPrice: 25,
      sellingPrice: 35,
      margin: 40.0,
      status: "in_stock",
      lastRestocked: "2024-01-16",
      expiryDate: "2024-02-01",
      qualityScore: 85,
      category: "Vegetables"
    },
    {
      id: "APP001",
      product: "Apples",
      supplier: "Hill Valley Orchards",
      currentStock: 0,
      minStock: 20,
      maxStock: 60,
      costPrice: 60,
      sellingPrice: 85,
      margin: 41.7,
      status: "out_of_stock",
      lastRestocked: "2024-01-10",
      expiryDate: "2024-01-20",
      qualityScore: 90,
      category: "Fruits"
    }
  ];

  const incomingOrders = [
    {
      id: "ORD001",
      product: "Organic Spinach",
      supplier: "Green Valley Farm",
      quantity: 30,
      expectedDate: "2024-01-18",
      status: "confirmed",
      orderDate: "2024-01-16",
      totalValue: 1800
    },
    {
      id: "ORD002",
      product: "Fresh Lettuce",
      supplier: "Sunrise Organic Farm",
      quantity: 25,
      expectedDate: "2024-01-19",
      status: "in_transit",
      orderDate: "2024-01-15",
      totalValue: 1500
    }
  ];

  const salesData = [
    { day: "Mon", sales: 8500 },
    { day: "Tue", sales: 9200 },
    { day: "Wed", sales: 7800 },
    { day: "Thu", sales: 10500 },
    { day: "Fri", sales: 12800 },
    { day: "Sat", sales: 15200 },
    { day: "Sun", sales: 9800 }
  ];

  const suppliers = [
    {
      id: "GVF001",
      name: "Green Valley Farm",
      location: "Punjab, India",
      rating: 4.8,
      specialties: ["tomato", "peppers", "herbs"],
      totalOrders: 45,
      avgDeliveryTime: "18 hours",
      reliability: 98,
      lastOrder: "2024-01-15",
      image: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: "SOF002",
      name: "Sunrise Organic Farm",
      location: "Maharashtra, India",
      rating: 4.6,
      specialties: ["Root Vegetables", "Leafy Greens"],
      totalOrders: 32,
      avgDeliveryTime: "24 hours",
      reliability: 95,
      lastOrder: "2024-01-14",
      image: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: "MVF003",
      name: "Mountain View Farm",
      location: "Himachal Pradesh, India",
      rating: 4.7,
      specialties: ["potato", "onion", "garlic"],
      totalOrders: 28,
      avgDeliveryTime: "36 hours",
      reliability: 92,
      lastOrder: "2024-01-16",
      image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const qualityIssues = [
    {
      id: 1,
      product: "Organic Tomatoes",
      batchId: "TOM001",
      issue: "Quality below standard",
      reportedBy: "Store Manager",
      date: "2024-01-17",
      status: "investigating",
      priority: "high"
    },
    {
      id: 2,
      product: "Carrots",
      batchId: "CAR002",
      issue: "Packaging damaged",
      reportedBy: "Quality Inspector",
      date: "2024-01-16",
      status: "resolved",
      priority: "medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock": return "bg-green-100 text-green-800 border-green-200";
      case "low_stock": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out_of_stock": return "bg-red-100 text-red-800 border-red-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_transit": return "bg-purple-100 text-purple-800 border-purple-200";
      case "investigating": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const handleCreateOrder = () => {
    setShowOrderModal(true);
  };

  const handleUpdatePricing = (product: any) => {
    setSelectedProduct(product);
    setShowPricingModal(true);
  };

  const handleOrderSubmit = () => {
    console.log("Creating order:", newOrder);
    setShowOrderModal(false);
    setNewOrder({
      product: "",
      quantity: "",
      supplier: "",
      expectedDate: "",
      notes: ""
    });
  };

  const handlePricingUpdate = () => {
    console.log("Updating pricing for:", selectedProduct);
    setShowPricingModal(false);
  };

  return (
    <div className="min-h-screen textured-bg farm-bg font-body">
      {/* Header */}
      <header className="wooden-signboard mb-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-rustic-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌱</span>
              </div>
              <span className="text-xl font-heading text-rustic-brown">🌾 FarmToFork</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-rustic-brown/80 font-body">Welcome, {retailerData.name}</span>
              <button className="text-green-600 hover:text-green-700">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rustic-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-heading text-deep-green mb-2">Retail Dashboard</h1>
              <p className="text-gray-600 font-body">{retailerData.location} • ⭐ {retailerData.rating}/5</p>
            </div>
            <button
              onClick={handleCreateOrder}
              className="rustic-btn font-body flex items-center gap-2"
            >
              <span>➕</span>
              Place New Order
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="parchment-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-rustic-brown/80">{t('totalProducts')}</span>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-heading text-rustic-brown">{retailerData.totalProducts}</div>
          </div>
          
          <div className="parchment-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-rustic-brown/80">{t('lowStockItems')}</span>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-3xl font-heading text-yellow-600">{retailerData.lowStockItems}</div>
          </div>
          
          <div className="parchment-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-rustic-brown/80">{t('monthlyRevenue')}</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-heading text-rustic-green">₹{retailerData.monthlyRevenue.toLocaleString()}</div>
          </div>
          
          <div className="parchment-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-rustic-brown/80">{t('activeSuppliers')}</span>
              <span className="text-2xl">🤝</span>
            </div>
            <div className="text-3xl font-heading text-blue-600">{retailerData.activeSuppliers}</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "inventory"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "suppliers"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "analytics"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("quality")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "quality"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Quality Control
            </button>
          </div>
        </motion.div>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {inventory.map((item) => (
              <div key={item.id} className="parchment-card p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-heading text-rustic-brown">{item.product}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-body border ${getStatusColor(item.status)}`}>
                        {t(item.status)}
                      </span>
                      <span className="text-sm text-rustic-brown/70 font-body">{item.category}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 font-body">
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('supplier')}</p>
                        <p className="font-medium text-rustic-brown">{item.supplier}</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('stockLevel')}</p>
                        <p className="font-medium text-rustic-brown">{item.currentStock} / {item.maxStock} units</p>
                        <div className="w-full bg-rustic-cream rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              item.currentStock < item.minStock ? 'bg-red-500' : 
                              item.currentStock < item.minStock * 1.5 ? 'bg-yellow-500' : 'bg-rustic-green'
                            }`}
                            style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('qualityScore')}</p>
                        <p className="font-medium text-rustic-brown">{item.qualityScore}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-rustic-brown/70 font-body">
                      <span>📅 {t('lastRestocked')}: {item.lastRestocked}</span>
                      <span>⏰ {t('expires')}: {item.expiryDate}</span>
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <div className="bg-rustic-cream/50 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm font-body">
                        <div>
                          <p className="text-rustic-brown/70">{t('costPrice')}</p>
                          <p className="font-medium text-rustic-brown">₹{item.costPrice}/kg</p>
                        </div>
                        <div>
                          <p className="text-rustic-brown/70">{t('sellingPrice')}</p>
                          <p className="font-medium text-rustic-brown">₹{item.sellingPrice}/kg</p>
                        </div>
                        <div>
                          <p className="text-rustic-brown/70">{t('margin')}</p>
                          <p className="font-medium text-rustic-green">{item.margin}%</p>
                        </div>
                        <div>
                          <p className="text-rustic-brown/70">{t('minStock')}</p>
                          <p className="font-medium text-rustic-brown">{item.minStock} units</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdatePricing(item)}
                        className="rustic-button-small flex-1"
                      >
                        {t('updatePricing')}
                      </button>
                      <button className="rustic-button-secondary-small">
                        {t('restock')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {incomingOrders.map((order) => (
              <div key={order.id} className="parchment-card p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-heading text-rustic-brown">{order.product}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-body border ${getStatusColor(order.status)}`}>
                        {t(order.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-body">
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('supplier')}</p>
                        <p className="font-medium text-rustic-brown">{order.supplier}</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('quantity')}</p>
                        <p className="font-medium text-rustic-brown">{order.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('orderDate')}</p>
                        <p className="font-medium text-rustic-brown">{order.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('expectedDelivery')}</p>
                        <p className="font-medium text-rustic-brown">{order.expectedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col justify-between items-end">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-heading text-rustic-green">₹{order.totalValue}</div>
                      <div className="text-sm text-rustic-brown/70 font-body">{t('totalValue')}</div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <button className="rustic-button-small w-full">{t('trackOrder')}</button>
                      <button className="rustic-button-secondary-small w-full">{t('details')}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Suppliers Tab */}
        {activeTab === "suppliers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="parchment-card p-4 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={supplier.image}
                    alt={supplier.name}
                    className="w-16 h-16 object-cover rounded-xl border-2 border-rustic-brown/20"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-heading text-rustic-brown mb-1">{supplier.name}</h3>
                    <p className="text-rustic-brown/70 text-sm mb-2 font-body">{supplier.location}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(supplier.rating))}
                      </div>
                      <span className="text-sm text-rustic-brown/70 font-body">{supplier.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 font-body">
                  <p className="text-sm text-rustic-brown/70 mb-2">{t('specialties')}:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-rustic-green/20 text-rustic-green rounded-full text-xs"
                      >
                        {t(specialty)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-body">
                  <div>
                    <p className="text-rustic-brown/70">{t('totalOrders')}</p>
                    <p className="font-medium text-rustic-brown">{supplier.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-rustic-brown/70">{t('avgDelivery')}</p>
                    <p className="font-medium text-rustic-brown">{supplier.avgDeliveryTime}</p>
                  </div>
                  <div>
                    <p className="text-rustic-brown/70">{t('reliability')}</p>
                    <p className="font-medium text-rustic-brown">{supplier.reliability}%</p>
                  </div>
                  <div>
                    <p className="text-rustic-brown/70">{t('lastOrder')}</p>
                    <p className="font-medium text-rustic-brown">{supplier.lastOrder}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <button className="rustic-button-small flex-1">{t('placeOrder')}</button>
                  <button className="rustic-button-secondary-small">{t('contact')}</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Sales Chart */}
            <div className="parchment-card p-4">
              <h3 className="text-xl font-heading text-rustic-brown mb-6">{t('weeklySales')}</h3>
              <div className="h-64 flex items-end justify-between gap-2 font-body">
                {salesData.map((day, index) => (
                  <div key={day.day} className="flex flex-col items-center gap-2">
                    <div 
                      className="bg-rustic-green rounded-t-lg w-12 transition-all duration-500 hover:bg-rustic-green/80"
                      style={{ height: `${(day.sales / 16000) * 200}px` }}
                    ></div>
                    <span className="text-sm text-rustic-brown/80">{day.day}</span>
                    <span className="text-xs text-rustic-brown/60">₹{day.sales.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="parchment-card p-4">
                <h3 className="text-lg font-heading text-rustic-brown mb-4">{t('topSellingProducts')}</h3>
                <div className="space-y-3 font-body">
                  {inventory.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-rustic-green/20 text-rustic-green rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-rustic-brown">
                          <MultilingualProduct productKey={item.product} />
                        </span>
                      </div>
                      <span className="text-sm text-rustic-brown/80">₹{item.sellingPrice}/kg</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="parchment-card p-4">
                <h3 className="text-lg font-heading text-rustic-brown mb-4">{t('revenueBreakdown')}</h3>
                <div className="space-y-3 font-body">
                  <div className="flex justify-between">
                    <span className="text-rustic-brown/80">{t('vegetables')}</span>
                    <span className="font-medium text-rustic-brown">₹85,000 (68%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rustic-brown/80">{t('fruits')}</span>
                    <span className="font-medium text-rustic-brown">₹25,000 (20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rustic-brown/80">{t('herbs')}</span>
                    <span className="font-medium text-rustic-brown">₹15,000 (12%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quality Control Tab */}
        {activeTab === "quality" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {qualityIssues.map((issue) => (
              <div key={issue.id} className="parchment-card p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-heading text-rustic-brown">{issue.product}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-body border ${getStatusColor(issue.status)}`}>
                        {t(issue.status)}
                      </span>
                      <span className={`text-sm font-body font-bold ${getPriorityColor(issue.priority)}`}>
                        {t(issue.priority)} {t('priority')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-body">
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('batchId')}</p>
                        <p className="font-medium text-rustic-brown">{issue.batchId}</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('reportedBy')}</p>
                        <p className="font-medium text-rustic-brown">{issue.reportedBy}</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('issue')}</p>
                        <p className="font-medium text-rustic-brown">{issue.issue}</p>
                      </div>
                      <div>
                        <p className="text-rustic-brown/70 text-sm">{t('date')}</p>
                        <p className="font-medium text-rustic-brown">{issue.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col justify-center">
                    <div className="flex gap-2 w-full">
                      <button className="rustic-button-small flex-1">{t('investigate')}</button>
                      <button className="rustic-button-secondary-small">{t('details')}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 font-body">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="parchment-card p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading text-rustic-brown">{t('placeNewOrder')}</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-rustic-brown/70 hover:text-rustic-brown"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                  {t('product')} *
                </label>
                <select
                  value={newOrder.product}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, product: e.target.value }))}
                  className="rustic-input"
                >
                  <option value="">{t('selectProduct')}</option>
                  <option value="tomato">{t('product_tomato')}</option>
                  <option value="carrot">{t('product_carrot')}</option>
                  <option value="potato">{t('product_potato')}</option>
                  <option value="apples">{t('product_apples')}</option>
                </select>
              </div>
                
              <div>
                <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                  {t('quantity')} *
                </label>
                <input
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="25"
                  className="rustic-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                  {t('supplier')} *
                </label>
                <select
                  value={newOrder.supplier}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, supplier: e.target.value }))}
                  className="rustic-input"
                >
                  <option value="">{t('selectSupplier')}</option>
                  <option value="gvf">Green Valley Farm</option>
                  <option value="sof">Sunrise Organic Farm</option>
                  <option value="mvf">Mountain View Farm</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                  {t('expectedDeliveryDate')} *
                </label>
                <input
                  type="date"
                  value={newOrder.expectedDate}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, expectedDate: e.target.value }))}
                  className="rustic-input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                {t('notes')}
              </label>
              <textarea
                value={newOrder.notes}
                onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder={t('notesPlaceholder')}
                className="rustic-input"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowOrderModal(false)}
                className="rustic-button-secondary"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleOrderSubmit}
                className="rustic-button"
              >
                {t('submitOrder')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Update Pricing Modal */}
      {showPricingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 font-body">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="parchment-card p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading text-rustic-brown">{t('updatePricingFor')} {selectedProduct.product}</h2>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-rustic-brown/70 hover:text-rustic-brown"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                  {t('costPrice')}
                </label>
                <input
                  type="number"
                  defaultValue={selectedProduct.costPrice}
                  className="rustic-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rustic-brown/80 mb-2">
                  {t('sellingPrice')}
                </label>
                <input
                  type="number"
                  defaultValue={selectedProduct.sellingPrice}
                  className="rustic-input"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-rustic-brown/80">{t('newMargin')}: <span className="font-bold text-rustic-green">XX.X%</span></p>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowPricingModal(false)}
                className="rustic-button-secondary"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handlePricingUpdate}
                className="rustic-button"
              >
                {t('updatePrice')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Retailer;