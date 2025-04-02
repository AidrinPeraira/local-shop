import React, { useEffect, useState } from 'react';
import { getWalletApi, getTransactionHistoryApi } from '../../api/walletApi';
import { format } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { PageLoading } from '../ui/PageLoading';

const ProfileWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, [page]);

  const fetchWalletData = async () => {
    try {
      const response = await getWalletApi();
      if (response.data.success) {
        setWallet(response.data.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch wallet data',
        variant: 'destructive',
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactionHistoryApi({ page, limit: 10 });
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    if (type === 'ORDER_PAYMENT') {
      return <ArrowUpRight className="h-5 w-5 text-red-600" />;
    }
    return <ArrowDownRight className="h-5 w-5 text-green-600" />;
  };

  if (loading && !wallet) {
    return <PageLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Wallet className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">My Wallet</h1>
      </div>

      {/* Wallet Balance Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Available Balance</span>
            <span className="text-3xl font-bold text-primary">
              ₹{wallet?.balance?.toFixed(2) || '0.00'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {loading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.transactionId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(transaction.createdAt), 'PPp')}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'ORDER_PAYMENT' 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {transaction.type === 'ORDER_PAYMENT' ? '-' : '+'}
                      ₹{Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileWallet;