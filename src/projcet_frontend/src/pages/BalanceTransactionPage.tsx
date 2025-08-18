import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Skeleton,
  List,
  Tag,
  message,
  Avatar,
  Statistic,
  Row,
  Col,
} from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  TrophyOutlined,
  TransactionOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  SwapOutlined
} from '@ant-design/icons';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
import { getProfilePictureUrl, getUserTransaction, getUserById } from '../controller/userController';
import dayjs from 'dayjs';
import { CashFlowHistory } from '../../../declarations/user/user.did';
import { getJobById } from '../controller/jobController';
import { Token } from '../interface/Token';
import { getBalanceController } from '../controller/tokenController';

const { Title, Text } = Typography;


const BalanceTransactionPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CashFlowHistory[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [jobNames, setJobNames] = useState<Record<string, string>>({});
  const [jobOwners, setJobOwners] = useState<Record<string, string>>({});
  const [jobAndOwnerInfo, setJobAndOwnerInfo] = useState<Record<string, { jobName: string; ownerName: string }>>({});
  const [loadingJobInfo, setLoadingJobInfo] = useState<Record<string, boolean>>({});
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Token>()

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      setLoadingWallet(true);
      setLoadingTransactions(true);
      
      if (user.profilePicture) {
        setProfileImage(getProfilePictureUrl(user.id, user.profilePicture));
      }
      
      try {
        // Fetch wallet data
        const walletData = await getBalanceController(user);
        setWallet(walletData as Token);
        setLoadingWallet(false);
        
        // Fetch transaction history
        const history = await getUserTransaction(user.id);
        setTransactions(history as CashFlowHistory[]);
      } catch (err) {
        console.error(err);
        message.error("Failed to load data");
        setLoadingWallet(false);
      } finally {
        setLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, [user]);

  const getJobInformation = async (jobId: string): Promise<{ jobName: string; ownerUsername: string }> => {
    if (jobNames[jobId] && jobOwners[jobId]) {
      return { jobName: jobNames[jobId], ownerUsername: jobOwners[jobId] };
    }

    try {
      const job = await getJobById(jobId);
      const jobName = job?.jobName ?? jobId;

      // Fetch job owner information
      let ownerUsername = 'Unknown';
      if (job?.userId) {
        console.log(`Fetching owner for job ${jobId} with userId ${job.userId}`);
        const owner = await getUserById(job.userId);
        console.log(`Fetched owner for job ${jobId}:`, owner);
        ownerUsername = owner?.username ?? 'Unknown';
      }

      setJobNames((prev) => ({ ...prev, [jobId]: jobName }));
      setJobOwners((prev) => ({ ...prev, [jobId]: ownerUsername }));

      return { jobName, ownerUsername };
    } catch (err) {
      console.error(`Failed to fetch job ${jobId}`, err);
      return { jobName: jobId, ownerUsername: 'Unknown' };
    }
  };

  // Function to get job and owner information when sender is a job ID
  const getJobAndOwnerInfo = async (jobId: string): Promise<{ jobName: string; ownerName: string }> => {
    // Set loading state
    setLoadingJobInfo(prev => ({ ...prev, [jobId]: true }));
    
    try {
      // First get the job by ID
      const job = await getJobById(jobId);
      if (!job) {
        return { jobName: 'Unknown Job', ownerName: 'Unknown Owner' };
      }
      
      // Then get the job owner using the job's userId
      const owner = await getUserById(job.userId);
      const ownerName = owner?.username ?? 'Unknown Owner';
      
      return {
        jobName: job.jobName,
        ownerName
      };
    } catch (err) {
      console.error(`Failed to fetch job and owner info for ${jobId}`, err);
      return { jobName: 'Unknown Job', ownerName: 'Unknown Owner' };
    } finally {
      // Clear loading state
      setLoadingJobInfo(prev => ({ ...prev, [jobId]: false }));
    }
  };



  // Calculate balance stats
  const totalIncome = transactions.reduce((sum, tx) => {
    // Income includes: top-ups and money received from others
    if ("topUp" in tx.transactionType) {
      return sum + tx.amount;
    }
    // Money received from others (user is in toId array and not the sender)
    if (tx.fromId !== user?.id) {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  const totalExpenses = transactions.reduce((sum, tx) => {
    // Expenses include: transfers to jobs and money sent to others
    if ("transferToJob" in tx.transactionType) {
      return sum + tx.amount;
    }
    // Money sent to others (user is the sender)
    if (tx.fromId === user?.id && !("topUp" in tx.transactionType)) {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  const currentBalance = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Skeleton.Avatar active size={120} />
            <Skeleton active paragraph={{ rows: 8 }} />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <WalletOutlined className="text-6xl text-primary mb-4" />
            <Title level={2} className="text-foreground">Please log in to view your wallet</Title>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header with Profile */}
          <motion.div
            className="text-center mb-12"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block mb-6"
            >
              <Avatar
                size={120}
                src={profileImage}
                icon={<WalletOutlined />}
                className="shadow-lg border-4 border-primary/20"
              />
            </motion.div>
            <Title level={1} className="text-foreground mb-2">
              Digital Wallet
            </Title>
            <Text className="text-muted-foreground text-lg">Manage your finances with ease</Text>
          </motion.div>

          {/* Balance Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={8}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="text-center shadow-sm border border-border hover:shadow-md transition-shadow"
                  bodyStyle={{ padding: '2rem' }}
                >
                  <DollarOutlined
                    className="text-5xl text-primary mb-4"
                  />
                  {loadingWallet ? (
                    <div>
                      <div className="text-muted-foreground text-sm mb-2">Current Balance</div>
                      <Skeleton.Input active size="large" style={{ width: 120, height: 32 }} />
                    </div>
                  ) : (
                    <Statistic
                      title={<span className="text-muted-foreground">Current Balance</span>}
                      value={wallet?.token_value.toFixed(2) || '0.00'}
                      suffix={wallet?.token_symbol || 'ICP'}
                      valueStyle={{
                        color: '#16a34a',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={8}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="text-center shadow-sm border border-border hover:shadow-md transition-shadow"
                  bodyStyle={{ padding: '2rem' }}
                >
                  <ArrowUpOutlined
                    className="text-5xl text-green-600 mb-4"
                  />
                  {loadingTransactions ? (
                    <div>
                      <div className="text-muted-foreground text-sm mb-2">Total Income</div>
                      <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                    </div>
                  ) : (
                    <Statistic
                      title={<span className="text-muted-foreground">Total Income</span>}
                      value={totalIncome.toFixed(2)}
                      suffix={wallet?.token_symbol || 'ICP'}
                      valueStyle={{
                        color: '#16a34a',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={8}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="text-center shadow-sm border border-border hover:shadow-md transition-shadow"
                  bodyStyle={{ padding: '2rem' }}
                >
                  <ArrowDownOutlined
                    className="text-5xl text-red-600 mb-4"
                  />
                  {loadingTransactions ? (
                    <div>
                      <div className="text-muted-foreground text-sm mb-2">Total Expenses</div>
                      <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                    </div>
                  ) : (
                    <Statistic
                      title={<span className="text-muted-foreground">Total Expenses</span>}
                      value={totalExpenses.toFixed(2)}
                      suffix={wallet?.token_symbol || 'ICP'}
                      valueStyle={{
                        color: '#dc2626',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              title={
                <div className="flex items-center gap-3">
                  <TransactionOutlined className="text-xl text-primary" />
                  <span className="text-foreground text-xl font-semibold">Transaction History</span>
                </div>
              }
              className="shadow-sm border border-border"
              bodyStyle={{ padding: '0' }}
            >
              <List
                loading={loadingTransactions}
                dataSource={transactions}
                locale={{ emptyText: "No transactions yet." }}
                renderItem={(item, index) => {
                  let sign = "+";
                  let color: "red" | "green" | "blue" = "green";
                  let description = "";
                  let icon = <PlusCircleOutlined />;

                  if ("topUp" in item.transactionType) {
                    description = "Account Top Up";
                    sign = "+";
                    color = "green";
                    icon = <PlusCircleOutlined />;
                  } else if ("transferToJob" in item.transactionType) {
                    const jobId = item.toId?.[0];
                    if (jobId) {
                      getJobInformation(jobId);
                      description = `Transfer to Job ${jobNames[jobId] ?? jobId}`;
                    } else {
                      description = "Transfer to Job (Unknown)";
                    }
                    sign = "-";
                    color = "red";
                    icon = <SwapOutlined />;
                  } else {
                    const isOutgoing = item.fromId === user.id;
                    sign = isOutgoing ? "-" : "+";
                    color = isOutgoing ? "red" : "green";

                    if (isOutgoing) {
                      description = `Sent to ${item.toId.join(", ")}`;
                    } else {
                      // For incoming transactions, the sender ID is actually a job ID
                      const jobId = item.fromId;
                      if (jobAndOwnerInfo[jobId]) {
                        const { jobName, ownerName } = jobAndOwnerInfo[jobId];
                        description = `Payment from "${jobName}" by ${ownerName}`;
                      } else if (loadingJobInfo[jobId]) {
                        description = "Loading job information...";
                      } else {
                        // Fetch job and owner information
                        getJobAndOwnerInfo(jobId).then(({ jobName, ownerName }) => {
                          setJobAndOwnerInfo(prev => ({ ...prev, [jobId]: { jobName, ownerName } }));
                        });
                        description = `Payment received from job ${jobId}`;
                      }
                    }

                    icon = isOutgoing ? <MinusCircleOutlined /> : <PlusCircleOutlined />;
                  }

                  return (
                    <motion.div
                      key={`${item.transactionAt}-${index}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      onHoverStart={() => setHoveredItem(`${item.transactionAt}-${index}`)}
                      onHoverEnd={() => setHoveredItem(null)}
                    >
                      <List.Item style={{ padding: 0 }}>
                        <Card
                          className="w-full m-2 shadow-sm border border-border hover:shadow-md transition-all duration-300"
                          style={{
                            transform: hoveredItem === `${item.transactionAt}-${index}` ? 'translateY(-2px)' : 'none'
                          }}
                          bodyStyle={{ padding: '1.5rem' }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                className={`p-3 rounded-full ${color === 'green' ? 'bg-green-100 text-green-600' :
                                    color === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                  }`}
                              >
                                {React.cloneElement(icon, {
                                  className: 'text-xl'
                                })}
                              </motion.div>
                              <div>
                                {loadingJobInfo[item.fromId] && !("topUp" in item.transactionType) && !("transferToJob" in item.transactionType) && item.fromId !== user.id ? (
                                  <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: 200, height: 20 }}
                                    className="mb-1"
                                  />
                                ) : (
                                  <Text className="text-foreground font-semibold text-lg block">
                                    {description}
                                  </Text>
                                )}
                                <Text className="text-muted-foreground">
                                  {dayjs(Number(item.transactionAt) / 1_000_000).format("MMMM DD, YYYY • HH:mm")}
                                </Text>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Tag
                                color={color}
                                className={`text-lg px-4 py-2 rounded-lg font-semibold border-0 ${color === 'green' ? 'bg-green-100 text-green-700' :
                                    color === 'red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                  }`}
                              >
                                {`${sign}${item.amount} ${wallet?.token_symbol}`}
                              </Tag>
                            </motion.div>
                          </div>
                        </Card>
                      </List.Item>
                    </motion.div>
                  );
                }}
              />
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BalanceTransactionPage;