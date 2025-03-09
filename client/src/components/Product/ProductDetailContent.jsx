import React from 'react';
import { Container } from '../../components/ui/container';
import ProductBreadcrumbs from './ProductBreadcrumbs';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductPurchaseCard from './ProducPurchaseCard';
import ProductRecommendations from './ProductRecomendations';

// Mock data
const mockProduct = {
  "_id": "67c9995e511829baefa45b7a",
  "productName": "Women's Yoga & Workout Leggings",
  "slug": "women's-yoga-and-workout-leggings",
  "description": "<p>Take your workouts to the next level with these <strong>Women's Yoga &amp; Workout Leggings</strong>, designed for ultimate comfort and performance. These leggings are made from a premium <strong>nylon-spandex blend</strong>, providing <strong>four-way stretch, moisture-wicking properties, and squat-proof durability</strong>. </p><p><br></p><p>The <strong>high-waisted design</strong> offers tummy control and support, while the seamless construction ensures a smooth, flattering fit. Whether you're doing yoga, running, or hitting the gym, these leggings provide <strong>maximum flexibility and breathability</strong>. Additionally, the <strong>anti-slip waistband</strong> ensures they stay in place, no matter how intense your workout is.</p><p><br></p><p><strong>Variants &amp; Pricing:</strong></p><p><br></p><ul><li><strong>Colors:</strong> Black, Navy, Wine Red, Teal, Lavender</li><li><strong>Sizes:</strong> XS, S, M, L, XL</li><li><strong>Price per unit:</strong> ₹1,899</li><li><br></li></ul><p><strong>Bulk Discounts:</strong></p><p><br></p><ul><li><strong>10+ units:</strong> <strong>8% off</strong> (₹1,747 per unit)</li><li><strong>50+ units:</strong> <strong>15% off</strong> (₹1,614 per unit)</li><li><strong>100+ units:</strong> <strong>22% off</strong> (₹1,481 per unit</li></ul><p><br></p>",
  "category": {
    "_id": "67bcbb27d41ab96fa34016ec",
    "name": "Pants"
  },
  "images": [
    "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265245/products/vxidgee3lyweroqos3de.webp",
    "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265244/products/wqjivmm5vzxiqnzw6nh5.avif",
    "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265245/products/jpxkmchxffvrmopfminb.webp",
    "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265245/products/bf5ailh4b9xpzq4ikaln.webp",
    "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265245/products/tcxfofwf3rcuz6r3h3cl.webp"
  ],
  "avgRating": 0,
  "reviewCount": 0,
  "basePrice": 1400,
  "stock": 1000,
  "inStock": true,
  "seller": {
    "_id": "67c86d30b32622d7acc946d9",
    "sellerName": "XYZ Clothing Company PVT LTD"
  },
  "variants": [
    {
      "variantId": "variant-1741265002679-0",
      "attributes": [
        {
          "Color": "Red",
          "Size": "Small"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b2c"
    },
    {
      "variantId": "variant-1741265002679-1",
      "attributes": [
        {
          "Color": "Red",
          "Size": "Medium"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b2d"
    },
    {
      "variantId": "variant-1741265002679-2",
      "attributes": [
        {
          "Color": "Red",
          "Size": "Large"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b2e"
    },
    {
      "variantId": "variant-1741265002679-3",
      "attributes": [
        {
          "Color": "Blue",
          "Size": "Small"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b2f"
    },
    {
      "variantId": "variant-1741265002679-4",
      "attributes": [
        {
          "Color": "Blue",
          "Size": "Medium"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b30"
    },
    {
      "variantId": "variant-1741265002679-5",
      "attributes": [
        {
          "Color": "Blue",
          "Size": "Large"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b31"
    },
    {
      "variantId": "variant-1741265002679-6",
      "attributes": [
        {
          "Color": "Green",
          "Size": "Small"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b32"
    },
    {
      "variantId": "variant-1741265002679-7",
      "attributes": [
        {
          "Color": "Green",
          "Size": "Medium"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b33"
    },
    {
      "variantId": "variant-1741265002679-8",
      "attributes": [
        {
          "Color": "Green",
          "Size": "Large"
        }
      ],
      "stock": 1000,
      "inStock": true,
      "basePrice": 1500,
      "_id": "67c9986f511829baefa45b34"
    }
  ],
  "bulkDiscount": [
    {
      "minQty": 1,
      "priceDiscountPerUnit": 0,
      "_id": "67c9986f511829baefa45b35"
    },
    {
      "minQty": 10,
      "priceDiscountPerUnit": 5,
      "_id": "67c9986f511829baefa45b36"
    },
    {
      "minQty": 50,
      "priceDiscountPerUnit": 10,
      "_id": "67c9986f511829baefa45b37"
    },
    {
      "minQty": 100,
      "priceDiscountPerUnit": 15,
      "_id": "67c9986f511829baefa45b38"
    }
  ]
};

const ProductDetailContent = ({ productId = '1' }) => {
  // Extract unique attributes for selection
  const getUniqueAttributes = () => {
    const colors = new Set();
    const sizes = new Set();
    
    mockProduct.variants.forEach(variant => {
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

  const { colors, sizes } = getUniqueAttributes();

  return (
    <main className="py-6 lg:py-10">
      <Container>
        <ProductBreadcrumbs 
          category={mockProduct.category.name} 
          productName={mockProduct.productName} 
        />
        
        <div className="mt-4 lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Product Gallery and Info - 7 columns */}
          <div className="lg:col-span-7">
            <ProductGallery images={mockProduct.images} />
          
            <div className="mt-10">
              <ProductInfo 
                description={mockProduct.description} 
                sellerName={mockProduct.seller.sellerName} 
              />
            </div>
            
            <div className="mt-16">
              <ProductRecommendations productId={mockProduct._id} />
            </div>
          </div>
          
          {/* Product Purchase Card - 5 columns */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <ProductPurchaseCard 
              product={{
                id: mockProduct._id,
                name: mockProduct.productName,
                price: mockProduct.basePrice,
                rating: mockProduct.avgRating,
                reviewCount: mockProduct.reviewCount,
                colors: colors,
                sizes: sizes,
                inStock: mockProduct.inStock,
                variants: mockProduct.variants,
                bulkDiscount: mockProduct.bulkDiscount
              }} 
            />
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ProductDetailContent;