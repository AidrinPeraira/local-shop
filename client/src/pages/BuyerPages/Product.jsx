import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductDetailContent from '../../components/Product/ProductDetailContent';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetailContent productId={id} />
      <Footer />
    </div>
  );
};

export default ProductDetail;
