import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoading } from "./components/ui/PageLoading";

const BuyerRoutes = lazy(() => import("./routes/BuyerRoutes"));
const SellerRoutes = lazy(() => import("./routes/SellerRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

function App() {
  return (
    <>
      <ErrorBoundary>
        <Toaster />
        <Router>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/*" element={<BuyerRoutes />} />
              <Route path="/seller/*" element={<SellerRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </>
  );
}

export default App;
