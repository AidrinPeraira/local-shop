import React from 'react';
import { Building } from 'lucide-react';



const ProductInfo = ({ description, sellerName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {sellerName && (
        <div className="mb-4 flex items-center text-gray-600">
          <Building className="w-4 h-4 mr-2" />
          <span className="text-sm">Sold by: <span className="font-medium">{sellerName}</span></span>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Product Description</h2>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default ProductInfo;
