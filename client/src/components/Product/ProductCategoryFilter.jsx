import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, ChevronRight } from 'lucide-react';
import { Checkbox } from "../../components/ui/checkbox.jsx";

export const ProductCategoryFilter = ({ category, selectedCategory, onCategorySelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubCategories = category.subCategories?.length > 0;
    const hasSubSubCategories = category.subSubCategories?.length > 0;
  
    return (
      <div className="w-full">
        <div className={`flex items-center space-x-2 py-1 ${category.level > 1 ? 'ml-' + (category.level * 3) : ''}`}>
          {(hasSubCategories || hasSubSubCategories) && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <label className="flex items-center space-x-2 flex-1 cursor-pointer">
            {/* Only show checkbox for level 3 categories */}
            {category.level === 3 && (
              <Checkbox
                checked={selectedCategory === category._id}
                onCheckedChange={(checked) => onCategorySelect(category._id, category.name, checked, category.level)}
              />
            )}
            <span className="flex-1 text-sm">{category.name}</span>
          </label>
        </div>
  
        {isOpen && (
          <div className="ml-2">
            {hasSubCategories && category.subCategories.map((subCategory) => (
              <ProductCategoryFilter
                key={subCategory._id}
                category={subCategory}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
              />
            ))}
            {hasSubSubCategories && category.subSubCategories.map((subSubCategory) => (
              <ProductCategoryFilter
                key={subSubCategory._id}
                category={subSubCategory}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  };