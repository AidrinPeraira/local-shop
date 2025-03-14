import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { toast } from "../hooks/use-toast";
import OtpVerificationDialog from "../../components/auth/OtpVerificationDialog";



export const EditProfile= ({
  user,
  isOpen,
  onClose,
  onUpdateProfile
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  
  const [originalEmail, setOriginalEmail] = useState(user.email);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
      setOriginalEmail(user.email);
      setIsEmailChanged(false);
    }
  }, [isOpen, user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check if email is changed
    if (name === "email" && value !== originalEmail) {
      setIsEmailChanged(true);
    } else if (name === "email" && value === originalEmail) {
      setIsEmailChanged(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // If email is changed, require OTP verification
    if (isEmailChanged) {
      setIsOtpDialogOpen(true);
      return;
    }
    
    // Otherwise just update the profile
    completeProfileUpdate();
  };
  
  const completeProfileUpdate = () => {
    // In a real app, you would submit to your backend here
    setTimeout(() => {
      onUpdateProfile({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      
      setIsSubmitting(false);
      onClose();
    }, 500);
  };
  
  const handleOtpVerificationSuccess = () => {
    setIsOtpDialogOpen(false);
    completeProfileUpdate();
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {isEmailChanged && (
                <p className="text-sm text-amber-600">
                  Changing your email will require verification.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* OTP Verification Dialog */}
      <OtpVerificationDialog
        isOpen={isOtpDialogOpen}
        onClose={() => {
          setIsOtpDialogOpen(false);
          setIsSubmitting(false);
        }}
        email={formData.email}
        onVerificationSuccess={handleOtpVerificationSuccess}
      />
    </>
  );
};