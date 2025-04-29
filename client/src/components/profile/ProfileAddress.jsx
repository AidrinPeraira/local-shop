import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../hooks/use-toast";
import { PageLoading } from "../ui/PageLoading";
import {
  getUserAddressesApi,
  addUserAddressApi,
  editUserAddressApi,
  deleteUserAddressApi,
} from "../../api/userDataApi";

const ProfileAddress = () => {
  const [addresses, setAddresses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getUserAddressesApi();
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch addresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation regex patterns
    const streetRegex = /^[a-zA-Z0-9\s,.-]{3,}$/;
    const cityStateRegex = /^[a-zA-Z\s]{2,}$/;
    const pincodeRegex = /^\d{6}$/;

    // Validate street
    if (!addressForm.street.trim()) {
      toast({
        title: "Error",
        description: "Street address is required",
        variant: "destructive",
      });
      return;
    }

    if (!streetRegex.test(addressForm.street.trim())) {
      toast({
        title: "Error",
        description: "Invalid street address format",
        variant: "destructive",
      });
      return;
    }

    // Validate city
    if (!addressForm.city.trim()) {
      toast({
        title: "Error",
        description: "City is required",
        variant: "destructive",
      });
      return;
    }

    if (!cityStateRegex.test(addressForm.city.trim())) {
      toast({
        title: "Error",
        description: "City name should only contain letters",
        variant: "destructive",
      });
      return;
    }

    // Validate state
    if (!addressForm.state.trim()) {
      toast({
        title: "Error",
        description: "State is required",
        variant: "destructive",
      });
      return;
    }

    if (!cityStateRegex.test(addressForm.state.trim())) {
      toast({
        title: "Error",
        description: "State name should only contain letters",
        variant: "destructive",
      });
      return;
    }

    // Validate pincode
    if (!addressForm.pincode.trim()) {
      toast({
        title: "Error",
        description: "Pincode is required",
        variant: "destructive",
      });
      return;
    }

    if (!pincodeRegex.test(addressForm.pincode)) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingAddress) {
        await editUserAddressApi({
          addressId: editingAddress._id,
          ...addressForm,
        });
      } else {
        await addUserAddressApi(addressForm);
      }

      toast({
        title: "Success",
        description: editingAddress
          ? "Address updated successfully"
          : "Address added successfully",
      });
      setIsAddingNew(false);
      setEditingAddress(null);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save address",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteUserAddressApi({ addressId });
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Addresses</h1>
        </div>

        {/* add address diualog */}
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, pincode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingAddress(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Address</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses?.map((address) => (
          <Card key={address._id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-gray-600">PIN: {address.pincode}</p>
                    {address.isDefault && (
                      <span className="text-xs text-green-600 mt-1 block">
                        Default Address
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address._id)}
                    disabled={address.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Address Dialog */}
      {editingAddress && (
        <Dialog
          open={!!editingAddress}
          onOpenChange={() => setEditingAddress(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-street">Street Address</Label>
                <Input
                  id="edit-street"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pincode">PIN Code</Label>
                <Input
                  id="edit-pincode"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, pincode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-isDefault">Set as default address</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAddress(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Address</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileAddress;
