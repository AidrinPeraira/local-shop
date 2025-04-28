import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Container } from '../../components/ui/container';
import ProductBreadcrumbs from './ProducBreadcrumb';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductPurchaseCard from './ProducPurchaseCard';
import ProductRecommendations from './ProductRecomendations';
import { getProductDetailsApi } from '../../api/productApi';
import { useParams, useSearchParams } from 'react-router-dom';
import { addToWishlistApi, removeFromWishlistApi, getWishlistApi } from '../../api/wishlistApi';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setWishlistCount } from "../../redux/features/wishlistSlice";
import { getWishlistCountApi } from "../../api/wishlistApi";
import { useToast } from '../hooks/use-toast';

const ProductDetailContent = () => {
  const [product, setProduct] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const user = useSelector(state => state.user.user)

  const id = searchParams.get('id');
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const updateRecentProducts = () => {
    if(!id) return;

    const recenntProducts = JSON.parse(localStorage.getItem('recentProducts')) || [];
    const filteredProducts = recenntProducts.filter(productId => productId !== id);
    filteredProducts.unshift(id);
    const updatedProducts = filteredProducts.slice(0, 10);
    localStorage.setItem('recentProducts', JSON.stringify(updatedProducts));

  }

  updateRecentProducts();

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

  //cehck wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!id) return;
      try {
        const response = await getWishlistApi();
        const wishlistedProducts = response.data.wishlist?.products || [];
        setIsWishlisted(wishlistedProducts.some(item => item._id === id));
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    checkWishlistStatus();
  }, [id]);

  const handleWishlist = async () => {
   
    
    if (!product) return;
  
    if(user.role !== 'buyer'){
      toast({
        title: "You are not logged in",
        description: "Please login as a buyer to save products",
        variant: "destructive", 
      });
      return;
    }
    
    try {
      if (isWishlisted) {
        await removeFromWishlistApi(product._id);
        setIsWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: "Product removed from your saved list",
        });
      } else {
        await addToWishlistApi({ productId: product._id });
        setIsWishlisted(true);
        toast({
          title: "Added to wishlist",
          description: "Product saved to your list",
        });
      }
  
      // Get updated wishlist count
      const countResponse = await getWishlistCountApi();
      dispatch(setWishlistCount(countResponse.data.count));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

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
              <ProductRecommendations productId={product._id} categoryId={product.category._id} />
            </div>
          </div>
          
          {/* Product Purchase Card - 5 columns */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="lg:sticky lg:top-6">
              
            <button
                onClick={handleWishlist}
                className="mb-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
                <span>{isWishlisted ? "Saved to Wishlist" : "Save for Later"}</span>
              </button>

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
                  variantTypes: product.variantTypes,
                  variants: product.variants,
                  bulkDiscount: product.bulkDiscount,
                  stockUnit : product.stockUnit
                }} 
              />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ProductDetailContent;