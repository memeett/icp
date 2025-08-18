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
  Select,
  Radio,
  Divider,
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
  WarningOutlined,
  CalendarOutlined,
  TableOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data for demonstration
const mockUser = {
  id: 'user123',
  username: 'testuser',
  profilePicture: null
};

const mockWallet = {
  token_value: 1250.75,
  token_symbol: 'ICP'
};

const mockTransactions = [
  {
    transactionAt: BigInt(Date.now() * 1_000_000),
    amount: 100,
    transactionType: { topUp: null },
    fromId: 'system',
    toId: ['user123']
  },
  {
    transactionAt: BigInt((Date.now() - 86400000) * 1_000_000),
    amount: 50,
    transactionType: { transferToJob: null },
    fromId: 'user123',
    toId: ['job123']
  },
  {
    transactionAt: BigInt((Date.now() - 172800000) * 1_000_000),
    amount: 75,
    transactionType: { payment: null },
    fromId: 'job456',
    toId: ['user123']
  },
  {
    transactionAt: BigInt((Date.now() - 259200000) * 1_000_000),
    amount: 200,
    transactionType: { topUp: null },
    fromId: 'system',
    toId: ['user123']
  },
  {
    transactionAt: BigInt((Date.now() - 604800000) * 1_000_000),
    amount: 30,
    transactionType: { transferToJob: null },
    fromId: 'user123',
    toId: ['job789']
  },
];

// Chart visualization options
const chartVisualizationOptions = [
  { value: 'balance', label: 'Balance Only', color: '#1890ff' },
  { value: 'income', label: 'Income Only', color: '#52c41a' },
  { value: 'expenses', label: 'Expenses Only', color: '#ff4d4f' },
  { value: 'all', label: 'All Metrics', color: '#722ed1' },
];

