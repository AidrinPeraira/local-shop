import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductDetailsApi, getShopProductsApi } from "../../api/productApi";

const ProductRecommendations = ({ productId, categoryId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        if (categoryId) {
          setLoading(true);
          const query = `category=${categoryId}&limit=4`;
          const response = await getShopProductsApi(query);

          // Filter out the current product if it's in the results
          const filteredProducts = response.data.products.filter(
            (product) => product._id !== productId
          );

          setSimilarProducts(filteredProducts.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, productId]);

  useEffect(() => {
    const fetchRecentlyViewedProducts = async () => {
      try {
        const recentProductIds = localStorage.getItem("recentProducts")
          ? JSON.parse(localStorage.getItem("recentProducts"))
          : [];


        //lets use promise.all to fetch each products one by one. later make a separate function to fetch recent products
        const promises = recentProductIds
          .filter((id) => id !== productId && id)
          .slice(0, 10)
          .map((id) => getProductDetailsApi("slug",id));

        const responses = await Promise.all(promises);
        const products = responses
          .map((response) => response.data.product)
        setRecentlyViewed(products);
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
        setRecentlyViewed([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewedProducts();
  }, [productId]);

  const ProductCard = ({ product }) => (
    <Link to={`/product/slug?id=${product._id}`} className="group block">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={
            product.images && product.images[0]
              ? product.images[0]
              : "https://via.placeholder.com/300"
          }
          alt={product.productName}
          className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary">
          {product.productName}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-900">
        ₹{product.basePrice}
        </p>
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
            to={`/shop?category=${categoryId}`}
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-6">
            {loading ? (
              <p>Loading similar products...</p>
            ) : similarProducts.length > 0 ? (
              similarProducts.map((product) => (
                <div key={product._id} className="w-[200px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p>No similar products found</p>
            )}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section aria-labelledby="recently-viewed-heading">
        <div className="flex items-center justify-between">
          <h2 id="recently-viewed-heading" className="text-xl font-bold text-gray-900">
            Recently Viewed Products
          </h2>
        </div>

        <div className="mt-4 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-6">
            {loading ? (
              <p>Loading recently viewed products...</p>
            ) : recentlyViewed.length > 0 ? (
              recentlyViewed.map((product) => (
                <div key={product._id} className="w-[200px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p>No Recently Viewed Products</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductRecommendations;
