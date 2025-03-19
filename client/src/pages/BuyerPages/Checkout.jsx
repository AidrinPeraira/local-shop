
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Container } from '../../components/ui/container';
import CheckoutContent from '../../components/Checkout/CheckoutContent';

const Checkout = () => {
  const location = useLocation();
  
  // Redirect to cart if no cart data is present
  if (!location.state?.cartData) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-10">
        <Container>
          <CheckoutContent 
            cartData={location.state.cartData}
            summary={location.state.summary}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
