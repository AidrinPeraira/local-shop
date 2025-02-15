
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CartHeader = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Checkbox id="select-all" />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All Variations
          </label>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="us">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Deliver to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="en-usd">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language - Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-usd">English - USD</SelectItem>
              <SelectItem value="en-gbp">English - GBP</SelectItem>
              <SelectItem value="fr-eur">French - EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
