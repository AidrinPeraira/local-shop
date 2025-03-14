
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { MapPin, Package, User, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";



export const ProfileSidebar = ({
  activeSection,
  onChangeSection,
  user
}) => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center p-4 pt-6">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold mt-2">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "profile"}
                  onClick={() => onChangeSection("profile")}
                  tooltip="Profile"
                >
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "orders"}
                  onClick={() => onChangeSection("orders")}
                  tooltip="Orders"
                >
                  <Package />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "addresses"}
                  onClick={() => onChangeSection("addresses")}
                  tooltip="Addresses"
                >
                  <MapPin />
                  <span>Addresses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <SidebarMenuButton 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              // This would normally navigate to logout or trigger auth logout
              console.log("Logout clicked");
            }}
            tooltip="Logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
