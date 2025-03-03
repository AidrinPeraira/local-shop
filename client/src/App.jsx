import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoading } from "./components/ui/PageLoading";

// Lazy load route components
const BuyerRoutes = lazy(() => import('./routes/BuyerRoutes'));
const SellerRoutes = lazy(() => import('./routes/SellerRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));

function App() {
  return (
    <ErrorBoundary>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/*" element={
            <Suspense fallback={<PageLoading />}>
              <BuyerRoutes />
            </Suspense>
          } />
          <Route path="/seller/*" element={
            <Suspense fallback={<PageLoading />}>
              <SellerRoutes />
            </Suspense>
          } />
          <Route path="/admin/*" element={
            <Suspense fallback={<PageLoading />}>
              <AdminRoutes />
            </Suspense>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
