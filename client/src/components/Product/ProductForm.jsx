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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(
    "At least 3 images are required"
  );
  const [variantError, setVariantError] = useState("");
  const [images, setImages] = useState(initialData.images || []);
  const [variantTypes, setVariantTypes] = useState(
    initialData.variantTypes || [{ id: Date.now().toString(), name: "Type", values: ["Universal"] }]
  );
  const [variants, setVariants] = useState(initialData.variants || []);
  const [tierPrices, setTierPrices] = useState(
    initialData.tierPrices || [
      { id: "1", minQuantity: 10, price: 5 },
      { id: "2", minQuantity: 50, price: 10 },
    ]
  );
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState(null);
  

  // Validate images count
  useEffect(() => {
    setImageError(images.length < 3 ? "At least 3 images are required" : "");
  }, [images]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      productName: initialData.name || "",
      description: initialData.description || "",
      category: initialData.category || "",
      basePrice: initialData.basePrice || 0,
      stockUnit: initialData.stockUnit || "Nos",
      stock: initialData.stock || 0,
      useVariants: true,
    },
    resolver: async (data) => {
      const errors = {};

      if (!data.productName?.trim()) {
        errors.productName = { message: "Product name is required" };
      }

      if (!data.description?.trim()) {
        errors.description = { message: "Description is required" };
      }

      if (!data.category) {
        errors.category = { message: "Category is required" };
      }

      if (!data.basePrice || data.basePrice <= 0) {
        errors.basePrice = { message: "Base price must be greater than 0" };
      }

      if (!data.stockUnit?.trim()) {
        errors.stockUnit = { message: "Stock unit is required" };
      }

      if (!data.useVariants && (!data.stock || data.stock < 0)) {
        errors.stock = { message: "Stock must be 0 or greater" };
      }

      return {
        values: data,
        errors: Object.keys(errors).length > 0 ? errors : {},
      };
    },
  });

  // Watch values to use in component
  const useVariants = watch("useVariants");
  const basePrice = watch("basePrice");
  const stock = watch("stock");
  const toast = useToast();


  
  // Validate variants
  useEffect(() => {
    if (useVariants) {
      const validVariantTypes = variantTypes.filter(
        (vt) => vt.name && vt.values.length > 0
      );
      if (validVariantTypes.length === 0) {
        setVariantError("Please add at least one variant type with values");
      } else if (
        variants.some(
          (v) => !v.price || v.price <= 0 || !v.stock || v.stock < 0
        )
      ) {
        setVariantError("All variants must have valid price and stock values");
      } else {
        setVariantError("");
      }
    } else {
      setVariantError("");
    }
  }, [useVariants, variantTypes, variants]);

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
      // Image validation
      if (images.length < 3) {
        toast({
          title: "Validation Error",
          description: "Please upload at least 3 product images",
          variant: "destructive",
        });
        return;
      }

      // Variant validation
      if (useVariants) {
        const validVariantTypes = variantTypes.filter(
          (vt) => vt.name && vt.values.length > 0
        );
        if (validVariantTypes.length === 0) {
          toast({
            title: "Validation Error",
            description: "Please add at least one variant type with values",
            variant: "destructive",
          });
          return;
        }

        // Check for empty variant type names
        const emptyNameTypes = variantTypes.filter((vt) => !vt.name.trim());
        if (emptyNameTypes.length > 0) {
          toast({
            title: "Variant Error",
            description: "All variant types must have a name",
            variant: "destructive",
          });
          return;
        }

        // Check for variant types without values
        const emptyValueTypes = variantTypes.filter(
          (vt) => vt.values.length === 0
        );
        if (emptyValueTypes.length > 0) {
          toast({
            title: "Variant Error",
            description: `Please add at least one value for each variant type`,
            variant: "destructive",
          });
          return;
        }

        // Validate variant prices and stock
        const invalidVariants = variants.filter(
          (v) => !v.price || v.price <= 0 || !v.stock || v.stock < 0
        );
        if (invalidVariants.length > 0) {
          toast({
            title: "Variant Error",
            description:
              "All variants must have valid price (> 0) and stock (≥ 0) values",
            variant: "destructive",
          });
          return;
        }
      }

      if (Object.keys(errors).length > 0) {
        toast({
          title: "Validation Error",
          description: "Please fix all form errors before submitting",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
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
        submitFormData.append(
          "variantTypes",
          JSON.stringify(validVariantTypes)
        );
        submitFormData.append("variants", JSON.stringify(variants));
      }

      submitFormData.append("bulkDiscount", JSON.stringify(tierPrices));
      if (initialData.id) {
        submitFormData.append("id", initialData.id);
      }

      const response = await onSubmit(submitFormData);

      if (response?.success) {
        toast({
          title: "Success",
          description: "Product saved successfully!",
          variant: "default",
        });
        return true; // Indicate success to parent component
      }

      return false; // Indicate failure to parent component
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save product",
        variant: "destructive",
      });
      return false; // Indicate failure to parent component
    } finally {
      setIsSubmitting(false);
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
              onChange: () => trigger("productName")
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
            rules={{ 
              required: "Description is required",
              onChange: () => trigger("description")
            }}
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
                  onChange={(value) => {
                    field.onChange(value);
                    trigger("description");
                  }}
                  className="rounded-lg text-gray-800"
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
              className={`flex-1 ${imageError ? "border-red-500" : ""}`}
            />
            <Button
              type="button"
              onClick={() => document.getElementById("images")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
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
        <div className="items-center space-x-2 hidden">
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
              {variantError && (
                <p className="text-red-500 text-sm">{variantError}</p>
              )}

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
                  className={`border rounded-md p-4 space-y-4 ${
                    !variantType.name ? "border-red-500" : ""
                  }`}
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
                      Type Name <span className="text-red-500">*</span>
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
                      className={!variantType.name ? "border-red-500" : ""}
                      placeholder="e.g. Size, Color"
                    />
                    {!variantType.name && (
                      <p className="text-red-500 text-sm">
                        Variant type name is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Values <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {variantType.values.map((value, valueIndex) => (
                        <div
                          key={valueIndex}
                          className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                        >
                          <span>{value}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeVariantValue(variantType.id, valueIndex)
                            }
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {variantType.values.length === 0 && (
                      <p className="text-red-500 text-sm">
                        At least one value is required
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a value"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.target.value;
                            if (value) {
                              addVariantValue(variantType.id, value);
                              e.target.value = "";
                            }
                          }
                        }}
                        className={
                          variantType.values.length === 0
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const value = input.value;
                          if (value) {
                            addVariantValue(variantType.id, value);
                            input.value = "";
                          }
                        }}
                      >
                        Add
                      </Button>
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
        <Button
          type="submit"
          disabled={isSubmitting || !isValid || Object.keys(errors).length > 0}
          className="relative"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              {Object.keys(errors).length > 0 && (
                <span className="absolute -top-8 right-0 text-xs text-red-500">
                  Please fix all errors before submitting
                </span>
              )}
              {initialData.id ? "Update Product" : "Create Product"}
            </>
          )}
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
