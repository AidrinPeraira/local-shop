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
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  IndianRupee,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { getAllTransactionsApi, getAdminBalanceApi } from "../../api/transactionApi";

const transactionTypes = ["ALL", "ORDER_PAYMENT", "SELLER_PAYOUT", "REFUND"];
const transactionStatuses = ["ALL", "PENDING", "PROCESSING", "COMPLETED", "FAILED"];

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [appliedType, setAppliedType] = useState("ALL");
  const [appliedStatus, setAppliedStatus] = useState("ALL");
  const [appliedSort, setAppliedSort] = useState("desc");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [balanceData, setBalanceData] = useState(null);
  

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        type: appliedType,
        status: appliedStatus,
        sort: appliedSort,
        search: appliedSearch
      };

      const { data } = await getAllTransactionsApi(params);
      
      if (data.success) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const fetchBalance = async () => {
    try {
      const { data } = await getAdminBalanceApi();
      if (data.success) {
        setBalanceData(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch balance",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, [currentPage, appliedType, appliedStatus, appliedSort, appliedSearch]);
  
  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedType(selectedType);
    setAppliedStatus(selectedStatus);
    setAppliedSort(sortBy);
    setAppliedSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedType("ALL");
    setSelectedStatus("ALL");
    setSortBy("desc");
    setSearchQuery("");
    setCurrentPage(1);
    setAppliedType("ALL");
    setAppliedStatus("ALL");
    setAppliedSort("desc");
    setAppliedSearch("");
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-500",
      PROCESSING: "bg-blue-500",
      COMPLETED: "bg-green-500",
      FAILED: "bg-red-500",
    };

    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  

  const getTypeBadge = (type) => {
    const typeColors = {
      ORDER_PAYMENT: "bg-blue-500",
      SELLER_PAYOUT: "bg-purple-500",
      REFUND: "bg-orange-500",
    };

    return (
      <Badge className={`${typeColors[type] || "bg-gray-500"}`}>
        {type}
      </Badge>
    );
  };

 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      {/* blanace card info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
            <div className="flex items-center text-2xl font-bold text-green-600">
              <IndianRupee className="h-6 w-6 mr-1" />
              {balanceData?.currentBalance || 0}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Platform Fees</h3>
            <div className="flex items-center text-2xl font-bold text-blue-600">
              <IndianRupee className="h-6 w-6 mr-1" />
              {balanceData?.totalPlatformFees || 0}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Total Payouts</h3>
            <div className="flex items-center text-2xl font-bold text-purple-600">
              <IndianRupee className="h-6 w-6 mr-1" />
              {balanceData?.breakdown?.sellerPayouts || 0}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Total Refunds</h3>
            <div className="flex items-center text-2xl font-bold text-orange-600">
              <IndianRupee className="h-6 w-6 mr-1" />
              {balanceData?.breakdown?.refunds || 0}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Platform Fees Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">From Buyers:</span>
              <div className="flex items-center text-lg font-semibold">
                <IndianRupee className="h-4 w-4 mr-1" />
                {balanceData?.breakdown?.platformFees?.fromBuyers || 0}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">From Sellers:</span>
              <div className="flex items-center text-lg font-semibold">
                <IndianRupee className="h-4 w-4 mr-1" />
                {balanceData?.breakdown?.platformFees?.fromSellers || 0}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-4 mb-4">
          {/* Transaction Type Filter */}
          <div>
            <h2 className="font-semibold mb-2">Transaction Type</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedType}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {transactionTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Filter */}
          <div>
            <h2 className="font-semibold mb-2">Status</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedStatus}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {transactionStatuses.map((status) => (
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
            <h2 className="font-semibold mb-2">Search Transactions</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by transaction ID..."
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

      {/* Transactions Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Transaction ID</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">From</th>
                <th className="text-left p-3">To</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{transaction.transactionId}</td>
                  <td className="p-3">{getTypeBadge(transaction.type)}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {transaction.amount}
                    </div>
                  </td>
                  <td className="p-3">
                    {transaction.from.type}: {transaction.from.entity}
                  </td>
                  <td className="p-3">
                    {transaction.to.type}: {transaction.to.entity}
                  </td>
                  <td className="p-3">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">{getStatusBadge(transaction.status)}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}