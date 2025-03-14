
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { EditProfile } from "../../components/profile/EditProfile";
import { ChangePassword } from "../../components/profile/ChangePassword";
import { Mail, Phone, User, KeyRound, Edit } from "lucide-react";




const UserProfileSection = ({ user, onUpdateProfile }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Personal Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex flex-wrap gap-3">
                <Button 
                  onClick={() => setIsEditProfileOpen(true)} 
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsChangePasswordOpen(true)} 
                  className="flex items-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <EditProfile 
        user={user}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Change Password Dialog */}
      <ChangePassword 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default UserProfileSection;
