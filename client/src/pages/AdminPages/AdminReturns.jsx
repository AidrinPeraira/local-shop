import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import {
  getReturnRequestsApi,
  updateReturnRequestApi,
} from "../../api/returnApi";
import { format } from "date-fns";

const returnStatuses = [
  "ALL",
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED",
  "REFUND_COMPLETED",
  "CANCELLED",
];

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [expandedReturns, setExpandedReturns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [appliedStatus, setAppliedStatus] = useState("ALL");
  const [appliedSort, setAppliedSort] = useState("desc");
  const [appliedSearch, setAppliedSearch] = useState("");

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await getReturnRequestsApi(
        currentPage,
        6,
        appliedStatus === "ALL" ? "" : appliedStatus
      );
      setReturns(response.data.returns);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch return requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [currentPage, appliedStatus, appliedSort, appliedSearch]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedStatus(selectedStatus);
    setAppliedSort(sortBy);
    setAppliedSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedStatus("ALL");
    setSortBy("desc");
    setSearchQuery("");
    setCurrentPage(1);
    setAppliedStatus("ALL");
    setAppliedSort("desc");
    setAppliedSearch("");
  };

  const toggleAccordion = (returnId) => {
    setExpandedReturns((prev) =>
      prev.includes(returnId)
        ? prev.filter((id) => id !== returnId)
        : [...prev, returnId]
    );
  };

  const handleStatusUpdate = async (returnId, newStatus, comment = "") => {
    try {
      await updateReturnRequestApi(returnId, { status: newStatus, comment });
      toast({
        title: "Success",
        description: "Return request status updated successfully",
      });
      fetchReturns();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update return request status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      RETURN_REQUESTED: "bg-yellow-500",
      RETURN_APPROVED: "bg-green-500",
      RETURN_REJECTED: "bg-red-500",
      RETURN_SHIPPED: "bg-purple-500",
      RETURN_RECEIVED: "bg-blue-500",
      REFUND_INITIATED: "bg-orange-500",
      REFUND_COMPLETED: "bg-green-500",
      CANCELLED: "bg-gray-500",
    };

    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"}`}>
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Return Requests</h1>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          {/* Status Filter */}
          <div>
            <h2 className="font-semibold mb-2">Return Status</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedStatus.replace(/_/g, " ")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {returnStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status.replace(/_/g, " ")}
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
                  {sortBy === "desc" ? "Latest First" : "Oldest First"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("desc")}>
                  Latest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("asc")}>
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div>
            <h2 className="font-semibold mb-2">Search Returns</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by return ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
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
      </Card>

      {/* Returns Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 w-10"></th>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((returnRequest) => (
                <React.Fragment key={returnRequest._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8"
                        onClick={() => toggleAccordion(returnRequest._id)}
                      >
                        {expandedReturns.includes(returnRequest._id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </Button>
                    </td>
                    <td className="p-3">{returnRequest.orderId.orderId}</td>
                    <td className="p-3">{returnRequest.userId.username}</td>
                    <td className="p-3">
                      {new Date(returnRequest.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">₹{returnRequest.returnAmount}</td>
                    <td className="p-3">
                      {getStatusBadge(returnRequest.status)}
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={[
                              "REFUND_COMPLETED",
                              "CANCELLED",
                            ].includes(returnRequest.status)}
                          >
                            Update Status
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {returnStatuses
                            .filter(
                              (status) =>
                                status !== "ALL" &&
                                status !== returnRequest.status
                            )
                            .map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleStatusUpdate(returnRequest._id, status)
                                }
                              >
                                {status.replace(/_/g, " ")}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                  {expandedReturns.includes(returnRequest._id) && (
                    <tr>
                      <td colSpan="8" className="p-4 bg-gray-50">
                        <div className="space-y-4">
                          

                          <div>
                            <h3 className="font-semibold mb-2">
                              Return Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Return Reason:
                                </p>
                                <p>{returnRequest.items.returnReason}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Pickup Address
                            </h3>
                            <p>
                              {returnRequest.pickupAddress.street},{" "}
                              {returnRequest.pickupAddress.city},{" "}
                              {returnRequest.pickupAddress.state} -{" "}
                              {returnRequest.pickupAddress.pincode}
                            </p>
                            <p>Phone: {returnRequest.pickupAddress.phone}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Timeline</h3>
                            <div className="space-y-2">
                              {returnRequest.timeline.map((event, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span>
                                    {event.status.replace(/_/g, " ")}
                                    {event.comment && ` - ${event.comment}`}
                                  </span>
                                  <span className="text-gray-500">
                                    {new Date(
                                      event.timestamp
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminReturns;
