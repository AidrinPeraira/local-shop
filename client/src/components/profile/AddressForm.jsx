
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";


export const AddressForm= ({
  address,
  onSubmit,
  isDefault = false
}) => {
  const [formData, setFormData] = useState({
    id: address?.id || '',
    type: address?.type || 'Home',
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    isDefault: address?.isDefault || isDefault
  });
  
  // Update form if address changes (for editing)
  useEffect(() => {
    if (address) {
      setFormData({
        id: address.id,
        type: address.type,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault
      });
    }
  }, [address]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Address Type</Label>
          <Input
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Home, Work, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => {
            setFormData(prev => ({ ...prev, isDefault: checked === true }));
          }}
        />
        <label
          htmlFor="isDefault"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Set as my default address
        </label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          {address ? 'Update Address' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
};
