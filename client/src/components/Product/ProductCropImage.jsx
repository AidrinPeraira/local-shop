import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '../ui/button';

const CropModal = ({ onComplete, onCancel, imageFile }) => {
  const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 });
  const [currentImage, setCurrentImage] = useState(null);

  const handleCrop = async () => {
    if (!currentImage) return;

    const canvas = document.createElement('canvas');
    const scaleX = currentImage.naturalWidth / currentImage.width;
    const scaleY = currentImage.naturalHeight / currentImage.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      currentImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      const croppedFile = new File([blob], imageFile.name, {
        type: imageFile.type,
      });
      onComplete(croppedFile);
    });
  };

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setCurrentImage(img);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
        <h3 className="text-lg font-medium mb-4">Crop Image</h3>
        <div className="max-h-[60vh] overflow-auto">
          {currentImage && (
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={1}
            >
              <img
                src={currentImage.src}
                alt="Crop"
                style={{ maxWidth: '100%' }}
              />
            </ReactCrop>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCrop}
          >
            Crop & Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;