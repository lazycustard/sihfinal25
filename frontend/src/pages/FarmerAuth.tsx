import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

function FarmerAuth() {
  const { t } = useI18n();
  const [farmerId, setFarmerId] = useState('');
  const [name, setName] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerId || !name) return;
    navigate('/farmer', { state: { farmerId, name } });
  };

  const startVoice = async () => {
    try {
      // Basic Web Speech API usage if available
      const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const recog = new SpeechRecognition();
      recog.lang = 'en-IN';
      setIsListening(true);
      recog.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (!farmerId) setFarmerId(transcript.trim()); else setName(transcript.trim());
      };
      recog.onend = () => setIsListening(false);
      recog.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen textured-bg farm-bg font-body flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-green-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('farmer_auth_title') || 'Farmer Authentication'}</h1>
        <p className="text-sm text-gray-600 mb-6">{t('farmer_auth_sub') || 'Login or Register to continue'}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('farmer_id')}</label>
            <div className="flex gap-2">
              <input
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder={t('placeholder_farmer_id') || 'Enter Farmer ID'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button type="button" onClick={startVoice} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200" title={t('voice_input') || 'Voice input'}>
                {isListening ? '🎙️' : '🎤'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('placeholder_name') || 'Enter Name'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button type="button" onClick={startVoice} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200" title={t('voice_input') || 'Voice input'}>
                {isListening ? '🎙️' : '🎤'}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            {t('continue') || 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerAuth;




