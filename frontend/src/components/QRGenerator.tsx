import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../services/api';

interface QRGeneratorProps {
  productId?: string;
  productIds?: string[];
  productName?: string;
  onSuccess?: (qrData: any) => void;
  onError?: (error: string) => void;
  variant?: 'single' | 'batch';
  className?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  productId,
  productIds = [],
  productName = 'Product',
  onSuccess,
  onError,
  variant = 'single',
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const generateQR = async () => {
    try {
      setIsGenerating(true);
      
      if (variant === 'batch' && productIds.length > 0) {
        // Generate batch QR codes
        const response = await fetch('/api/qr/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds }),
        });
        const data = await response.json();
        
        if (data.success) {
          setQrData(data);
          setShowModal(true);
          onSuccess?.(data);
        } else {
          throw new Error(data.error || 'Failed to generate batch QR codes');
        }
      } else if (productId) {
        // Generate single QR code
        const response = await fetch(`/api/qr/data/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setQrData(data);
          setShowModal(true);
          onSuccess?.(data);
          
          // Also save QR code to server
          await apiService.saveQRCode(productId);
        } else {
          throw new Error(data.error || 'Failed to generate QR code');
        }
      } else {
        throw new Error('No product ID(s) provided');
      }
    } catch (error: any) {
      console.error('QR generation error:', error);
      onError?.(error.message || 'Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (variant === 'batch' && qrData?.qrCodes) {
      // Download all QR codes as a zip or individual files
      qrData.qrCodes.forEach((qr: any, index: number) => {
        const link = document.createElement('a');
        link.href = qr.qrCode;
        link.download = `${qr.productId}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add delay between downloads to avoid browser blocking
        if (index < qrData.qrCodes.length - 1) {
          setTimeout(() => {}, 100);
        }
      });
    } else if (qrData?.qrCode) {
      const link = document.createElement('a');
      link.href = qrData.qrCode;
      link.download = `${productId}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let htmlContent = `
        <html>
          <head>
            <title>QR Code${variant === 'batch' ? 's' : ''} - ${productName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { 
                border: 2px solid #000; 
                padding: 20px; 
                margin: 20px auto; 
                width: fit-content; 
                page-break-inside: avoid;
              }
              .product-info { 
                margin: 10px 0; 
                font-size: 14px; 
              }
              .batch-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
                .qr-container { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h2>Product QR Code${variant === 'batch' ? 's' : ''}</h2>
      `;
      
      if (variant === 'batch' && qrData?.qrCodes) {
        htmlContent += '<div class="batch-container">';
        qrData.qrCodes.forEach((qr: any) => {
          htmlContent += `
            <div class="qr-container">
              <div class="product-info">
                <strong>Product ID:</strong> ${qr.productId}<br>
                <strong>Generated:</strong> ${new Date().toLocaleDateString()}
              </div>
              <img src="${qr.qrCode}" alt="QR Code" style="max-width: 250px;" />
              <div class="product-info">
                <p>Scan to verify authenticity</p>
              </div>
            </div>
          `;
        });
        htmlContent += '</div>';
      } else if (qrData?.qrCode) {
        htmlContent += `
          <div class="product-info">
            <strong>Product:</strong> ${productName}<br>
            <strong>ID:</strong> ${productId}<br>
            <strong>Generated:</strong> ${new Date().toLocaleDateString()}
          </div>
          <div class="qr-container">
            <img src="${qrData.qrCode}" alt="QR Code" style="max-width: 300px;" />
          </div>
          <div class="product-info">
            <p>Scan to verify product authenticity and trace journey</p>
          </div>
        `;
      }
      
      htmlContent += '</body></html>';
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <button
        onClick={generateQR}
        disabled={isGenerating}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${className} ${
          isGenerating
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 btn-qr'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            {variant === 'batch' ? 'Generating Batch...' : 'Generating...'}
          </>
        ) : (
          <>
            📱 {variant === 'batch' ? `Generate ${productIds.length} QRs` : 'Generate QR'}
          </>
        )}
      </button>

      {/* QR Code Modal */}
      {showModal && qrData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">QR Code Generated</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="text-center">
              {variant === 'batch' && qrData?.qrCodes ? (
                <div className="max-h-96 overflow-y-auto mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {qrData.qrCodes.slice(0, 4).map((qr: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl">
                        <img
                          src={qr.qrCode}
                          alt={`QR Code ${index + 1}`}
                          className="mx-auto max-w-full h-auto mb-2"
                          style={{ maxWidth: '120px' }}
                        />
                        <p className="text-xs text-gray-600">{qr.productId}</p>
                      </div>
                    ))}
                  </div>
                  {qrData.qrCodes.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{qrData.qrCodes.length - 4} more QR codes
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <img
                    src={qrData?.qrCode}
                    alt="Generated QR Code"
                    className="mx-auto max-w-full h-auto"
                    style={{ maxWidth: '250px' }}
                  />
                </div>
              )}

              <div className="space-y-2 mb-6 text-sm text-gray-600">
                {variant === 'batch' ? (
                  <>
                    <p><strong>Batch QR Codes:</strong> {qrData?.count || productIds.length}</p>
                    <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Product:</strong> {productName}</p>
                    <p><strong>ID:</strong> {productId}</p>
                    <p><strong>Verification URL:</strong></p>
                    <p className="text-xs break-all bg-gray-100 p-2 rounded">
                      {qrData?.verificationUrl}
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  💾 Download
                </button>
                <button
                  onClick={printQR}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  🖨️ Print
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default QRGenerator;
