
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ShopContent from '../../components/Shop/ShopContent';

export default () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ShopContent />
      <Footer />
    </div>
  );
};



