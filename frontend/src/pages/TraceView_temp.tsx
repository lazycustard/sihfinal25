import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import apiService from "../services/api";
import { useI18n } from "../i18n/I18nContext";
import RusticTimeline from "../components/RusticTimeline";

// Define the type for a single timeline step to match RusticTimeline component props
interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  details?: {
    temperature?: string;
    humidity?: string;
    quality?: string;
    certifications?: string[];
  };
}

function TraceView() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [traceData, setTraceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTraceData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        if (location.state?.product) {
          setTraceData(location.state.product);
        } else {
          const response = await apiService.getProductHistory(id);
          if (response.success) {
            setTraceData(response.product);
          } else {
            setError("Product not found");
          }
        }
      } catch (err: any) {
        console.error('Failed to load trace data:', err);
        setError(err.message || "Failed to load product information");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTraceData();
  }, [id, location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen textured-bg farm-bg flex items-center justify-center">
        <div className="text-center parchment-card">
          <div className="swaying-leaf text-6xl mb-4">🍃</div>
          <p className="text-rustic-brown font-body">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen textured-bg farm-bg flex items-center justify-center">
        <div className="text-center parchment-card">
          <div className="text-rustic-brown text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-heading text-rustic-brown mb-2">{t('error')}</h2>
          <p className="text-rustic-brown/80 font-body mb-4">{error}</p>
          <Link to="/" className="rustic-button">
            {t('goHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!traceData) {
    return (
      <div className="min-h-screen textured-bg farm-bg flex items-center justify-center">
        <div className="text-center parchment-card">
          <div className="text-rustic-brown/60 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-heading text-rustic-brown mb-2">{t('productNotFound')}</h2>
          <p className="text-rustic-brown/80 font-body mb-4">{t('productNotFoundDesc')}</p>
          <Link to="/" className="rustic-button">
            {t('goHome')}
          </Link>
        </div>
      </div>
    );
  }

  // Transform trace data for RusticTimeline
  const timelineSteps: TimelineStep[] = [
    {
      id: 'farm',
      title: t('farming'),
      description: `Harvested by ${traceData.farmerName || t('unknownFarmer')}`,
      date: traceData.harvestDate || t('unknownDate'),
      location: traceData.farmLocation || t('unknownLocation'),
      status: 'completed',
      icon: '🌱',
      details: {
        quality: traceData.qualityScore ? `${traceData.qualityScore}%` : undefined,
        certifications: traceData.certifications,
      },
    },
    {
      id: 'processing',
      title: t('processing'),
      description: `Processed by ${traceData.processorName || t('unknownProcessor')}`,
      date: traceData.processingDate || t('pending'),
      location: traceData.processingLocation || t('unknownLocation'),
      status: traceData.processingDate ? 'completed' : 'pending',
      icon: '🏭',
      details: {
        temperature: traceData.processingTemp,
        humidity: traceData.processingHumidity,
      },
    },
    {
      id: 'distribution',
      title: t('distribution'),
      description: `Distributed by ${traceData.distributorName || t('unknownDistributor')}`,
      date: traceData.distributionDate || t('pending'),
      location: traceData.distributionLocation || t('unknownLocation'),
      status: traceData.distributionDate ? 'completed' : 'pending',
      icon: '🚛',
      details: {
        temperature: traceData.transportTemp,
        quality: traceData.distributionQuality,
      },
    },
    {
      id: 'retail',
      title: t('retail'),
      description: `Available at ${traceData.retailerName || t('unknownRetailer')}`,
      date: traceData.retailDate || t('current'),
      location: traceData.retailLocation || t('unknownLocation'),
      status: traceData.retailDate ? 'completed' : 'current',
      icon: '🏪',
      details: {
        quality: traceData.retailQuality,
        certifications: traceData.retailCertifications,
      },
    },
  ];

  return (
    <div className="min-h-screen textured-bg farm-bg font-body">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="wooden-signboard mb-8"
        >
          <h1 className="text-3xl font-heading text-rustic-brown mb-2">
            🔍 {t('productTraceability')}
          </h1>
          <p className="text-rustic-brown/80 font-body">
            {t('traceabilityDesc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="parchment-card mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-rustic-green/20 rounded-lg flex items-center justify-center text-4xl">
              🌾
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-heading text-rustic-brown mb-2">
                {traceData.productName || traceData.name || t('unknownProduct')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-rustic-brown">{t('productId')}:</span>
                  <span className="ml-2 text-rustic-brown/80">{traceData.id || id}</span>
                </div>
                <div>
                  <span className="font-semibold text-rustic-brown">{t('batchNumber')}:</span>
                  <span className="ml-2 text-rustic-brown/80">{traceData.batchNumber || t('unknown')}</span>
                </div>
                <div>
                  <span className="font-semibold text-rustic-brown">{t('harvestDate')}:</span>
                  <span className="ml-2 text-rustic-brown/80">{traceData.harvestDate || t('unknown')}</span>
                </div>
                <div>
                  <span className="font-semibold text-rustic-brown">{t('expiryDate')}:</span>
                  <span className="ml-2 text-rustic-brown/80">{traceData.expiryDate || t('unknown')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RusticTimeline steps={timelineSteps} productName={traceData.productName || traceData.name} />
        </motion.div>

        {(traceData.certifications || traceData.qualityTests || traceData.sustainabilityScore) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="parchment-card mt-8"
          >
            <h3 className="text-xl font-heading text-rustic-brown mb-4">
              📋 {t('additionalInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {traceData.certifications && (
                <div>
                  <h4 className="font-semibold text-rustic-brown mb-2">{t('certifications')}</h4>
                  <div className="space-y-1">
                    {traceData.certifications.map((cert: string, index: number) => (
                      <span key={index} className="inline-block bg-rustic-green/20 text-rustic-green px-2 py-1 rounded text-sm mr-2 mb-1">
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {traceData.qualityTests && (
                <div>
                  <h4 className="font-semibold text-rustic-brown mb-2">{t('qualityTests')}</h4>
                  <div className="space-y-1">
                    {Object.entries(traceData.qualityTests).map(([test, result]) => (
                      <div key={test} className="text-sm">
                        <span className="text-rustic-brown">{test}:</span>
                        <span className="ml-2 text-rustic-green">✓ {String(result)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {traceData.sustainabilityScore && (
                <div>
                  <h4 className="font-semibold text-rustic-brown mb-2">{t('sustainability')}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-rustic-cream rounded-full h-2">
                      <div 
                        className="bg-rustic-green h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${traceData.sustainabilityScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-rustic-green">
                      {traceData.sustainabilityScore}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {traceData.pricing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="parchment-card mt-8"
          >
            <h3 className="text-xl font-heading text-rustic-brown mb-4">
              💰 {t('pricingInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(traceData.pricing).map(([stage, price]) => (
                <div key={stage} className="text-center p-4 bg-rustic-cream/50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {stage === 'farm' && '🌱'}
                    {stage === 'processing' && '🏭'}
                    {stage === 'distribution' && '🚛'}
                    {stage === 'retail' && '🏪'}
                  </div>
                  <div className="font-semibold text-rustic-brown capitalize">{stage}</div>
                  <div className="text-rustic-green font-bold">₹{String(price)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="rustic-button inline-flex items-center gap-2"
          >
            ← {t('backToHome')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default TraceView;
