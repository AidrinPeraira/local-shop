import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Plus, ChevronDown, ChevronRight, X } from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";

const steps = [
  { id: 1, title: "Company Details" },
  { id: 2, title: "Categories" },
  { id: 3, title: "Bank Info" },
  { id: 4, title: "Password Setup" },
];

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

// Component for the nested category dropdown
const NestedCategoryDropdown = ({ onSelectCategory }) => {
  const [expandedLevel1, setExpandedLevel1] = useState(null);
  const [expandedLevel2, setExpandedLevel2] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");

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

export const SellerRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      categories: []
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "categories" });
  const { toast } = useToast();

  const handleCategorySelect = (index, categoryId, categoryPath) => {
    setValue(`categories.${index}.id`, categoryId);
    setValue(`categories.${index}.path`, categoryPath);
  };

  const addCategory = () => {
    append({ id: "", path: "" });
  };

  const onSubmit = (data) => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Registration Complete",
        description: "Your seller account has been created successfully.",
      });
      console.log("Form data:", data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-center mb-4">Become a Seller</h1>
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id === currentStep
                      ? "bg-accent text-black"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className="text-xs mt-2 text-center md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-up">
              <input {...register("companyName", { required: true })} placeholder="Company Name" className="form-input w-full border p-2 rounded-md" />
              <textarea {...register("officeAddress", { required: true })} placeholder="Office Address" className="form-input w-full border p-2 rounded-md" rows={3} />
              <input {...register("city", { required: true })} placeholder="City" className="form-input w-full border p-2 rounded-md" />
              <input {...register("state", { required: true })} placeholder="State" className="form-input w-full border p-2 rounded-md" />
              <input {...register("pinCode", { required: true })} placeholder="Pin Code" className="form-input w-full border p-2 rounded-md" />
              <input {...register("gstPan", { required: true })} placeholder="GST/PAN Number" className="form-input w-full border p-2 rounded-md" />
              <input {...register("phone", { required: true })} placeholder="Phone Number" className="form-input w-full border p-2 rounded-md" />
              <input {...register("email", { required: true })} placeholder="Email" className="form-input w-full border p-2 rounded-md" />
            </div>
          )}

          {/* Step 2: Categories */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-up">
              <label className="block text-sm font-medium mb-1">Select Your Product Categories</label>
              <p className="text-sm text-gray-500 mb-4">Add the categories you want to sell products in. You can only select specific product categories (level 3).</p>
              
              {fields.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="hidden"
                      {...register(`categories.${index}.id`, { required: true })}
                    />
                    <div className="flex-1">
                      <NestedCategoryDropdown 
                        onSelectCategory={(categoryId, categoryPath) => 
                          handleCategorySelect(index, categoryId, categoryPath)
                        } 
                      />
                      {errors?.categories?.[index]?.id && (
                        <p className="text-red-500 text-xs mt-1">Please select a category</p>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => remove(index)} 
                      className="p-1 bg-red-50 text-red-500 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addCategory} 
                className="flex items-center gap-2 text-blue-500 mt-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
              
              {fields.length === 0 && (
                <p className="text-amber-500 text-sm">Please add at least one category</p>
              )}
            </div>
          )}

          {/* Step 3: Bank Info */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-up">
              <input {...register("accountHolderName", { required: true })} placeholder="Account Holder Name" className="form-input w-full border p-2 rounded-md" />
              <input {...register("bankName", { required: true })} placeholder="Bank Name" className="form-input w-full border p-2 rounded-md" />
              <input {...register("accountNumber", { required: true })} placeholder="Account Number" className="form-input w-full border p-2 rounded-md" />
              <input {...register("ifscCode", { required: true })} placeholder="IFSC Code" className="form-input w-full border p-2 rounded-md" />
            </div>
          )}

          {/* Step 4: Password Setup */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-up">
              <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Password" className="form-input w-full border p-2 rounded-md" />
              <input {...register("confirmPassword", { required: true, minLength: 6 })} type="password" placeholder="Confirm Password" className="form-input w-full border p-2 rounded-md" />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)} className="btn-secondary py-2 px-4 bg-gray-300 rounded-md">
                <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                Previous
              </button>
            )}
            <button 
              type="submit" 
              className="btn-primary ml-auto py-2 px-4 bg-primary text-white rounded-md flex items-center"
              disabled={currentStep === 2 && fields.length === 0}
            >
              {currentStep === steps.length ? "Complete" : "Next"}
              {currentStep < steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};