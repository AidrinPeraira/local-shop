
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Container } from '../../components/ui/container';
import CheckoutContent from '../../components/Checkout/CheckoutContent';

const Checkout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-10">
        <Container>
          <CheckoutContent />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
