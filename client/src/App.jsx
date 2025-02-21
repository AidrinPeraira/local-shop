import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { lazy, Suspense } from "react";

const BuyerRoutes = lazy(()=>import('./routes/BuyerRoutes'))
const SellerRoutes = lazy(()=> import('./routes/SellerRoutes'))
const AdminRoutes = lazy(()=> import('./routes/AdminRoutes'))

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
    <Toaster/>
    <Suspense fallback={<PageLoading/>}>
    <Router>
      <Routes>
        <Route path="/*" element={<BuyerRoutes />} />
        <Route path="/seller/*" element={<SellerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
    </Suspense>
    </>
  );
}

export default App;
