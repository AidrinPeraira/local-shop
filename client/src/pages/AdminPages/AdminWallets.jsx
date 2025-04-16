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
import { getAdminWalletTransactionsApi } from "../../api/walletApi";
import { useNavigate } from "react-router-dom";

const transactionTypes = [
  "ALL",
  "ORDER_PAYMENT",
  "REFUND",
  "REFERRAL_REWARD",
  "PROMO_CREDIT",
];

export default function AdminWallets() {
  const [transactions, setTransactions] = useState([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const { toast } = useToast();
  const [appliedType, setAppliedType] = useState("ALL");
  const [appliedSort, setAppliedSort] = useState("desc");
  const [appliedSearch, setAppliedSearch] = useState("");
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        type: appliedType,
        sort: appliedSort,
        search: appliedSearch,
      };

      const { data } = await getAdminWalletTransactionsApi(params);

      if (data.success) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
        setStatistics(data.statistics);
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

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, appliedType, appliedSort, appliedSearch]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedType(selectedType);
    setAppliedSort(sortBy);
    setAppliedSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedType("ALL");
    setSortBy("desc");
    setSearchQuery("");
    setCurrentPage(1);
    setAppliedType("ALL");
    setAppliedSort("desc");
    setAppliedSearch("");
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      ORDER_PAYMENT: "bg-blue-500",
      REFUND: "bg-orange-500",
      REFERRAL_REWARD: "bg-green-500",
      PROMO_CREDIT: "bg-purple-500",
    };

    return (
      <Badge className={`${typeColors[type] || "bg-gray-500"}`}>{type}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wallet Transactions</h1>
      </div>

      {/* Statistics */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Total Transactions
            </h3>
            <div className="text-2xl font-bold">
              {statistics?.totalTransactions || 0}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
            <div className="flex items-center text-2xl font-bold">
              <IndianRupee className="h-6 w-6 mr-1" />
              {statistics?.totalAmount || 0}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Order Payments
            </h3>
            <div className="text-2xl font-bold">
              {statistics?.breakdown?.ORDER_PAYMENT || 0}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Refunds</h3>
            <div className="text-2xl font-bold">
              {statistics?.breakdown?.REFUND || 0}
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
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
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Balance</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{transaction.transactionId}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">
                        {transaction.user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{getTypeBadge(transaction.type)}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {transaction.amount}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {transaction.balance}
                    </div>
                  </td>
                  <td className="p-3">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">{transaction.description}</td>
                  <td className="p-3">
                    {transaction.customOrderId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/admin/orders?search=${transaction.customOrderId}`
                          )
                        }
                      >
                        View Order
                      </Button>
                    )}
                  </td>
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
