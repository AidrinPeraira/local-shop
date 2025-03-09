import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


const ProductRecommendations = ({ productId }) => {
  // Mock similar products
  const similarProducts = [
    {
      id: '101',
      name: 'Deluxe Wireless Earbuds',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000',
    },
    {
      id: '102',
      name: 'Pro Studio Headphones',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1000',
    },
    {
      id: '103',
      name: 'Noise-Cancelling Travel Earphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1606143573596-8c7bbb7898e5?q=80&w=1000',
    },
    {
      id: '104',
      name: 'Sports Wireless Headphones',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1588423176052-82a3182c5aa4?q=80&w=1000',
    },
  ];

  // Mock recently viewed products
  const recentlyViewed = [
    {
      id: '201',
      name: 'Bluetooth Speaker',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000',
    },
    {
      id: '202',
      name: 'Wireless Charging Pad',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000',
    },
    {
      id: '203',
      name: 'Smartphone Stand',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=1000',
    },
    {
      id: '204',
      name: 'USB-C Hub',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000',
    },
  ];

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary">{product.name}</h3>
        <p className="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );

  return (
    <div className="space-y-10">
      {/* Similar Products */}
      <section aria-labelledby="similar-heading">
        <div className="flex items-center justify-between">
          <h2 id="similar-heading" className="text-xl font-bold text-gray-900">
            Similar Products
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section aria-labelledby="recently-heading">
        <div className="flex items-center justify-between">
          <h2 id="recently-heading" className="text-xl font-bold text-gray-900">
            Recently Viewed
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductRecommendations;
