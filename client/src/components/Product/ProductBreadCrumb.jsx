import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';



const ProductBreadcrumbs = ({ category, subcategory, categoryId, productName }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <Link to="/" className="text-gray-500 hover:text-primary inline-flex items-center text-sm font-medium">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/shop" className="ml-1 text-gray-500 hover:text-primary text-sm font-medium md:ml-2">Shop</Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link 
              to={`/shop?category=${categoryId}`} 
              className="ml-1 text-gray-500 hover:text-primary text-sm font-medium md:ml-2"
            >
              {category}
            </Link>
          </div>  
        </li>
        {subcategory && (
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link 
                to={`/shop?category=${category}&subcategory=${subcategory}`} 
                className="ml-1 text-gray-500 hover:text-primary text-sm font-medium md:ml-2"
              >
                {subcategory}
              </Link>
            </div>
          </li>
        )}
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-gray-600 text-sm font-medium md:ml-2 truncate max-w-[200px]">
              {productName}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumbs;