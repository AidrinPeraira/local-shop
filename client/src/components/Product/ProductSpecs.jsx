
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/button";




const ProductSpecs = ({ specifications }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleSpecs = isExpanded
    ? specifications
    : specifications.slice(0, 4);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display font-bold text-primary">
        Product Specifications
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleSpecs.map((spec, index) => (
          <div
            key={index}
            className="flex justify-between p-4 bg-secondary rounded-lg"
          >
            <span className="text-sm text-gray-600">{spec.label}</span>
            <span className="text-sm font-medium text-primary">{spec.value}</span>
          </div>
        ))}
      </div>

      {specifications.length > 4 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="mr-2">
            {isExpanded ? "Show Less" : "Show More"}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
      )}
    </div>
  );
};

export default ProductSpecs;
