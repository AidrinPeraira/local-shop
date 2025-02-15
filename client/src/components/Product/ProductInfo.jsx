
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";



const ProductInfo = ({
  title,
  price,
  originalPrice,
  description,
  colors,
  sizes,
  stock,
}) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div className="space-y-6">
      {/* Title and Price */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">{title}</h1>
        <div className="mt-4 flex items-baseline gap-4">
          <span className="text-2xl font-bold text-primary">${price}</span>
          {originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600">{description}</p>

      {/* Color Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Color</label>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Size</label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stock Status */}
      <div className="text-sm">
        {stock > 0 ? (
          <span className="text-green-600">In Stock ({stock} available)</span>
        ) : (
          <span className="text-red-600">Out of Stock</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          size="lg"
          className="flex-1 bg-accent hover:bg-accent/90"
          disabled={stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
