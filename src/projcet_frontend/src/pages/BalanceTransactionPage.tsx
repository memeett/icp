import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Skeleton,
  List,
  Tag,
  message,
} from 'antd';
import { motion } from 'framer-motion';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
import { getProfilePictureUrl, getUserTransaction } from '../controller/userController';
import dayjs from 'dayjs';
import { CashFlowHistory } from '../../../declarations/user/user.did';

const { Title, Text } = Typography;

const BalanceTransactionPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CashFlowHistory[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      if (user.profilePicture) {
        setProfileImage(getProfilePictureUrl(user.id, user.profilePicture));
      }
      try {
        setLoadingTransactions(true);
        const history = await getUserTransaction(user.id);
        setTransactions(history as CashFlowHistory[]);
      } catch (err) {
        console.error(err);
        message.error("Failed to load transactions");
      } finally {
        setLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Title level={2}>Please log in to view your profile.</Title>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2}>Balance & Transactions</Title>


          {/* Transaction History */}
          <Card title="Transaction History" className="shadow-md rounded-xl">
            <List
              loading={loadingTransactions}
              dataSource={transactions}
              locale={{ emptyText: "No transactions yet." }}
              renderItem={(item) => {
                let sign = "+";
                let color: "red" | "green" = "green";
                let description = "";

                if ("topUp" in item.transactionType) {
                  description = "Top Up";
                  sign = "+";
                  color = "green";
                } else if ("transferToJob" in item.transactionType) {
                  description = `Transfer to Job ${item.toId.length > 0 ? item.toId[0] : ""}`;
                  sign = "-";
                  color = "red";
                } else {
                  const isOutgoing = item.fromId === user.id;
                  sign = isOutgoing ? "-" : "+";
                  color = isOutgoing ? "red" : "green";
                  description = isOutgoing
                    ? `Sent to ${item.toId.join(", ")}`
                    : `Received from ${item.fromId}`;
                }

                return (
                  <List.Item>
                    <Card className="w-full shadow-sm rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <Text type="secondary">
                          {dayjs(Number(item.transactionAt) / 1_000_000).format("YYYY-MM-DD HH:mm")}
                        </Text>
                        <Tag color={color} className="text-lg px-4 py-1 rounded-lg">
                          {`${sign}${item.amount}`} ICP
                        </Tag>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {description}
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BalanceTransactionPage;
