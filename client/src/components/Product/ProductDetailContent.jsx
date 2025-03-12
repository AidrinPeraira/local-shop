import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/container';
import ProductBreadcrumbs from './ProductBreadcrumbs';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductPurchaseCard from './ProducPurchaseCard';
import ProductRecommendations from './ProductRecomendations';
import { getProductDetailsApi } from '../../api/productApi';
import { useParams, useSearchParams } from 'react-router-dom';

const ProductDetailContent = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const { slug } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await getProductDetailsApi(slug, id);
        setProduct(response.data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Extract unique attributes for selection
  const getUniqueAttributes = () => {
    if (!product?.variants?.length) return { colors: [], sizes: [] };

    const colors = new Set();
    const sizes = new Set();
    
    product.variants.forEach(variant => {
      variant.attributes.forEach(attr => {
        if ('Color' in attr) colors.add(attr['Color']);
        if ('Size' in attr) sizes.add(attr['Size']);
      });
    });
    
    return {
      colors: Array.from(colors),
      sizes: Array.from(sizes)
    };
  };

  if (loading) {
    return (
      <main className="py-6 lg:py-10">
        <Container>
          <div>Loading...</div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-6 lg:py-10">
        <Container>
          <div>Error: {error}</div>
        </Container>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="py-6 lg:py-10">
        <Container>
          <div>Product not found</div>
        </Container>
      </main>
    );
  }

  const { colors, sizes } = getUniqueAttributes();

  return (
    <main className="py-6 lg:py-10">
      <Container>
        <ProductBreadcrumbs 
          category={product.category.name}
          categoryId={product.category._id}  
          productName={product.productName} 
        />
        
        <div className="mt-4 lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Product Gallery and Info - 7 columns */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} />
          
            <div className="mt-10">
              <ProductInfo 
                description={product.description} 
                sellerName={product.seller.sellerName} 
              />
            </div>
            
            <div className="mt-16">
              <ProductRecommendations productId={product._id} />
            </div>
          </div>
          
          {/* Product Purchase Card - 5 columns */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <ProductPurchaseCard 
              product={{
                id: product._id,
                name: product.productName,
                price: product.basePrice,
                rating: product.avgRating,
                reviewCount: product.reviewCount,
                colors: colors,
                sizes: sizes,
                inStock: product.inStock,
                variants: product.variants,
                bulkDiscount: product.bulkDiscount
              }} 
            />
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ProductDetailContent;