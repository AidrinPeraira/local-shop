import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../hooks/use-toast';
import { PageLoading } from '../ui/PageLoading';
import { getUserProfileApi, updateUserProfileApi } from '../../api/userDataApi';
import { validateUserData } from '../../utils/validateData';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../redux/features/userSlice';

// In the props
const ProfileInfo = ({ onManageAddresses }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phone: '',
    currentPassword: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserProfileApi(user?._id);
      const userData = response.data.user;
      setUser(userData);
      setEditForm({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        currentPassword: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch user data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editForm.currentPassword) {
        toast({
          title: 'Validation Error',
          description: 'Please enter your current password to confirm changes',
          variant: 'destructive',
        });
        return;
      }

      // Validate form data
      const validationResult = validateUserData(
        editForm.username,
        editForm.email,
        editForm.phone,
        'Aa1@aaaa'
      );

      if (validationResult !== true) {
        toast({
          title: 'Validation Error',
          description: validationResult,
          variant: 'destructive',
        });
        return;
      }

      const response = await updateUserProfileApi(user._id, editForm);
      
      // Using dispatch from the top level
      dispatch(updateUserProfile({
        username: editForm.username,
        email: editForm.email,
        phone: editForm.phone,
      }));

      await fetchUserData();
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  // Add this helper function for date formatting
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Profile Information</h1>
      </div>

      <div className="grid gap-6">
        {/* Personal Information Card */}
        <Card>
          <CardContent className="p-6">

            {/* Dialog to edit */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Enter Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={editForm.currentPassword}
                        onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                  {user.emailVerified && (
                    <span className="text-xs text-green-600">Verified</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                  {user.phoneVerified && (
                    <span className="text-xs text-green-600">Verified</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Address Card */}
        <Card>
          <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Default Address</h2>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={onManageAddresses}
                      >
                        Manage Addresses
                      </Button>
                    </div>

            {user.defaultAddress ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">{user.defaultAddress.street}</p>
                  <p className="text-gray-600">
                    {user.defaultAddress.city}, {user.defaultAddress.state}
                  </p>
                  <p className="text-gray-600">PIN: {user.defaultAddress.pincode}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No default address set</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;