import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import {
  Card,
  Badge,
  Typography,
  Skeleton,
  List,
  Tag,
  message,
  Avatar,
  Statistic,
  Row,
  Col,
  DatePicker,
  Space,
  Tabs,
  Modal,
  Input,
  Button,
  Form,
  InputNumber,
  Alert,
  Tooltip,
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
  SwapOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
import { getProfilePictureUrl, getUserTransaction, getUserById } from '../controller/userController';
import dayjs from 'dayjs';
import { CashFlowHistory } from '../../../declarations/user/user.did';
import { getJobById } from '../controller/jobController';
import { Token } from '../interface/Token';
import { getBalanceController, topUpWalletController } from '../controller/tokenController';

const { Title, Text } = Typography;

// Top-up Modal Component
const TopUpModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => Promise<void>;
  tokenSymbol?: string;
  loading: boolean;
}> = ({ visible, onClose, onTopUp, tokenSymbol = 'ICP', loading }) => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState<number | null>(null);
  const [topUpLoading, setTopUpLoading] = useState(false);

  // Predefined amounts for quick selection
  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleTopUp = async () => {
    try {
      const values = await form.validateFields();
      setTopUpLoading(true);
      await onTopUp(values.amount);
      message.success(`Successfully topped up ${values.amount} ${tokenSymbol}!`);
      form.resetFields();
      setAmount(null);
      onClose();
    } catch (error) {
      console.error('Top-up error:', error);
      message.error('Top-up failed. Please try again.');
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
    form.setFieldsValue({ amount: quickAmount });
  };

  const handleCancel = () => {
    form.resetFields();
    setAmount(null);
    onClose();
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={520}
      centered
      className="top-up-modal"
      bodyStyle={{ padding: 0 }}
      maskStyle={{ backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-t-lg">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CreditCardOutlined className="text-3xl text-primary" />
              </div>
            </motion.div>
            <Title level={3} className="text-foreground mb-2">
              Top Up Your Wallet
            </Title>
            <Text className="text-muted-foreground">
              Add funds to your digital wallet instantly
            </Text>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <Form form={form} layout="vertical" onFinish={handleTopUp}>
            {/* Quick Amount Selection */}
            <div className="mb-6">
              <Text className="text-foreground font-medium mb-3 block">
                Quick Select Amount
              </Text>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <motion.div
                    key={quickAmount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type={amount === quickAmount ? "primary" : "default"}
                      className={`h-12 w-full font-medium ${amount === quickAmount
                          ? 'bg-primary border-primary'
                          : 'hover:border-primary hover:text-primary'
                        }`}
                      onClick={() => handleQuickAmount(quickAmount)}
                    >
                      {quickAmount} {tokenSymbol}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <Form.Item
              label={
                <span className="text-foreground font-medium">
                  Custom Amount ({tokenSymbol})
                </span>
              }
              name="amount"
              rules={[
                { required: true, message: 'Please enter an amount' },
                { type: 'number', min: 1, message: 'Amount must be at least 1' },
                { type: 'number', max: 10000, message: 'Maximum amount is 10,000' },
              ]}
            >
              <InputNumber
                size="large"
                className="w-full"
                placeholder="Enter amount"
                prefix={<DollarOutlined className="text-muted-foreground" />}
                suffix={tokenSymbol}
                min={1}
                max={10000}
                precision={2}
                value={amount}
                onChange={setAmount}
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </Form.Item>

            {/* Info Alert */}
            <Alert
              icon={<InfoCircleOutlined />}
              message="Instant Processing"
              description="Your top-up will be processed immediately and reflected in your wallet balance."
              type="info"
              showIcon
              className="mb-6"
            />

            {/* Summary */}
            {amount && amount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="bg-primary/5 border-primary/20">
                  <div className="flex justify-between items-center">
                    <Text className="text-foreground font-medium">
                      Amount to Add:
                    </Text>
                    <Text className="text-primary font-bold text-lg">
                      +{amount.toFixed(2)} {tokenSymbol}
                    </Text>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                size="large"
                onClick={handleCancel}
                disabled={topUpLoading || loading}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={topUpLoading || loading}
                  disabled={!amount || amount <= 0}
                  className="w-full h-12 font-medium"
                  icon={!topUpLoading && !loading ? <CheckCircleOutlined /> : undefined}
                >
                  {topUpLoading || loading ? 'Processing...' : `Top Up ${amount ? amount.toFixed(2) : '0'} ${tokenSymbol}`}
                </Button>
              </motion.div>
            </div>
          </Form>
        </div>
      </motion.div>
    </Modal>
  );
};

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
  const [wallet, setWallet] = useState<Token>();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(dayjs());
  const [chartPeriod, setChartPeriod] = useState<'3m' | '6m' | '1y' | 'all'>('6m');

  // Top-up modal state
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);

  const fetchWalletData = async () => {
    if (!user) return;

    setLoadingWallet(true);
    try {
      const walletData = await getBalanceController(user);
      setWallet(walletData as Token);
    } catch (err) {
      console.error('Failed to fetch wallet data:', err);
      message.error("Failed to load wallet data");
    } finally {
      setLoadingWallet(false);
    }
  };


  // Generate chart data for balance progression
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) =>
      Number(a.transactionAt) - Number(b.transactionAt)
    );

    const now = dayjs();
    let startDate;

    switch (chartPeriod) {
      case '3m':
        startDate = now.subtract(3, 'months');
        break;
      case '6m':
        startDate = now.subtract(6, 'months');
        break;
      case '1y':
        startDate = now.subtract(1, 'year');
        break;
      default:
        startDate = sortedTransactions.length > 0
          ? dayjs(Number(sortedTransactions[0].transactionAt) / 1_000_000)
          : now.subtract(6, 'months');
    }

    // Group transactions by month and calculate cumulative balance
    const monthlyData = new Map<string, { income: number; expenses: number; balance: number; transactions: number }>();
    let cumulativeBalance = 0;

    // Initialize months with zero values
    let current = startDate.startOf('month');
    while (current.isBefore(now) || current.isSame(now, 'month')) {
      const monthKey = current.format('YYYY-MM');
      monthlyData.set(monthKey, { income: 0, expenses: 0, balance: 0, transactions: 0 });
      current = current.add(1, 'month');
    }

    // Process transactions
    sortedTransactions.forEach(tx => {
      const txDate = dayjs(Number(tx.transactionAt) / 1_000_000);
      const monthKey = txDate.format('YYYY-MM');

      if (txDate.isBefore(startDate)) {
        // Add to cumulative balance but don't include in chart
        if ("topUp" in tx.transactionType || tx.fromId !== user?.id) {
          cumulativeBalance += tx.amount;
        } else {
          cumulativeBalance -= tx.amount;
        }
        return;
      }

      const monthData = monthlyData.get(monthKey);
      if (monthData) {
        if ("topUp" in tx.transactionType || tx.fromId !== user?.id) {
          monthData.income += tx.amount;
          cumulativeBalance += tx.amount;
        } else {
          monthData.expenses += tx.amount;
          cumulativeBalance -= tx.amount;
        }
        monthData.balance = cumulativeBalance;
        monthData.transactions += 1;
      }
    });

    // Convert to chart format
    const chartArray: any[] = [];
    let runningBalance = cumulativeBalance - Array.from(monthlyData.values()).reduce((sum, data) => sum + data.income - data.expenses, 0);

    monthlyData.forEach((data, monthKey) => {
      runningBalance += data.income - data.expenses;
      chartArray.push({
        month: dayjs(monthKey).format('MMM YY'),
        fullMonth: dayjs(monthKey).format('MMMM YYYY'),
        balance: Math.max(0, runningBalance),
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
        transactions: data.transactions,
      });
    });

    return chartArray;
  }, [transactions, chartPeriod, user?.id]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoadingTransactions(true);
    try {
      const history = await getUserTransaction(user.id);
      setTransactions(history as CashFlowHistory[]);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      message.error("Failed to load transaction history");
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (user.profilePicture) {
        setProfileImage(getProfilePictureUrl(user.id, user.profilePicture));
      }

      await Promise.all([
        fetchWalletData(),
        fetchTransactions()
      ]);
    };

    fetchData();
  }, [user]);

  const getJobInformation = async (jobId: string): Promise<{ jobName: string; ownerUsername: string }> => {
    if (jobNames[jobId] && jobOwners[jobId]) {
      return { jobName: jobNames[jobId], ownerUsername: jobOwners[jobId] };
    }

    try {
      const job = await getJobById(jobId);
      const jobName = job?.jobName ?? jobId;

      let ownerUsername = 'Unknown';
      if (job?.userId) {
        const owner = await getUserById(job.userId);
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

  const getJobAndOwnerInfo = async (jobId: string): Promise<{ jobName: string; ownerName: string }> => {
    setLoadingJobInfo(prev => ({ ...prev, [jobId]: true }));

    try {
      const job = await getJobById(jobId);
      if (!job) {
        return { jobName: 'Unknown Job', ownerName: 'Unknown Owner' };
      }

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
      setLoadingJobInfo(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Handle top-up
  const handleTopUp = async (amount: number) => {
    if (!user?.id) {
      message.error('User not found');
      return;
    }

    setTopUpLoading(true);
    try {
      await topUpWalletController(user, amount);

      // Refresh wallet data and transactions after successful top-up
      await Promise.all([
        fetchWalletData(),
        fetchTransactions()
      ]);

      message.success(`Successfully topped up ${amount} ${wallet?.token_symbol || 'ICP'}!`);
    } catch (error) {
      console.error("Top-up failed:", error);
      message.error('Top-up failed. Please try again.');
      throw error; // Re-throw to let modal handle it
    } finally {
      setTopUpLoading(false);
    }
  };

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter(tx => {
    if (!selectedMonth) return true;
    const transactionDate = dayjs(Number(tx.transactionAt) / 1_000_000);
    return transactionDate.isSame(selectedMonth, 'month');
  });

  // Filter transactions by type
  const incomingTransactions = filteredTransactions.filter(tx => {
    if ("topUp" in tx.transactionType) return true;
    return tx.fromId !== user?.id;
  });

  const outgoingTransactions = filteredTransactions.filter(tx => {
    if ("transferToJob" in tx.transactionType) return true;
    return tx.fromId === user?.id && !("topUp" in tx.transactionType);
  });

  // Calculate balance stats from filtered transactions
  const totalIncome = filteredTransactions.reduce((sum, tx) => {
    if ("topUp" in tx.transactionType) {
      return sum + tx.amount;
    }
    if (tx.fromId !== user?.id) {
      return sum + tx.amount;
    }
    return sum;
  }, 0);



  const totalExpenses = filteredTransactions.reduce((sum, tx) => {
    if ("transferToJob" in tx.transactionType) {
      return sum + tx.amount;
    }
    if (tx.fromId === user?.id && !("topUp" in tx.transactionType)) {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  // Function to render transaction list
  const renderTransactionList = (transactionData: CashFlowHistory[], emptyMessage: string) => (
    <List
      loading={loadingTransactions}
      dataSource={transactionData}
      locale={{ emptyText: emptyMessage }}
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
          const isOutgoing = item.fromId === user?.id;
          sign = isOutgoing ? "-" : "+";
          color = isOutgoing ? "red" : "green";

          if (isOutgoing) {
            description = `Sent to ${item.toId.join(", ")}`;
          } else {
            const jobId = item.fromId;
            if (jobAndOwnerInfo[jobId]) {
              const { jobName, ownerName } = jobAndOwnerInfo[jobId];
              description = `Payment from "${jobName}" by ${ownerName}`;
            } else if (loadingJobInfo[jobId]) {
              description = "Loading job information...";
            } else {
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
                      {loadingJobInfo[item.fromId] && !("topUp" in item.transactionType) && !("transferToJob" in item.transactionType) && item.fromId !== user?.id ? (
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
  );

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
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Title level={1} className="text-foreground mb-2">
              Digital Wallet
            </Title>
            <Text className="text-muted-foreground text-lg">Manage your finances with ease</Text>
          </motion.div>

          {/* Top-up Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                icon={<CreditCardOutlined />}
                onClick={() => setTopUpModalVisible(true)}
                className="h-14 px-8 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  border: 'none'
                }}
              >
                Top Up Wallet
              </Button>
            </motion.div>
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

          {/* Enhanced Balance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                      {/* <WarningOutlined className="text-white text-lg" /> */}
                    </div>
                    <span className="text-foreground text-2xl font-bold">Balance Progress</span>
                  </div>

                </div>
              }
              className="shadow-xl border-2 border-border hover:border-primary/30 transition-all duration-300 rounded-2xl overflow-hidden"
              bodyStyle={{ padding: '2rem' }}
            >
              <div className="h-96">
                {loadingTransactions ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton.Input active style={{ width: '100%', height: '300px' }} />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1890ff" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#52c41a" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `${value} ${wallet?.token_symbol || 'ICP'}`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          padding: '16px'
                        }}
                        formatter={(value: any, name: string) => [
                          `${Number(value).toFixed(2)} ${wallet?.token_symbol || 'ICP'}`,
                          name === 'balance' ? 'Balance' :
                            name === 'income' ? 'Income' :
                              name === 'expenses' ? 'Expenses' : 'Net'
                        ]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#1890ff"
                        strokeWidth={3}
                        fill="url(#balanceGradient)"
                        name="Balance"
                        dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#1890ff', strokeWidth: 2, fill: 'white' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#52c41a"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Monthly Income"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ff4d4f"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Monthly Expenses"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
                    >
                      <LineChartOutlined className="text-3xl text-gray-400" />
                    </motion.div>
                    <Text className="text-muted-foreground text-lg">
                      No transaction data available for the selected period
                    </Text>
                    <Text className="text-muted-foreground">
                      Make your first transaction to see the balance chart
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              title={
                <div className="flex items-center gap-3">
                  <TransactionOutlined className="text-xl text-primary" />
                  <span className="text-foreground text-xl font-semibold">Transaction History</span>
                  <DatePicker
                    picker="month"
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    placeholder="Select month"
                    allowClear
                    className="w-44"
                  />
                </div>
              }
              className="shadow-sm border border-border"
              bodyStyle={{ padding: '0' }}
            >
              <Tabs
                defaultActiveKey="all"
                className="px-6"
                items={[
                  {
                    key: 'all',
                    label: `All Transactions (${filteredTransactions.length})`,
                    children: renderTransactionList(
                      filteredTransactions,
                      selectedMonth ? `No transactions found for ${selectedMonth.format('MMMM YYYY')}.` : "No transactions yet."
                    ),
                  },
                  {
                    key: 'incoming',
                    label: `Income (${incomingTransactions.length})`,
                    children: renderTransactionList(
                      incomingTransactions,
                      selectedMonth ? `No incoming transactions for ${selectedMonth.format('MMMM YYYY')}.` : "No incoming transactions yet."
                    ),
                  },
                  {
                    key: 'outgoing',
                    label: `Expenses (${outgoingTransactions.length})`,
                    children: renderTransactionList(
                      outgoingTransactions,
                      selectedMonth ? `No outgoing transactions for ${selectedMonth.format('MMMM YYYY')}.` : "No outgoing transactions yet."
                    ),
                  },
                ]}
              />
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Top-up Modal */}
      <TopUpModal
        visible={topUpModalVisible}
        onClose={() => setTopUpModalVisible(false)}
        onTopUp={handleTopUp}
        tokenSymbol={wallet?.token_symbol}
        loading={topUpLoading}
      />
    </div>
  );
};

export default BalanceTransactionPage;