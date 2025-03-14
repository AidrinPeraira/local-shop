
import React, { useState } from "react";
import { Container } from "../../components/ui/container";
import UserProfileSection from "../../components/profile/UserProfileSection";
import OrdersSection from "../../components/profile/OrdersSection";
import AddressSection from "../../components/profile/AddressSection";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { ProfileSidebar } from "../../components/profile/ProfileSidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// Mock user data - in a real app this would come from your auth/API system
const mockUser = {
  id: "user_123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  profileImage: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6E59A5&color=fff",
  addresses: [
    {
      id: "addr_1",
      type: "Home",
      street: "123 Main Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94105",
      isDefault: true,
    },
    {
      id: "addr_2",
      type: "Work",
      street: "456 Market Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94103",
      isDefault: false,
    }
  ]
};

// Mock orders data
const mockOrders = [
  {
    id: "ORD12345",
    date: "2023-11-15",
    status: "Delivered",
    total: 129.99,
    items: [
      { id: "1", name: "Premium Cargo Pants", quantity: 1, price: 79.99 },
      { id: "2", name: "Classic T-Shirt", quantity: 2, price: 24.99 }
    ]
  },
  {
    id: "ORD12346",
    date: "2023-12-01",
    status: "Processing",
    total: 159.95,
    items: [
      { id: "3", name: "Winter Jacket", quantity: 1, price: 159.95 }
    ],
    canCancel: true
  },
  {
    id: "ORD12347",
    date: "2023-12-10",
    status: "Shipped",
    total: 89.97,
    items: [
      { id: "4", name: "Hiking Boots", quantity: 1, price: 89.97 }
    ],
    trackingNumber: "TRK9876543",
    canCancel: true
  }
];

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState(mockUser);
  const [orders, setOrders] = useState(mockOrders);
  const [addresses, setAddresses] = useState(mockUser.addresses);

  // Update user profile handler
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  // Cancel order handler
  const handleCancelOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "Cancelled", canCancel: false } 
        : order
    ));
  };

  // Handlers for addresses
  const handleAddAddress = (newAddress) => {
    // If new address is set as default, update other addresses
    if (newAddress.isDefault) {
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: false
      })));
    }
    setAddresses([...addresses, newAddress]);
  };

  const handleUpdateAddress = (updatedAddress) => {
    // If updated address is set as default, update other addresses
    let updatedAddresses = [...addresses];
    if (updatedAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === updatedAddress.id ? true : false
      }));
    } else {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id === updatedAddress.id ? updatedAddress : addr
      );
    }
    setAddresses(updatedAddresses);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  // Render active section content
  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <UserProfileSection 
            user={user} 
            onUpdateProfile={handleUpdateProfile} 
          />
        );
      case "orders":
        return (
          <OrdersSection 
            orders={orders} 
            onCancelOrder={handleCancelOrder} 
          />
        );
      case "addresses":
        return (
          <AddressSection 
            addresses={addresses} 
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        );
      default:
        return (
          <UserProfileSection 
            user={user} 
            onUpdateProfile={handleUpdateProfile} 
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex-grow flex w-full">
          <ProfileSidebar 
            activeSection={activeSection} 
            onChangeSection={setActiveSection} 
            user={user}
          />
          
          <main className="flex-grow p-6">
            <Container>
              <div className="flex items-center mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">
                    {activeSection === "profile" && "My Profile"}
                    {activeSection === "orders" && "My Orders"}
                    {activeSection === "addresses" && "My Addresses"}
                  </h1>
                </div>
                <div className="flex-shrink-0">
                  <SidebarTrigger />
                </div>
              </div>
              
              {renderActiveSection()}
            </Container>
          </main>
        </div>
      </SidebarProvider>
      
      <Footer />
    </div>
  );
};

export default UserProfile;