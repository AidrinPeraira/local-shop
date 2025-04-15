import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Trash,
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { NestedCategoryDropdown } from "../seller/NestedCategoryDropdown";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CropModal from "./ProductCropImage";
import { useToast } from "../hooks/use-toast";

const ProductForm = ({ initialData = {}, onSubmit, categories }) => {
  // Set up react-hook-form with default values from initialData
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: initialData.name || "",
      description: initialData.description || "",
      category: initialData.category || "",
      basePrice: initialData.basePrice || 0,
      stockUnit: initialData.stockUnit || "Nos",
      stock: initialData.stock || 0,
      useVariants: initialData.variants
        ? initialData.variants.length > 0
        : false,
    },
  });

  // Watch values to use in component
  const useVariants = watch("useVariants");
  const basePrice = watch("basePrice");
  const stock = watch("stock");
const toast = useToast();
  // State for complex fields that need special handling
  const [images, setImages] = useState(initialData.images || []);
  const [variantTypes, setVariantTypes] = useState(
    initialData.variantTypes || []
  );
  const [variants, setVariants] = useState(initialData.variants || []);
  const [tierPrices, setTierPrices] = useState(
    initialData.tierPrices || [
      { id: "1", minQuantity: 1, price: 0 },
      { id: "2", minQuantity: 1, price: 0 },
    ]
  );

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState(null);

  // Image upload logic
  const handleImageUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setTempFile(file);
    setCropModalOpen(true);
  };

  const handleCropComplete = (croppedFile) => {
    const newImage = {
      id: Date.now().toString(),
      file: croppedFile,
      url: URL.createObjectURL(croppedFile),
      order: images.length,
    };

    setImages([...images, newImage]);
    setCropModalOpen(false);
    setTempFile(null);
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setTempFile(null);
  };

  const removeImage = (id) => {
    const newImages = images.filter((image) => image.id !== id);
    newImages.forEach((image, index) => {
      image.order = index;
    });
    setImages(newImages);
  };

  const moveImage = (id, direction) => {
    const newImages = [...images];
    const index = newImages.findIndex((img) => img.id === id);

    if (direction === "up" && index > 0) {
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
    }

    newImages.forEach((image, i) => {
      image.order = i;
    });

    setImages(newImages);
  };

  // Adding the different variations
  const addVariantType = () => {
    setVariantTypes([
      ...variantTypes,
      { id: Date.now().toString(), name: "", values: [] },
    ]);
  };

  const updateVariantType = (id, field, value) => {
    setVariantTypes(
      variantTypes.map((vt) => (vt.id === id ? { ...vt, [field]: value } : vt))
    );
  };

  const removeVariantType = (id) => {
    setVariantTypes(variantTypes.filter((vt) => vt.id !== id));
  };

  const addVariantValue = (typeId, value) => {
    if (!value.trim()) return;

    setVariantTypes(
      variantTypes.map((vt) =>
        vt.id === typeId ? { ...vt, values: [...vt.values, value.trim()] } : vt
      )
    );
  };

  const removeVariantValue = (typeId, valueIndex) => {
    setVariantTypes(
      variantTypes.map((vt) =>
        vt.id === typeId
          ? { ...vt, values: vt.values.filter((_, idx) => idx !== valueIndex) }
          : vt
      )
    );
  };

  // this the function that makes variant combos
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
        return [
          ...acc,
          ...generateCombinations(arrays, [...current, value], index + 1),
        ];
      }, []);
    };

    const validVariantTypes = variantTypes.filter(
      (vt) => vt.name && vt.values.length > 0
    );

    if (validVariantTypes.length === 0) {
      setVariants([]);
      return;
    }

    const combinations = generateCombinations(
      validVariantTypes.map((vt) => vt.values)
    );

    const newVariants = combinations.map((combination, index) => {
      const existingVariant = variants.find((v) => {
        return validVariantTypes.every(
          (vt, i) => v.attributes[vt.name] === combination[i]
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
        stock: stock,
      };
    });

    setVariants(newVariants);
  }, [useVariants, variantTypes, basePrice, stock]);

  // this is MOQ PRICING
  const addTierPrice = () => {
    const lastTier = tierPrices[tierPrices.length - 1];
    const newMinQuantity = lastTier ? lastTier.minQuantity + 5 : 5;

    setTierPrices([
      ...tierPrices,
      {
        id: Date.now().toString(),
        minQuantity: newMinQuantity,
        discout: 0,
      },
    ]);
  };

  const removeTierPrice = (id) => {
    setTierPrices(tierPrices.filter((tp) => tp.id !== id));
  };

  // Final Submit
  const handleFormSubmit = async (formData) => {
    try {

      if (images.length < 3) {
        toast({
          title: "Validation Error",
          description: "Please upload at least 3 product images",
          variant: "destructive",
        });
        return;
      }

      // Create a new FormData instance
      const submitFormData = new FormData();

      // Add all the basic form fields
      submitFormData.append("productName", formData.productName);
      submitFormData.append("description", formData.description);
      submitFormData.append("category", formData.category);
      submitFormData.append("basePrice", formData.basePrice);
      submitFormData.append("stock", formData.stock);

      // Add the images
      images.forEach((image) => {
        if (image.file) {
          submitFormData.append("images", image.file);
        }
      });

      // Add variant types data
      if (useVariants) {
        const validVariantTypes = variantTypes.filter(
          (vt) => vt.name && vt.values.length > 0
        );
        submitFormData.append("variantTypes", JSON.stringify(validVariantTypes));
        submitFormData.append("variants", JSON.stringify(variants));
      }

      submitFormData.append("bulkDiscount", JSON.stringify(tierPrices));
      if (initialData.id) {
        submitFormData.append("id", initialData.id);
      }

      await onSubmit(submitFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error toast with string message
      toast({
        title: "Error",
        description: "Some error occurred while submitting the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 max-h-[70vh] overflow-y-auto p-1"
    >
      {/* BASIC DETAILS */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-medium">Basic Information</h3>

        {/* PRODUCT NAME */}
        <div className="space-y-4 pt-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            className={errors.productName ? "border-red-500" : ""}
            {...register("productName", {
              required: "Product name is required",
            })}
          />
          {errors.productName && (
            <p className="text-red-500 text-sm">{errors.productName.message}</p>
          )}
        </div>

        {/* PRODUCT DESCRIPTION */}
        <div className="space-y-4 pt-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <div
                className={`rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all`}
              >
                <ReactQuill
                  theme="snow"
                  id="description"
                  value={field.value}
                  onChange={field.onChange}
                  className="rounded-lg  text-gray-800"
                />
              </div>
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* SELECTING THE CATEGORY */}
        <div className="space-y-4 pt-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <NestedCategoryDropdown
                onSelectCategory={(categoryId) => {
                  setValue(`category`, categoryId);
                }}
              />
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* UPLOADING IMAGES */}
      <div className="space-y-4 border-t pt-4">
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
            <Button
              type="button"
              onClick={() => document.getElementById("images")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          {images.length < 3 && (
            <p className="text-red-500 text-sm">
              At least 3 images are required
            </p>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div
                  key={image.id}
                  className="relative border rounded-md overflow-hidden group"
                >
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
                        onClick={() => moveImage(image.id, "up")}
                        disabled={image.order === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        type="button"
                        onClick={() => moveImage(image.id, "down")}
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

      {/* PRICE AND STOCK */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Pricing & Stock</h3>

        <div className="flex flex-wrap gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="basePrice">Base Price (₹)</Label>
            <Controller
              name="basePrice"
              control={control}
              rules={{
                required: "Base price is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              }}
              render={({ field }) => (
                <Input
                  id="basePrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={errors.basePrice ? "border-red-500" : ""}
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.basePrice && (
              <p className="text-red-500 text-sm">{errors.basePrice.message}</p>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="stockUnit">Stock Unit</Label>
            <Controller
              name="stockUnit"
              control={control}
              rules={{
                required: "Stock unit is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              }}
              render={({ field }) => (
                <Input
                  id="stockUnit"
                  type="text"
                  className={errors.stockUnit ? "border-red-500" : ""}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value || "Nos";
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.stockUnit && (
              <p className="text-red-500 text-sm">{errors.stockUnit.message}</p>
            )}
          </div>

          {!useVariants && (
            <div className="space-y-2 flex-1">
              <Label htmlFor="stock">Stock</Label>
              <Controller
                name="stock"
                control={control}
                rules={{
                  required: "Stock is required",
                  min: { value: 0, message: "Stock cannot be negative" },
                }}
                render={({ field }) => (
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    className={errors.stock ? "border-red-500" : ""}
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOQ DISCOUNTS */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Bulk Discount Pricing</h3>
          <Button type="button" size="sm" onClick={addTierPrice}>
            <Plus className="h-4 w-4 mr-1" /> Add Bulk Discounts
          </Button>
        </div>

        {tierPrices.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-2 items-end">
              <Label>Minimum Quantity</Label>
              <Label>Discount % from BasePrice</Label>
              <span></span>

              {tierPrices.map((tier, index) => (
                <React.Fragment key={tier.id}>
                  <Input
                    type="number"
                    min="1"
                    value={tier.minQuantity}
                    onChange={(e) => {
                      const newMinQty = parseInt(e.target.value) || 1;
                      setTierPrices(
                        tierPrices.map((t) =>
                          t.id === tier.id
                            ? { ...t, minQuantity: newMinQty }
                            : t
                        )
                      );
                    }}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    max="100"
                    value={tier.price}
                    onChange={(e) => {
                      const newPrice = parseFloat(e.target.value) || 0;
                      setTierPrices(
                        tierPrices.map((t) =>
                          t.id === tier.id ? { ...t, price: newPrice } : t
                        )
                      );
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
          </div>
        )}
      </div>

      {/* ADDING VARIANTS */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="useVariants"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="useVariants"
                className="rounded border-gray-300"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          <Label htmlFor="useVariants">
            This product has multiple variants
          </Label>
        </div>

        {useVariants && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Product Variants</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Define Variant Types</h4>
                <Button
                  type="button"
                  size="sm"
                  onClick={addVariantType}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Variant Type
                </Button>
              </div>

              {variantTypes.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-gray-500">
                    No variant types defined yet. Add your first variant type
                    (e.g., Color, Size).
                  </p>
                </div>
              )}

              {variantTypes.map((variantType, typeIndex) => (
                <div
                  key={variantType.id}
                  className="border rounded-md p-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">
                      {variantType.name || `Variant Type #${typeIndex + 1}`}
                    </h5>
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
                    <Label htmlFor={`variantType-${variantType.id}`}>
                      Type Name
                    </Label>
                    <Input
                      id={`variantType-${variantType.id}`}
                      value={variantType.name}
                      onChange={(e) =>
                        updateVariantType(
                          variantType.id,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Color, Size, Material"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Values</Label>
                    <div className="space-y-2">
                      {variantType.values.map((value, valueIndex) => (
                        <div
                          key={`${variantType.id}-value-${valueIndex}`}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={value}
                            onChange={(e) => {
                              const newValues = [...variantType.values];
                              newValues[valueIndex] = e.target.value;
                              updateVariantType(
                                variantType.id,
                                "values",
                                newValues
                              );
                            }}
                            placeholder={`Value #${valueIndex + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              removeVariantValue(variantType.id, valueIndex)
                            }
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.target;
                              addVariantValue(variantType.id, input.value);
                              input.value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              `new-value-${variantType.id}`
                            );
                            addVariantValue(variantType.id, input.value);
                            input.value = "";
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
                  <h4 className="font-medium">
                    Variant Combinations ({variants.length})
                  </h4>
                  <span className="text-sm text-gray-500">
                    Set price and stock for each combination
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary/20">
                        <th className="border p-2 text-left">
                          Variant Combination
                        </th>
                        <th className="border p-2 text-left">Price ($)</th>
                        <th className="border p-2 text-left">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => (
                        <tr key={variant.id}>
                          <td className="border p-2">
                            {Object.entries(variant.attributes).map(
                              ([key, value], idx, arr) => (
                                <span key={key}>
                                  <span className="font-medium">{key}:</span>{" "}
                                  {String(value)}
                                  {idx < arr.length - 1 ? ", " : ""}
                                </span>
                              )
                            )}
                          </td>
                          <td className="border p-2">
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => {
                                const newPrice =
                                  parseFloat(e.target.value) || 0;
                                setVariants(
                                  variants.map((v) =>
                                    v.id === variant.id
                                      ? { ...v, price: newPrice }
                                      : v
                                  )
                                );
                              }}
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={variant.stock}
                              onChange={(e) => {
                                const newStock = parseInt(e.target.value) || 0;
                                setVariants(
                                  variants.map((v) =>
                                    v.id === variant.id
                                      ? { ...v, stock: newStock }
                                      : v
                                  )
                                );
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
                      setVariants(
                        variants.map((v) => ({ ...v, price: basePrice }))
                      );
                    }}
                  >
                    Apply Base Price to All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVariants(variants.map((v) => ({ ...v, stock })));
                    }}
                  >
                    Apply Base Stock to All
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit">
          {initialData.id ? "Update Product" : "Create Product"}
        </Button>
      </div>

      {cropModalOpen && (
        <CropModal
          imageFile={tempFile}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </form>
  );
};

export default ProductForm;
