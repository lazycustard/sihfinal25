import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QrScanner = () => {
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('qr-reader');
    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        const match = decodedText.match(/P\d+-[a-zA-Z0-9]+/);
        if (match) {
          navigate(`/trace/${match[0]}`);
        } else {
          setError('Invalid QR code format.');
        }
        html5QrCode.stop();
      },
      (err) => setError('Scanning failed: ' + err)
    ).catch(() => setError('Camera access denied or unavailable.'));
    scannerRef.current = html5QrCode;
    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (/^P\d+-[a-zA-Z0-9]+$/.test(manualId)) {
      navigate(`/trace/${manualId}`);
    } else {
      setError('Invalid Product ID format.');
    }
  };

  return (
    <div>
      <div id="qr-reader" style={{ width: 300 }} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleManualSubmit}>
        <input
          type="text"
          placeholder="Enter Product ID"
          value={manualId}
          onChange={e => setManualId(e.target.value)}
        />
        <button type="submit">Trace Product</button>
      </form>
    </div>
  );
};

export default QrScanner;