import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown, Clock, ArrowDownAZ, ArrowUpAZ, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { useToast } from "../../components/hooks/use-toast";
import { getAllUsersApi, activateUserApi, deactivateUserApi } from "../../api/userDataApi";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

export default function AdminUsers() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = async (params) => {
    try {
      const res = await getAllUsersApi(params);
      setUsers(res.data.users || []); // Add fallback empty array
      setTotalPages(Math.ceil((res.data.total || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      setUsers([]); // Set empty array on error
      setTotalPages(1);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const page = params.get("page") || "1";
    const status = params.get("status") || "All";
    const sort = params.get("sort") || "latest";
    const search = params.get("search") || "";

    // Set initial states
    setCurrentPage(Number(page));
    setSelectedStatus(status);
    setSortBy(sort);
    setSearchQuery(search);

    // Add pagination parameters
    params.set("page", page);
    params.set("limit", ITEMS_PER_PAGE.toString());
    
    fetchUsers(params);
  }, []);

  // Update handlers to handle both state and URL params
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (selectedStatus !== "All") params.set("status", selectedStatus);
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "latest") params.set("sort", sortBy);
    params.set("page", currentPage);
    params.set("limit", ITEMS_PER_PAGE);
    setSearchParams(params);
    fetchUsers(params);
  };

  const clearFilters = () => {
    setSelectedStatus("All");
    setSearchQuery("");
    setSortBy("latest");
    setCurrentPage(1); 
    
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", ITEMS_PER_PAGE.toString());
    params.set("sort", "latest"); // Ensure default sorting
    setSearchParams(params);

    fetchUsers(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
    fetchUsers(params);
  };

  const handleDeactivateClick = (user) => {
    setSelectedUser(user);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    try {
      await deactivateUserApi(selectedUser._id);
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
      setIsDeactivateDialogOpen(false);
      setSelectedUser(null);
      // Refresh the user list
      fetchUsers(searchParams);
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async (userId) => {
    try {
      await activateUserApi(userId);
      toast({
        title: "Success",
        description: "User activated successfully",
      });
      // Refresh the user list
      fetchUsers(searchParams);
    } catch (error) {
      console.error("Failed to activate user:", error);
      toast({
        title: "Error",
        description: "Failed to activate user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const page = searchParams.get("page") || 1;
    setCurrentPage(Number(page));
    fetchUsers(searchParams);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Status Filter */}
        <Card className="p-2 col-span-3">
          <h2 className="font-semibold mb-2">Status</h2>
          <div className="flex gap-2 flex-wrap">
            {["All", "Active", "Inactive"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </Card>

        {/* Sort By */}
        <Card className="p-4 col-span-3">
          <h2 className="font-semibold mb-2">Sort By</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {sortBy === "latest" && (
                  <>
                    Latest <Clock className="ml-2 h-4 w-4" />
                  </>
                )}
                {sortBy === "az" && (
                  <>
                    A-Z <ArrowDownAZ className="ml-2 h-4 w-4" />
                  </>
                )}
                {sortBy === "za" && (
                  <>
                    Z-A <ArrowUpAZ className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("latest")}>
                <Clock className="mr-2 h-4 w-4" /> Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("az")}>
                <ArrowDownAZ className="mr-2 h-4 w-4" /> A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("za")}>
                <ArrowUpAZ className="mr-2 h-4 w-4" /> Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>

        {/* Search */}
        <Card className="p-4 col-span-4">
          <h2 className="font-semibold mb-2">Search</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>

        {/* Buttons */}
        <div className="col-span-2 flex gap-2 justify-end">
          <Button variant="outline" onClick={clearFilters} className="w-24">
            Clear
          </Button>
          <Button onClick={applyFilters} className="w-24">
            Apply
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users ? (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">#{index + 1}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {user.isActive ? (
                        <Button
                          onClick={() => handleDeactivateClick(user)}
                          variant="outline"
                          className="bg-green-50 text-red-600 hover:bg-red-100"
                        >
                          Deactivate User
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivate(user._id)}
                          variant="outline"
                          className="bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          Activate User
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
        <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      <Dialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {selectedUser?.username}? This
              action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeactivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivateConfirm}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
