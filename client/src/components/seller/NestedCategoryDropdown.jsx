import { ChevronDown, ChevronRight, } from 'lucide-react';
import React, { useState } from 'react'

export const NestedCategoryDropdown = ({ onSelectCategory }) => {
    const [expandedLevel1, setExpandedLevel1] = useState(null);
    const [expandedLevel2, setExpandedLevel2] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPath, setSelectedPath] = useState("");

    const categories = [
        {
          _id: "67bcb803d41ab96fa340167a",
          name: "Construction Materials",
          level: 1,
          subcategories: [
            {
              _id: "67bcb83cd41ab96fa340167f",
              name: "Steel & Rebar",
              level: 2,
              subcategories: [
                { _id: "67bcb851d41ab96fa3401684", name: "Reinforced Steel Bars", level: 3 },
                { _id: "67bcb85cd41ab96fa3401689", name: "Wire Mesh", level: 3 }
              ],
            }
          ],
        },
        {
          _id: "67bcb87bd41ab96fa340168d",
          name: "Hardware & Tools",
          level: 1,
          subcategories: [
            {
              _id: "67bcb89cd41ab96fa3401692",
              name: "Hand Tools",
              level: 2,
              subcategories: [
                { _id: "67bcbae9d41ab96fa34016dd", name: "Hammers", level: 3 },
                { _id: "67bcbaf2d41ab96fa34016e2", name: "Wrenches", level: 3 }
              ]
            },
            {
              _id: "67bcb8a8d41ab96fa3401697",
              name: "Fasteners",
              level: 2,
              subcategories: [
                { _id: "67bcb8b6d41ab96fa340169c", name: "Screws", level: 3 },
                { _id: "67bcb8bbd41ab96fa34016a1", name: "Bolts", level: 3 }
              ]
            }
          ],
        },
        {
          _id: "67bcb8ded41ab96fa34016a5",
          name: "Apparel & Textiles",
          level: 1,
          subcategories: [
            {
              _id: "67bcb8f0d41ab96fa34016aa",
              name: "Clothing",
              level: 2,
              subcategories: [
                { _id: "67bcbb1fd41ab96fa34016e7", name: "T-Shirts", level: 3 },
                { _id: "67bcbb27d41ab96fa34016ec", name: "Pants", level: 3 }
              ]
            },
            {
              _id: "67bcb8fad41ab96fa34016af",
              name: "Fabric Materials",
              level: 2,
              subcategories: [
                { _id: "67bcb90dd41ab96fa34016b4", name: "Cotton Fabric", level: 3 },
                { _id: "67bcb919d41ab96fa34016b9", name: "Polyester Fabric", level: 3 }
              ]
            }
          ],
        },
        {
          _id: "67bcb92ed41ab96fa34016bd",
          name: "Home & Furniture",
          level: 1,
          subcategories: [
            {
              _id: "67bcb94dd41ab96fa34016c2",
              name: "Furniture",
              level: 2,
              subcategories: [
                { _id: "67bcbbd7d41ab96fa34016f1", name: "Office Chairs", level: 3 },
                { _id: "67bcbbe0d41ab96fa34016f6", name: "Beds", level: 3 }
              ]
            },
            {
              _id: "67bcb957d41ab96fa34016c7",
              name: "Home Decor",
              level: 2,
              subcategories: [
                { _id: "67bcb96cd41ab96fa34016cc", name: "Wall Art", level: 3 },
                { _id: "67bcb97ed41ab96fa34016d3", name: "Lamps & Lighting", level: 3 }
              ]
            }
          ],
        },
        {
          _id: "67c1ec69133d95b5171dd342",
          name: "Alpha 1",
          level: 1,
          subcategories: [
            {
              _id: "67c1ec93133d95b5171dd353",
              name: "Beta 1",
              level: 2,
              subcategories: [
                { _id: "67c1ec9e133d95b5171dd35a", name: "Gamma 1 edit 1", level: 3 }
              ]
            }
          ],
        }
      ];

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
      onSelectCategory(level3._id, path);
      setShowDropdown(false);
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
  
                {expandedLevel1 === level1._id && level1.subcategories && (
                  <div className="pl-4">
                    {level1.subcategories.map((level2) => (
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
  
                        {expandedLevel2 === level2._id && level2.subcategories && (
                          <div className="pl-4">
                            {level2.subcategories.map((level3) => (
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
