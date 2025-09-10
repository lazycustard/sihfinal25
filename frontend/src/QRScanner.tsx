import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from './i18n/I18nContext';

// @ts-ignore - html5-qrcode types may not be available
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = () => {
    try {
      setError(null);
      
      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      scannerRef.current = new Html5QrcodeScanner(
        qrCodeRegionId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    } catch (err) {
      setError(t('camera_denied') || 'Camera access denied or not available');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  };

  const onScanSuccess = (decodedText: string) => {
    // Extract product ID from the QR code data
    let productId = decodedText;
    
    // If it's a URL, extract the product ID from it
    if (decodedText.includes('/verify/') || decodedText.includes('/trace/')) {
      const matches = decodedText.match(/\/(verify|trace)\/([^/?]+)/);
      if (matches && matches[2]) {
        productId = matches[2];
      }
    }
    
    stopScanning();
    onScan(productId);
  };

  const onScanFailure = (error: string) => {
    // Handle scan failure, but don't show error for every frame
    console.log('QR scan error:', error);
  };

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productId = formData.get('productId') as string;
    
    if (productId.trim()) {
      onScan(productId.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{t('scan_qr_code') || 'Scan QR Code'}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <div id={qrCodeRegionId} className="w-full"></div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-3">{t('qr_position_hint') || 'Position the QR code within the frame above'}</p>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">{t('or_enter_manually') || 'Or enter manually:'}</p>
            <form onSubmit={handleManualInput} className="flex gap-2">
              <input
                type="text"
                name="productId"
                placeholder={t('enter_product_id') || 'Enter Product ID'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                {t('verify') || 'Verify'}
              </button>
            </form>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={stopScanning}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
          >
            {t('stop') || 'Stop Scanner'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