// Chart period options
const chartPeriodOptions = [
  { value: '1w', label: 'Last Week' },
  { value: '1m', label: 'Last Month' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' },
];

// Top-up Modal Component
const TopUpModal = ({ visible, onClose, onTopUp, tokenSymbol = 'ICP', loading }) => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(null);
  const [topUpLoading, setTopUpLoading] = useState(false);

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

  const handleQuickAmount = (quickAmount) => {
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
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 opacity-10"></div>
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-t-lg">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <CreditCardOutlined className="text-4xl text-white" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Title level={2} className="mb-3 font-bold">
                  Top Up Your Wallet
                </Title>
                <Text className="text-gray-600 text-lg">
                  Add funds to your digital wallet instantly and securely
                </Text>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <Form form={form} layout="vertical" onFinish={handleTopUp}>
            <div className="mb-6">
              <Text className="font-medium mb-3 block">
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
                          ? 'bg-blue-500 border-blue-500'
                          : 'hover:border-blue-500 hover:text-blue-500'
                        }`}
                      onClick={() => handleQuickAmount(quickAmount)}
                    >
                      {quickAmount} {tokenSymbol}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <Form.Item
              label={
                <span className="font-medium">
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
                prefix={<DollarOutlined className="text-gray-400" />}
                suffix={tokenSymbol}
                min={1}
                max={10000}
                precision={2}
                value={amount}
                onChange={setAmount}
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </Form.Item>

            <Alert
              icon={<InfoCircleOutlined />}
              message="Instant Processing"
              description="Your top-up will be processed immediately and reflected in your wallet balance."
              type="info"
              showIcon
              className="mb-6"
            />

            {amount && amount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="bg-blue-50 border-blue-200">
                  <div className="flex justify-between items-center">
                    <Text className="font-medium">
                      Amount to Add:
                    </Text>
                    <Text className="text-blue-600 font-bold text-lg">
                      +{amount.toFixed(2)} {tokenSymbol}
                    </Text>
                  </div>
                </Card>
              </motion.div>
            )}

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

const BalanceTransactionPage = () => {
  const user = mockUser;
  const isLoading = false;
  const [profileImage, setProfileImage] = useState(null);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [jobNames, setJobNames] = useState({});
  const [jobOwners, setJobOwners] = useState({});
  const [jobAndOwnerInfo, setJobAndOwnerInfo] = useState({});
  const [loadingJobInfo, setLoadingJobInfo] = useState({});
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [wallet, setWallet] = useState(mockWallet);
  
  // Chart filters
  const [chartPeriod, setChartPeriod] = useState('6m');
  const [chartVisualization, setChartVisualization] = useState('all');
  
  // Transaction table filters
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Top-up modal state
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);

  // Generate chart data based on chart period filter
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    const sortedTransactions = [...transactions].sort((a, b) =>
      Number(a.transactionAt) - Number(b.transactionAt)
    );

    const now = new Date();
    let startDate;

    switch (chartPeriod) {
      case '1w':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6m':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = sortedTransactions.length > 0
          ? new Date(Number(sortedTransactions[0].transactionAt) / 1_000_000)
          : new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    }

    // Determine grouping based on period
    const isWeekly = chartPeriod === '1w' || chartPeriod === '1m';
    const groupBy = isWeekly ? 'week' : 'month';

    const groupedData = new Map();
    let cumulativeBalance = mockWallet.token_value;

    // Initialize periods with zero values
    let current = new Date(startDate);
    while (current <= now) {
      const key = isWeekly 
        ? `${current.getFullYear()}-W${Math.ceil((current.getDate() + new Date(current.getFullYear(), current.getMonth(), 1).getDay()) / 7)}`
        : `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groupedData.has(key)) {
        groupedData.set(key, { 
          income: 0, 
          expenses: 0, 
          balance: cumulativeBalance, 
          transactions: 0,
          date: new Date(current)
        });
      }
      
      if (isWeekly) {
        current.setDate(current.getDate() + 7);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    }

    // Process transactions
    sortedTransactions.forEach(tx => {
      const txDate = new Date(Number(tx.transactionAt) / 1_000_000);
      if (txDate < startDate) return;

      const key = isWeekly
        ? `${txDate.getFullYear()}-W${Math.ceil((txDate.getDate() + new Date(txDate.getFullYear(), txDate.getMonth(), 1).getDay()) / 7)}`
        : `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;

      const groupData = groupedData.get(key);
      if (groupData) {
        if ("topUp" in tx.transactionType || tx.fromId !== user?.id) {
          groupData.income += tx.amount;
        } else {
          groupData.expenses += tx.amount;
        }
        groupData.transactions += 1;
      }
    });

    // Convert to chart format
    const chartArray = [];
    let runningBalance = cumulativeBalance;

    Array.from(groupedData.entries()).sort((a, b) => a[1].date - b[1].date).forEach(([key, data]) => {
      const net = data.income - data.expenses;
      runningBalance += net;
      
      const displayLabel = isWeekly 
        ? `Week ${key.split('-W')[1]}` 
        : new Date(data.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      chartArray.push({
        period: displayLabel,
        fullPeriod: isWeekly 
          ? `Week ${key.split('-W')[1]} of ${key.split('-W')[0]}`
          : new Date(data.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        balance: Math.max(0, runningBalance),
        income: data.income,
        expenses: data.expenses,
        net: net,
        transactions: data.transactions,
      });
    });

    return chartArray;
  }, [transactions, chartPeriod, user?.id]);

  // Calculate chart-based statistics
  const chartStats = useMemo(() => {
    const totalIncome = chartData.reduce((sum, data) => sum + data.income, 0);
    const totalExpenses = chartData.reduce((sum, data) => sum + data.expenses, 0);
    return { totalIncome, totalExpenses };
  }, [chartData]);

  // Filter transactions by selected month for table
  const filteredTransactions = useMemo(() => {
    if (!selectedMonth) return transactions;
    return transactions.filter(tx => {
      const transactionDate = new Date(Number(tx.transactionAt) / 1_000_000);
      const selectedDate = selectedMonth.toDate();
      return transactionDate.getMonth() === selectedDate.getMonth() && 
             transactionDate.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedMonth]);

  // Calculate table-based statistics
  const tableStats = useMemo(() => {
    const totalIncomeTable = filteredTransactions.reduce((sum, tx) => {
      if ("topUp" in tx.transactionType || tx.fromId !== user?.id) {
        return sum + tx.amount;
      }
      return sum;
    }, 0);

    const totalExpensesTable = filteredTransactions.reduce((sum, tx) => {
      if ("transferToJob" in tx.transactionType || (tx.fromId === user?.id && !("topUp" in tx.transactionType))) {
        return sum + tx.amount;
      }
      return sum;
    }, 0);

    return { totalIncomeTable, totalExpensesTable };
  }, [filteredTransactions, user?.id]);

  // Handle top-up
  const handleTopUp = async (amount) => {
    if (!user?.id) {
      message.error('User not found');
      return;
    }

    // Simulate top-up process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add new transaction
    const newTransaction = {
      transactionAt: BigInt(Date.now() * 1_000_000),
      amount: amount,
      transactionType: { topUp: null },
      fromId: 'system',
      toId: [user.id]
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setWallet(prev => ({ ...prev, token_value: prev.token_value + amount }));
  };

  // Filter transactions by type for table
  const incomingTransactions = filteredTransactions.filter(tx => {
    if ("topUp" in tx.transactionType) return true;
    return tx.fromId !== user?.id;
  });

  const outgoingTransactions = filteredTransactions.filter(tx => {
    if ("transferToJob" in tx.transactionType) return true;
    return tx.fromId === user?.id && !("topUp" in tx.transactionType);
  });

  // Render chart based on visualization selection
  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
          >
            <LineChartOutlined className="text-3xl text-gray-400" />
          </motion.div>
          <Text className="text-gray-500 text-lg">
            No transaction data available for the selected period
          </Text>
        </div>
      );
    }

    return (
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
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="period"
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
            formatter={(value, name) => [
              `${Number(value).toFixed(2)} ${wallet?.token_symbol || 'ICP'}`,
              name === 'balance' ? 'Balance' :
                name === 'income' ? 'Income' :
                  name === 'expenses' ? 'Expenses' : 'Net'
            ]}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          
          {(chartVisualization === 'balance' || chartVisualization === 'all') && (
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
          )}
          
          {(chartVisualization === 'income' || chartVisualization === 'all') && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="#52c41a"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Income"
              dot={false}
            />
          )}
          
          {(chartVisualization === 'expenses' || chartVisualization === 'all') && (
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ff4d4f"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Expenses"
              dot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Function to render transaction list
  const renderTransactionList = (transactionData, emptyMessage) => (
    <List
      loading={loadingTransactions}
      dataSource={transactionData}
      locale={{ emptyText: emptyMessage }}
      renderItem={(item, index) => {
        let sign = "+";
        let color = "green";
        let description = "";
        let icon = <PlusCircleOutlined />;

        if ("topUp" in item.transactionType) {
          description = "Account Top Up";
          sign = "+";
          color = "green";
          icon = <PlusCircleOutlined />;
        } else if ("transferToJob" in item.transactionType) {
          description = `Transfer to Job ${item.toId[0]}`;
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
            description = `Payment received from job ${item.fromId}`;
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
                className="w-full m-2 shadow-sm border hover:shadow-md transition-all duration-300"
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
                      className={`p-3 rounded-full ${
                        color === 'green' ? 'bg-green-100 text-green-600' :
                        color === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {React.cloneElement(icon, {
                        className: 'text-xl'
                      })}
                    </motion.div>
                    <div>
                      <Text className="font-semibold text-lg block">
                        {description}
                      </Text>
                      <Text className="text-gray-500">
                        {new Date(Number(item.transactionAt) / 1_000_000).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tag
                      color={color}
                      className={`text-lg px-4 py-2 rounded-lg font-semibold border-0 ${
                        color === 'green' ? 'bg-green-100 text-green-700' :
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
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <WalletOutlined className="text-6xl text-blue-500 mb-4" />
            <Title level={2}>Please log in to view your wallet</Title>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Title level={1} className="mb-2">
              Digital Wallet
            </Title>
            <Text className="text-gray-600 text-lg">Manage your finances with ease</Text>
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

          {/* Current Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="text-center shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300 rounded-2xl"
                    bodyStyle={{ padding: '3rem' }}
                    style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="mb-4"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <WalletOutlined className="text-3xl text-white" />
                      </div>
                    </motion.div>
                    {loadingWallet ? (
                      <div>
                        <div className="text-gray-600 text-lg mb-2">Current Balance</div>
                        <Skeleton.Input active size="large" style={{ width: 200, height: 40 }} />
                      </div>
                    ) : (
                      <Statistic
                        title={<span className="text-gray-600 text-lg">Current Balance</span>}
                        value={wallet?.token_value.toFixed(2) || '0.00'}
                        suffix={wallet?.token_symbol || 'ICP'}
                        valueStyle={{
                          color: '#1890ff',
                          fontSize: '3rem',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>

          {/* Chart-based Balance Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="text-center shadow-sm border hover:shadow-md transition-shadow"
                    bodyStyle={{ padding: '2rem' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <ArrowUpOutlined className="text-3xl text-green-600" />
                      <Badge count="Chart" style={{ backgroundColor: '#52c41a' }} />
                    </div>
                    {loadingTransactions ? (
                      <div>
                        <div className="text-gray-600 text-sm mb-2">Chart Income</div>
                        <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                      </div>
                    ) : (
                      <Statistic
                        title={<span className="text-gray-600">Chart Income</span>}
                        value={chartStats.totalIncome.toFixed(2)}
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

              <Col xs={24} sm={12}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="text-center shadow-sm border hover:shadow-md transition-shadow"
                    bodyStyle={{ padding: '2rem' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <ArrowDownOutlined className="text-3xl text-red-600" />
                      <Badge count="Chart" style={{ backgroundColor: '#ff4d4f' }} />
                    </div>
                    {loadingTransactions ? (
                      <div>
                        <div className="text-gray-600 text-sm mb-2">Chart Expenses</div>
                        <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                      </div>
                    ) : (
                      <Statistic
                        title={<span className="text-gray-600">Chart Expenses</span>}
                        value={chartStats.totalExpenses.toFixed(2)}
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
          </motion.div>

          {/* Enhanced Balance Chart with Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card
              title={
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <LineChartOutlined className="text-white text-lg" />
                    </div>
                    <span className="text-xl font-bold">Balance Progress</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Text className="text-gray-600 font-medium">Period:</Text>
                      <Select
                        value={chartPeriod}
                        onChange={setChartPeriod}
                        className="w-40"
                        size="middle"
                      >
                        {chartPeriodOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Text className="text-gray-600 font-medium">Show:</Text>
                      <Select
                        value={chartVisualization}
                        onChange={setChartVisualization}
                        className="w-40"
                        size="middle"
                      >
                        {chartVisualizationOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: option.color }}
                              />
                              {option.label}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <Badge
                      count={chartData.reduce((sum, data) => sum + data.transactions, 0)}
                      style={{ backgroundColor: '#52c41a' }}
                      title="Total transactions in period"
                    >
                      <div className="text-gray-600 text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
                        {chartPeriodOptions.find(opt => opt.value === chartPeriod)?.label || 'Custom'}
                      </div>
                    </Badge>
                  </div>
                </div>
              }
              className="shadow-xl border-2 hover:border-blue-300 transition-all duration-300 rounded-2xl overflow-hidden"
              bodyStyle={{ padding: '2rem' }}
            >
              <div className="h-96">
                {loadingTransactions ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton.Input active style={{ width: '100%', height: '300px' }} />
                  </div>
                ) : (
                  renderChart()
                )}
              </div>
            </Card>
          </motion.div>

          {/* Transaction History Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Transaction Table Stats Cards */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TableOutlined className="text-xl text-blue-500" />
                  <Title level={3} className="mb-0">Transaction Table Statistics</Title>
                </div>
                {/* Month Filter for Transaction Table */}
                <Space>
                  <CalendarOutlined className="text-gray-500" />
                  <Text className="font-medium text-gray-600">Filter transactions:</Text>
                  <DatePicker
                    picker="month"
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    placeholder="Select month"
                    allowClear
                    className="w-44"
                  />
                </Space>
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      className="text-center shadow-sm border hover:shadow-md transition-shadow"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <ArrowUpOutlined className="text-3xl text-green-600" />
                        <Badge count="Table" style={{ backgroundColor: '#52c41a' }} />
                      </div>
                      {loadingTransactions ? (
                        <div>
                          <div className="text-gray-600 text-sm mb-2">Table Income</div>
                          <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                        </div>
                      ) : (
                        <Statistic
                          title={<span className="text-gray-600">Table Income</span>}
                          value={tableStats.totalIncomeTable.toFixed(2)}
                          suffix={wallet?.token_symbol || 'ICP'}
                          valueStyle={{
                            color: '#16a34a',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      <Text className="text-gray-500 text-sm mt-2">
                        {selectedMonth ? `For ${selectedMonth.format('MMMM YYYY')}` : 'All time'}
                      </Text>
                    </Card>
                  </motion.div>
                </Col>

                <Col xs={24} sm={12}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      className="text-center shadow-sm border hover:shadow-md transition-shadow"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <ArrowDownOutlined className="text-3xl text-red-600" />
                        <Badge count="Table" style={{ backgroundColor: '#ff4d4f' }} />
                      </div>
                      {loadingTransactions ? (
                        <div>
                          <div className="text-gray-600 text-sm mb-2">Table Expenses</div>
                          <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                        </div>
                      ) : (
                        <Statistic
                          title={<span className="text-gray-600">Table Expenses</span>}
                          value={tableStats.totalExpensesTable.toFixed(2)}
                          suffix={wallet?.token_symbol || 'ICP'}
                          valueStyle={{
                            color: '#dc2626',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      <Text className="text-gray-500 text-sm mt-2">
                        {selectedMonth ? `For ${selectedMonth.format('MMMM YYYY')}` : 'All time'}
                      </Text>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Transaction History Table */}
            <Card
              title={
                <div className="flex items-center gap-3">
                  <TransactionOutlined className="text-xl text-blue-500" />
                  <span className="text-xl font-semibold">Transaction History</span>
                  {selectedMonth && (
                    <Badge 
                      count={filteredTransactions.length} 
                      style={{ backgroundColor: '#1890ff' }}
                      title={`Transactions in ${selectedMonth.format('MMMM YYYY')}`}
                    />
                  )}
                </div>
              }
              className="shadow-sm border"
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