import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Trash, Upload, X, ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";

const ProductForm = ({
  initialData = {},
  onSubmit,
  categories,
}) => {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [basePrice, setBasePrice] = useState(initialData.basePrice || 0);
  const [stock, setStock] = useState(initialData.stock || 0);
  const [images, setImages] = useState(
    initialData.images || []
  );
  const [variants, setVariants] = useState(
    initialData.variants || []
  );
  const [variantTypes, setVariantTypes] = useState([
    { id: "1", name: "Color", values: ["Red", "Blue", "Green"] },
    { id: "2", name: "Size", values: ["Small", "Medium", "Large"] },
  ]);
  const [tierPrices, setTierPrices] = useState(
    initialData.tierPrices || [
      { id: "1", minQuantity: 5, price: 0 },
      { id: "2", minQuantity: 10, price: 0 },
    ]
  );
  const [errors, setErrors] = useState({});
  const [useVariants, setUseVariants] = useState(initialData.variants ? initialData.variants.length > 0 : false);

  const handleImageUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newImages = [];
    
    Array.from(e.target.files).forEach((file, index) => {
      newImages.push({
        id: Date.now() + index.toString(),
        file,
        url: URL.createObjectURL(file),
        order: images.length + index,
      });
    });
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    const newImages = images.filter(image => image.id !== id);
    newImages.forEach((image, index) => {
      image.order = index;
    });
    setImages(newImages);
  };

  const moveImage = (id, direction) => {
    const newImages = [...images];
    const index = newImages.findIndex(img => img.id === id);
    
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    
    newImages.forEach((image, i) => {
      image.order = i;
    });
    
    setImages(newImages);
  };

  const addVariantType = () => {
    setVariantTypes([
      ...variantTypes,
      { id: Date.now().toString(), name: "", values: [] }
    ]);
  };

  const updateVariantType = (id, field, value) => {
    setVariantTypes(
      variantTypes.map(vt => 
        vt.id === id 
          ? { ...vt, [field]: value } 
          : vt
      )
    );
  };

  const removeVariantType = (id) => {
    setVariantTypes(variantTypes.filter(vt => vt.id !== id));
  };

  const addVariantValue = (typeId, value) => {
    if (!value.trim()) return;
    
    setVariantTypes(
      variantTypes.map(vt => 
        vt.id === typeId 
          ? { ...vt, values: [...vt.values, value.trim()] } 
          : vt
      )
    );
  };

  const removeVariantValue = (typeId, valueIndex) => {
    setVariantTypes(
      variantTypes.map(vt => 
        vt.id === typeId 
          ? { ...vt, values: vt.values.filter((_, idx) => idx !== valueIndex) } 
          : vt
      )
    );
  };

  useEffect(() => {
    if (!useVariants || variantTypes.length === 0) {
      setVariants([]);
      return;
    }

    const generateCombinations = (arrays, current = [], index = 0) => {
      if (index === arrays.length) {
        return [current];
      }

      return arrays[index].reduce((acc, value) => {
        return [...acc, ...generateCombinations(arrays, [...current, value], index + 1)];
      }, []);
    };

    const validVariantTypes = variantTypes.filter(vt => vt.name && vt.values.length > 0);
    
    if (validVariantTypes.length === 0) {
      setVariants([]);
      return;
    }

    const combinations = generateCombinations(validVariantTypes.map(vt => vt.values));
    
    const newVariants = combinations.map((combination, index) => {
      const existingVariant = variants.find(v => {
        return validVariantTypes.every((vt, i) => 
          v.attributes[vt.name] === combination[i]
        );
      });

      if (existingVariant) {
        return existingVariant;
      }

      const variantAttributes = {};
      validVariantTypes.forEach((vt, i) => {
        variantAttributes[vt.name] = combination[i];
      });

      return {
        id: `variant-${Date.now()}-${index}`,
        attributes: variantAttributes,
        price: basePrice,
        stock: stock
      };
    });

    setVariants(newVariants);
  }, [useVariants, variantTypes, basePrice, stock]);

  const addTierPrice = () => {
    const lastTier = tierPrices[tierPrices.length - 1];
    const newMinQuantity = lastTier ? lastTier.minQuantity + 5 : 5;
    
    setTierPrices([
      ...tierPrices,
      { id: Date.now().toString(), minQuantity: newMinQuantity, price: basePrice * 0.9 }
    ]);
  };

  const removeTierPrice = (id) => {
    setTierPrices(tierPrices.filter(tp => tp.id !== id));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (basePrice <= 0) newErrors.basePrice = "Price must be greater than 0";
    if (!useVariants && stock < 0) newErrors.stock = "Stock cannot be negative";
    if (images.length === 0) newErrors.images = "At least one image is required";
    if (images.length < 3) newErrors.images = "At least 3 images are required";
    
    if (useVariants) {
      if (variantTypes.length === 0) {
        newErrors.variants = "At least one variant type is required";
      } else {
        const invalidTypes = variantTypes.filter(vt => !vt.name || vt.values.length === 0);
        if (invalidTypes.length > 0) {
          newErrors.variants = "All variant types must have a name and at least one value";
        }
        
        const invalidVariants = variants.filter(v => v.price <= 0 || v.stock < 0);
        if (invalidVariants.length > 0) {
          newErrors.variants = "All variants must have valid price and stock";
        }
      }
    }
    
    const invalidTiers = tierPrices.filter(tp => tp.price <= 0 || tp.minQuantity <= 0);
    if (invalidTiers.length > 0) {
      newErrors.tierPrices = "All tier prices must be valid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const formData = {
      name,
      description,
      category,
      basePrice,
      stock: useVariants ? null : stock,
      images,
      variants: useVariants ? variants : [],
      tierPrices,
      id: initialData.id,
      isDeleted: initialData.isDeleted || false,
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={`w-full border rounded-md px-3 py-2 ${errors.category ? "border-red-500" : "border-input"}`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Product Images</h3>
        <div className="space-y-2">
          <Label htmlFor="images">Upload Images (minimum 3)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="flex-1"
            />
            <Button type="button" onClick={() => document.getElementById("images")?.click()}>
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
        </div>
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.sort((a, b) => a.order - b.order).map((image) => (
              <div key={image.id} className="relative border rounded-md overflow-hidden group">
                <img 
                  src={image.url} 
                  alt="Product" 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    type="button" 
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      type="button" 
                      onClick={() => moveImage(image.id, 'up')}
                      disabled={image.order === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      type="button" 
                      onClick={() => moveImage(image.id, 'down')}
                      disabled={image.order === images.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute top-1 left-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  {image.order + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pricing & Stock</h3>
        
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="basePrice">Base Price ($)</Label>
            <Input
              id="basePrice"
              type="number"
              min="0.01"
              step="0.01"
              value={basePrice}
              onChange={e => setBasePrice(parseFloat(e.target.value) || 0)}
              className={errors.basePrice ? "border-red-500" : ""}
            />
            {errors.basePrice && <p className="text-red-500 text-sm">{errors.basePrice}</p>}
          </div>
          
          {!useVariants && (
            <div className="space-y-2 flex-1">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={e => setStock(parseInt(e.target.value) || 0)}
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useVariants"
            checked={useVariants}
            onChange={e => setUseVariants(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="useVariants">This product has multiple variants</Label>
        </div>
      </div>
      
      {useVariants && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Product Variants</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Define Variant Types</h4>
              <Button type="button" size="sm" onClick={addVariantType} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-1" /> Add Variant Type
              </Button>
            </div>
            
            {variantTypes.length === 0 && (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-gray-500">No variant types defined yet. Add your first variant type (e.g., Color, Size).</p>
              </div>
            )}
            
            {variantTypes.map((variantType, typeIndex) => (
              <div key={variantType.id} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">{variantType.name || `Variant Type #${typeIndex + 1}`}</h5>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeVariantType(variantType.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`variantType-${variantType.id}`}>Type Name</Label>
                  <Input
                    id={`variantType-${variantType.id}`}
                    value={variantType.name}
                    onChange={e => updateVariantType(variantType.id, 'name', e.target.value)}
                    placeholder="e.g. Color, Size, Material"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Values</Label>
                  <div className="space-y-2">
                    {variantType.values.map((value, valueIndex) => (
                      <div key={`${variantType.id}-value-${valueIndex}`} className="flex items-center gap-2">
                        <Input
                          value={value}
                          onChange={e => {
                            const newValues = [...variantType.values];
                            newValues[valueIndex] = e.target.value;
                            updateVariantType(variantType.id, 'values', newValues);
                          }}
                          placeholder={`Value #${valueIndex + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeVariantValue(variantType.id, valueIndex)}
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add new value..."
                        id={`new-value-${variantType.id}`}
                        className="flex-1"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target;
                            addVariantValue(variantType.id, input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(`new-value-${variantType.id}`);
                          addVariantValue(variantType.id, input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {variants.length > 0 && (
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Variant Combinations ({variants.length})</h4>
                <span className="text-sm text-gray-500">
                  Set price and stock for each combination
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary/20">
                      <th className="border p-2 text-left">Variant Combination</th>
                      <th className="border p-2 text-left">Price ($)</th>
                      <th className="border p-2 text-left">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map(variant => (
                      <tr key={variant.id}>
                        <td className="border p-2">
                          {Object.entries(variant.attributes).map(([key, value], idx, arr) => (
                            <span key={key}>
                              <span className="font-medium">{key}:</span> {value}
                              {idx < arr.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </td>
                        <td className="border p-2">
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={variant.price}
                            onChange={e => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              setVariants(variants.map(v => 
                                v.id === variant.id ? { ...v, price: newPrice } : v
                              ));
                            }}
                          />
                        </td>
                        <td className="border p-2">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={variant.stock}
                            onChange={e => {
                              const newStock = parseInt(e.target.value) || 0;
                              setVariants(variants.map(v => 
                                v.id === variant.id ? { ...v, stock: newStock } : v
                              ));
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setVariants(variants.map(v => ({ ...v, price: basePrice })));
                  }}
                >
                  Apply Base Price to All
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setVariants(variants.map(v => ({ ...v, stock })));
                  }}
                >
                  Apply Base Stock to All
                </Button>
              </div>
              
              {errors.variants && <p className="text-red-500 text-sm">{errors.variants}</p>}
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Bulk Discount Pricing</h3>
          <Button type="button" size="sm" onClick={addTierPrice}>
            <Plus className="h-4 w-4 mr-1" /> Add Price Tier
          </Button>
        </div>
        
        {tierPrices.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-2 items-end">
              <Label>Minimum Quantity</Label>
              <Label>Price Per Unit ($)</Label>
              <span></span>
              
              {tierPrices.map((tier, index) => (
                <React.Fragment key={tier.id}>
                  <Input
                    type="number"
                    min="1"
                    value={tier.minQuantity}
                    onChange={e => {
                      const newMinQty = parseInt(e.target.value) || 1;
                      setTierPrices(tierPrices.map(t => 
                        t.id === tier.id ? { ...t, minQuantity: newMinQty } : t
                      ));
                    }}
                  />
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={tier.price}
                    onChange={e => {
                      const newPrice = parseFloat(e.target.value) || 0;
                      setTierPrices(tierPrices.map(t => 
                        t.id === tier.id ? { ...t, price: newPrice } : t
                      ));
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTierPrice(tier.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </React.Fragment>
              ))}
            </div>
            
            {errors.tierPrices && <p className="text-red-500 text-sm">{errors.tierPrices}</p>}
          </div>
        )}
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit">
          {initialData.id ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;