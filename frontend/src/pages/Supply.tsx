import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import Distributor from "./Distributor";
import Retailer from "./Retailer";

function Supply() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname.includes("retail") ? "retail" : location.pathname.includes("logistics") ? "logistics" : "logistics";

  useEffect(() => {
    if (location.pathname === "/supply") {
      navigate("/supply/logistics", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen textured-bg farm-bg font-body">
      <header className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 shadow-lg border-b border-orange-700" style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%),
          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)
        `
      }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <span className="text-xl font-bold text-white drop-shadow-sm">{t('app_name')}</span>
            </Link>
            <div className="text-orange-100 font-semibold bg-white bg-opacity-10 px-3 py-1 rounded-lg backdrop-blur-sm">{t('role_supply_partner') || 'Supply Partner'}</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          <button
            onClick={() => navigate("/supply/logistics")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentTab === "logistics" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t('supply_tab_logistics') || 'Logistics'}
          </button>
          <button
            onClick={() => navigate("/supply/retail")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentTab === "retail" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t('supply_tab_retail') || 'Retail'}
          </button>
        </div>

        <div>
          {currentTab === "retail" ? <Retailer /> : <Distributor />}
        </div>
      </div>
    </div>
  );
}

export default Supply;




