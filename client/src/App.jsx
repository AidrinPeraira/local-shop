import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoading } from "./components/ui/PageLoading";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./redux/features/categoriesSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleConfig } from "./configuration";
import { setCartCount } from "./redux/features/cartSlice";
import { getCartItemsCountAPI } from "./api/cartApi";


// Lazy load route components
const BuyerRoutes = lazy(() => import('./routes/BuyerRoutes'));
const SellerRoutes = lazy(() => import('./routes/SellerRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));

function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); 

  useEffect(() => {
    dispatch(fetchCategories());

    if(user.role === 'buyer') {
      const fetchCartCount = async () => {
        try {
          const response = await getCartItemsCountAPI();
          dispatch(setCartCount(response.data.count));
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      };
      fetchCartCount();
    }


  }, [dispatch]);

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleConfig.web.client_id}>
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
    </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
