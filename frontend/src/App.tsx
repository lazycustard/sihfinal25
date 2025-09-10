import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nProvider } from "./i18n/I18nContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./Layout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Consumer from "./pages/Consumer";
import Farmer from "./pages/Farmer";
import Distributor from "./pages/Distributor";
import Retailer from "./pages/Retailer";
import Supply from "./pages/Supply";
import TraceView from "./pages/TraceView";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import FarmerAuth from "./pages/FarmerAuth";
import SupplyAuth from "./pages/SupplyAuth";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Layout>
            <Routes>
            {/* Define all routes here */}
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/consumer" element={<Consumer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farmer-auth" element={<FarmerAuth />} />
            <Route path="/supply-auth" element={<SupplyAuth />} />
            <Route path="/farmer" element={<Farmer />} />
            <Route path="/supply" element={<Supply />} />
            <Route path="/supply/logistics" element={<Supply />} />
            <Route path="/supply/retail" element={<Supply />} />
            <Route path="/distributor" element={<Supply />} />
            <Route path="/retailer" element={<Supply />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            {/* Admin route removed */}
            <Route path="/trace/:id" element={<TraceView />} />

            {/* IMPORTANT: DO NOT place any routes below this. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </I18nProvider>
    </AuthProvider>
  );
}

export default App;