import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Search,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  TicketCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useToast } from "../../components/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { format } from "date-fns";
import CouponForm from "../../components/admin/CouponForm";
import {
  adminGetCouponsApi,
  adminCreateCouponApi,
  adminUpdateCouponApi,
  adminDeleteCouponApi,
} from "../../api/couponApi";

const AdminCoupons = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [coupons, setCoupons] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const { toast } = useToast();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [appliedStatus, setAppliedStatus] = useState("All");
  const [appliedSort, setAppliedSort] = useState("latest");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage", // or 'fixed'
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    validFrom: "",
    validUntil: "",
    usageLimit: 100,
    description: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        status: appliedStatus,
        sort: appliedSort,
        search: appliedSearch,
      };

      const response = await adminGetCouponsApi(params);
      if (response.data.success) {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, appliedStatus, appliedSort, appliedSearch]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedStatus(selectedStatus);
    setAppliedSort(sortBy);
    setAppliedSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedStatus("All");
    setSortBy("latest");
    setSearchQuery("");
    setCurrentPage(1);
    setAppliedStatus("All");
    setAppliedSort("latest");
    setAppliedSearch("");
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await adminCreateCouponApi(couponForm);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        setIsAddDialogOpen(false);
        setCouponForm({
          code: "",
          discountType: "fixed",
          discountValue: "",
          minPurchase: "",
          maxDiscount: "",
          validFrom: "",
          validUntil: "",
          usageLimit: "",
        });
        fetchCoupons();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add coupon",
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await adminUpdateCouponApi({
        id: selectedCoupon._id,
        ...couponForm,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        setIsEditDialogOpen(false);
        setSelectedCoupon(null);
        fetchCoupons();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update coupon",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      const response = await adminDeleteCouponApi(selectedCoupon._id);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        setIsDeleteDialogOpen(false);
        setSelectedCoupon(null);
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error deleting coupon:", error); // Log the error for debugging purpo
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coupons</h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm
              onSubmit={handleAddCoupon}
              couponForm={couponForm}
              setCouponForm={setCouponForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          {/* Status Filter */}
          <div>
            <h2 className="font-semibold mb-2">Coupon Status</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedStatus}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {["All", "Active", "Expired"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort By */}
          <div>
            <h2 className="font-semibold mb-2">Sort By</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {sortBy === "latest"
                    ? "Latest First"
                    : sortBy === "az"
                    ? "A-Z"
                    : "Z-A"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("latest")}>
                  Latest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("az")}>
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("za")}>
                  Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div>
            <h2 className="font-semibold mb-2">Search Coupons</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by coupon code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex flex-row-reverse justify-between mt-4 border-t pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Clear Filters
            </Button>
            <Button onClick={handleApplyFilters} disabled={loading}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Discount</th>
                <th className="text-left p-3">Valid Until</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Usage</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{coupon.code}</td>
                  <td className="p-3">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </td>
                  <td className="p-3">
                    {format(new Date(coupon.validUntil), "dd/MM/yyyy")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        coupon.isActive &&
                        new Date(coupon.validUntil) > new Date()
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {!coupon.isActive
                        ? "Inactive"
                        : new Date(coupon.validUntil) > new Date()
                        ? "Active"
                        : "Expired"}
                    </span>
                  </td>
                  <td className="p-3">
                    {coupon.usedCount}/{coupon.usageLimit}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setCouponForm(coupon);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Coupon</DialogTitle>
                        </DialogHeader>
                        <CouponForm
                          onSubmit={handleEditCoupon}
                          initialData={coupon}
                          couponForm={couponForm}
                          setCouponForm={setCouponForm}
                        />
                      </DialogContent>
                    </Dialog>

                    {!coupon.isActive ? (
                      <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-100 hover:bg-green-200 text-green-700"
                      onClick={() => {
                        setSelectedCoupon(coupon);
                        handleDeleteCoupon()
                      }}
                    >
                      <TicketCheck className="h-4 w-4" />
                    </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the coupon "{selectedCoupon?.code}
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoupons;
