import React from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DialogFooter } from "../ui/dialog";
import { useToast } from "../hooks/use-toast";

const CouponForm = ({ onSubmit, initialData = {}, couponForm, setCouponForm }) => {
  const { toast } = useToast();

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponForm({ ...couponForm, code });
  };

  const validateForm = () => {
    if (!couponForm.code || couponForm.code.length < 4) {
      toast({
        title: "Invalid Code",
        description: "Coupon code must be at least 4 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (couponForm.discountType === 'percentage' && 
        (couponForm.discountValue <= 0 || couponForm.discountValue > 100)) {
      toast({
        title: "Invalid Discount",
        description: "Percentage discount must be between 1 and 100",
        variant: "destructive",
      });
      return false;
    }

    if (couponForm.discountType === 'fixed' && couponForm.discountValue <= 0) {
      toast({
        title: "Invalid Discount",
        description: "Fixed discount must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (couponForm.minPurchase <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Minimum purchase amount must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (couponForm.maxDiscount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Maximum discount must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    const today = new Date();
    const validFrom = new Date(couponForm.validFrom);
    const validUntil = new Date(couponForm.validUntil);

    

    if (validUntil <= validFrom) {
      toast({
        title: "Invalid Date Range",
        description: "Valid until date must be after valid from date",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Coupon Code</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
              required
              className="flex-1"
              maxLength={12}
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateCouponCode}
            >
              Generate
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type</Label>
          <select
            id="discountType"
            className="w-full p-2 border rounded"
            value={couponForm.discountType}
            onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">
            {couponForm.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}
          </Label>
          <Input
            id="discountValue"
            type="number"
            value={couponForm.discountValue}
            onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
            required
            min={0}
            max={couponForm.discountType === 'percentage' ? 100 : undefined}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minPurchase">Minimum Purchase (₹)</Label>
          <Input
            id="minPurchase"
            type="number"
            value={couponForm.minPurchase}
            onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
            required
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validFrom">Valid From</Label>
          <Input
            id="validFrom"
            type="date"
            value={couponForm.validFrom}
            onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={couponForm.validUntil}
            onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
            required
            min={couponForm.validFrom}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxDiscount">Maximum Discount (₹)</Label>
          <Input
            id="maxDiscount"
            type="number"
            value={couponForm.maxDiscount}
            onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
            required
            min={0}
          />
        </div>
        <div className="space-y-2">
        <Label htmlFor="usageLimit">Usage Limit</Label>
          <Input
            id="usageLimit"
            type="number"
            value={couponForm.usageLimit}
            onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
            required
            min={1}
            placeholder="Maximum number of uses per user"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit">
          {initialData._id ? 'Update Coupon' : 'Add Coupon'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CouponForm;