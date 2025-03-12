import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductDetailContent from '../../components/Product/ProductDetailContent';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetailContent />
      <Footer />
    </div>
  );
};

export default ProductDetail;
