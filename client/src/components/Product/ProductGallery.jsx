import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "../../components/ui/button";

const ProductGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[activeImage].url}
          alt={images[activeImage].alt}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={previousImage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextImage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveImage(index)}
            className={`relative aspect-square w-20 rounded-md overflow-hidden ${
              activeImage === index ? "ring-2 ring-accent" : ""
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
