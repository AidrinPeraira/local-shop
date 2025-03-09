
import { useState } from "react";
import ProductGallery from "../../components/Product/ProductGallery";
import ProductInfo from "../../components/Product/ProductInfo";
import ShippingInfo from "../../components/Product/ShippingInfo";
import ProductSpecs from "../../components/Product/ProductSpecs";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// Mock data (replace with real data from your backend)
const mockProduct = {
  "_id": "67c9986f511829baefa45b29",
  "productName": "Unisex Cargo Utility Pants",
  "slug": "unisex-cargo-utility-pants",
  "description": "<p>Designed for durability and versatility, these <strong>Unisex Cargo Utility Pants</strong> are perfect for adventure seekers, streetwear enthusiasts, and professionals alike. Made from a rugged <strong>cotton-twill fabric</strong>, they offer superior resistance to wear and tear while maintaining breathability. </p><p><br></p><p>The <strong>six-pocket design</strong> provides ample storage for essentials, with deep side pockets and secure flap pockets on the thighs. The <strong>adjustable ankle cuffs</strong> allow for a customizable fit, making them adaptable for different styles—wear them relaxed for a laid-back look or cinched for a tapered finish. Whether for outdoor activities, work, or casual wear, these cargo pants promise <strong>both function and fashion</strong>.</p><p><br></p><p><strong>Variants &amp; Pricing:</strong></p><ul><li><strong>Colors:</strong> Khaki, Black, Army Green, Sand, Navy</li><li><strong>Sizes:</strong> XS, S, M, L, XL, XXL</li><li><strong>Price per unit:</strong> ₹2,799</li></ul><p><br></p><p><strong>Bulk Discounts:</strong></p><ul><li><strong>10+ units:</strong> <strong>6% off</strong> (₹2,631 per unit)</li><li><strong>50+ units:</strong> <strong>13% off</strong> (₹2,435 per unit)</li><li><strong>100+ units:</strong> <strong>20% off</strong> (₹2,239 per unit)</li></ul><p><br></p>",
  "category": {
      "_id": "67bcbb27d41ab96fa34016ec",
      "name": "Pants"
  },
  "images": [
      "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265006/products/hlt1urnvrmmmo50kwehy.avif",
      "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265006/products/v9osdxzltkhynewvztni.avif",
      "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265006/products/a85lanv36hub1xxfofqq.avif",
      "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265006/products/z4ldv9yr3e3l1maanpqf.avif",
      "https://res.cloudinary.com/localshopcloudinary/image/upload/v1741265006/products/duivapavqmwc5em4adne.avif"
  ],
  "avgRating": 0,
  "reviewCount": 0,
  "basePrice": 1500,
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
}

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-white">
      
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Gallery */}
          <div className="sticky top-24">
            <ProductGallery images={mockProduct.images} />
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-8">
            <ProductInfo
              title={mockProduct.title}
              price={mockProduct.price}
              originalPrice={mockProduct.originalPrice}
              description={mockProduct.description}
              colors={mockProduct.colors}
              sizes={mockProduct.sizes}
              stock={mockProduct.stock}
            />
            
            <ShippingInfo />
            
            <ProductSpecs specifications={mockProduct.specifications} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
