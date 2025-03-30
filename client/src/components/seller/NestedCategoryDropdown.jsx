import { ChevronDown, ChevronRight, } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import store from '../../redux/store';

export const NestedCategoryDropdown = ({  onSelectCategory }) => {

    const [expandedLevel1, setExpandedLevel1] = useState(null);
    const [expandedLevel2, setExpandedLevel2] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPath, setSelectedPath] = useState("");


  
    const {categories} = useSelector(store => store.categories) 

    const toggleLevel1 = (categoryId) => {
      setExpandedLevel1(expandedLevel1 === categoryId ? null : categoryId);
      setExpandedLevel2(null);
    };
  
    const toggleLevel2 = (categoryId, event) => {
      event.stopPropagation();
      setExpandedLevel2(expandedLevel2 === categoryId ? null : categoryId);
    };
  
    const selectCategory = (level1Name, level2Name, level3) => {
      const path = `${level1Name} > ${level2Name} > ${level3.name}`;
      setSelectedPath(path);
      setShowDropdown(false);
      onSelectCategory(level3._id, path);
    };
  
    return (
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex justify-between items-center w-full border p-2 rounded-md"
        >
          {selectedPath || "Select Category"}
          <ChevronDown className="w-4 h-4" />
        </button>
  
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-auto">
            {categories.map((level1) => (
              <div key={level1._id} className="border-b">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleLevel1(level1._id)}
                >
                  {expandedLevel1 === level1._id ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  <span>{level1.name}</span>
                </div>
  
                {expandedLevel1 === level1._id && level1.subCategories && (
                  <div className="pl-4">
                    {level1.subCategories.map((level2) => (
                      <div key={level2._id}>
                        <div
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                          onClick={(e) => toggleLevel2(level2._id, e)}
                        >
                          {expandedLevel2 === level2._id ? (
                            <ChevronDown className="w-4 h-4 mr-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-2" />
                          )}
                          <span>{level2.name}</span>
                        </div>
  
                        {expandedLevel2 === level2._id && level2.subSubCategories && (
                          <div className="pl-4">
                            {level2.subSubCategories.map((level3) => (
                              <div
                                key={level3._id}
                                className="p-2 pl-6 cursor-pointer hover:bg-gray-100"
                                onClick={() => selectCategory(level1.name, level2.name, level3)}
                              >
                                {level3.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
