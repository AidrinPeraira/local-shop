
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MapPin, Plus, Edit, Trash2, Check } from "lucide-react";
import { AddressForm } from "../../components/profile/AddressForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { toast } from "../hooks/use-toast";
import { Badge } from "../../components/ui/badge";


const AddressSection= ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const handleAddAddress = (address) => {
    onAddAddress({
      ...address,
      id: `addr_${Date.now()}` // Generate a temporary ID, your backend would assign a real one
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been saved successfully."
    });
  };
  
  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateAddress = (address) => {
    onUpdateAddress(address);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Address Updated",
      description: "Your address has been updated successfully."
    });
  };
  
  const handleDeleteClick = (address) => {
    setSelectedAddress(address);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedAddress) {
      onDeleteAddress(selectedAddress.id);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Address Deleted",
        description: "Your address has been deleted successfully."
      });
    }
  };
  
  const handleSetDefault = (address) => {
    if (!address.isDefault) {
      onUpdateAddress({
        ...address,
        isDefault: true
      });
      
      toast({
        title: "Default Address Updated",
        description: `${address.type} address is now your default address.`
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          <h2 className="text-2xl font-semibold">My Addresses</h2>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>
      
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You haven't added any addresses yet.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              variant="outline"
              className="mt-4"
            >
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    {address.type}
                    {address.isDefault && (
                      <Badge className="ml-2 bg-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="space-y-1">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                    className="h-8 gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  
                  {addresses.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(address)}
                      className="h-8 gap-1 text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  )}
                </div>
                
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address)}
                    className="h-8 text-sm"
                  >
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => setIsAddDialogOpen(open)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Add a new shipping or billing address to your account.
            </DialogDescription>
          </DialogHeader>
          
          <AddressForm 
            onSubmit={handleAddAddress}
            isDefault={addresses.length === 0}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => setIsEditDialogOpen(open)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update your address information.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAddress && (
            <AddressForm 
              address={selectedAddress}
              onSubmit={handleUpdateAddress}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => setIsDeleteDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAddress && (
            <div className="p-3 bg-gray-100 rounded-md mb-4">
              <p className="font-medium">{selectedAddress.type} Address:</p>
              <p>{selectedAddress.street}</p>
              <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressSection;