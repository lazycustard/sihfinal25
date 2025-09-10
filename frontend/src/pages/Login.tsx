import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useI18n } from "../i18n/I18nContext";

function Login() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        if (!username || !password) {
          setError("Username and password are required.");
          return;
        }
        await login(username, password);
        navigate("/");
      } else {
        if (!username || !email || !password || !phone) {
          setError("All fields are required for registration.");
          return;
        }
        await register({ username, email, password, phone, role });
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen textured-bg farm-bg font-body">
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('app_name')}</h1>
          </div>
          <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
            {t('nav_home')}
          </Link>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "login" ? "bg-green-50 text-green-700" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("login")}
              >
                {t('login_tab')}
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "signup" ? "bg-green-50 text-green-700" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                {t('signup_tab')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('placeholder_username')}
                  required
                />
              </div>

              {activeTab === "signup" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('placeholder_email')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('placeholder_phone')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('role_label')}</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="farmer">Farmer</option>
                      <option value="distributor">Distributor</option>
                      <option value="retailer">Retailer</option>
                      <option value="consumer">Consumer</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('placeholder_password')}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('please_wait') : (activeTab === "login" ? t('submit_login') : t('submit_signup'))}
              </button>

              {activeTab === "login" && (
                <p className="text-sm text-center text-gray-600">
                  {t('no_account')} {" "}
                  <button
                    type="button"
                    className="text-green-700 font-medium hover:underline"
                    onClick={() => setActiveTab("signup")}
                  >
                    {t('sign_up_cta')}
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
