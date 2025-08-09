import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Tabs, 
  Statistic, 
  Row, 
  Col, 
  Modal, 
  Form, 
  Input, 
  Select,
  message,
  Popconfirm,
  Badge,
  Avatar,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  DollarOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Full Stack Developer for E-commerce Platform',
    status: 'active',
    budget: 5000,
    budgetType: 'fixed',
    applicants: 12,
    postedAt: '2024-01-15',
    deadline: '2024-02-15',
    category: 'Web Development',
    applications: [
      {
        id: 'app1',
        freelancer: {
          name: 'John Doe',
          avatar: '',
          rating: 4.8,
          proposedBudget: 4500,
          timeline: '30 days',
          coverLetter: 'I am excited to work on this project...'
        },
        appliedAt: '2024-01-16'
      },
      {
        id: 'app2',
        freelancer: {
          name: 'Jane Smith',
          avatar: '',
          rating: 4.9,
          proposedBudget: 5200,
          timeline: '25 days',
          coverLetter: 'With 5+ years of experience...'
        },
        appliedAt: '2024-01-17'
      }
    ]
  },
  {
    id: '2',
    title: 'Mobile App UI/UX Design',
    status: 'draft',
    budget: 2500,
    budgetType: 'fixed',
    applicants: 0,
    postedAt: '2024-01-20',
    deadline: '2024-02-20',
    category: 'UI/UX Design',
    applications: []
  },
  {
    id: '3',
    title: 'React Native Developer',
    status: 'closed',
    budget: 75,
    budgetType: 'hourly',
    applicants: 8,
    postedAt: '2024-01-10',
    deadline: '2024-01-30',
    category: 'Mobile Development',
    applications: []
  }
];

const ManageJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isApplicationsModalVisible, setIsApplicationsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'draft': return 'orange';
      case 'closed': return 'red';
      case 'paused': return 'blue';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleOutlined />;
      case 'draft': return <EditOutlined />;
      case 'closed': return <StopOutlined />;
      case 'paused': return <PauseCircleOutlined />;
      default: return null;
    }
  };

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    form.setFieldsValue(job);
    setIsEditModalVisible(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      setJobs(jobs.filter(job => job.id !== jobId));
      message.success('Job deleted successfully');
    } catch (error) {
      message.error('Failed to delete job');
    }
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      message.success(`Job ${newStatus} successfully`);
    } catch (error) {
      message.error('Failed to update job status');
    }
  };

  const handleViewApplications = (job: any) => {
    setSelectedJob(job);
    setIsApplicationsModalVisible(true);
  };

  const handleSaveJob = async (values: any) => {
    try {
      setJobs(jobs.map(job => 
        job.id === selectedJob.id ? { ...job, ...values } : job
      ));
      setIsEditModalVisible(false);
      message.success('Job updated successfully');
    } catch (error) {
      message.error('Failed to update job');
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <Text strong className="block">{title}</Text>
          <Text type="secondary" className="text-sm">{record.category}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget, record) => (
        <div>
          <Text strong>${budget.toLocaleString()}</Text>
          <Text type="secondary" className="block text-sm capitalize">
            {record.budgetType}
          </Text>
        </div>
      ),
    },
    {
      title: 'Applicants',
      dataIndex: 'applicants',
      key: 'applicants',
      render: (applicants, record) => (
        <Button
          type="link"
          onClick={() => handleViewApplications(record)}
          disabled={applicants === 0}
        >
          <Badge count={applicants} showZero>
            <UserOutlined />
          </Badge>
        </Button>
      ),
    },
    {
      title: 'Posted',
      dataIndex: 'postedAt',
      key: 'postedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Job">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/jobs/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Job">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditJob(record)}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Pause Job">
              <Button
                icon={<PauseCircleOutlined />}
                onClick={() => handleUpdateJobStatus(record.id, 'paused')}
              />
            </Tooltip>
          )}
          {record.status === 'paused' && (
            <Tooltip title="Activate Job">
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateJobStatus(record.id, 'active')}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Are you sure you want to delete this job?"
            onConfirm={() => handleDeleteJob(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Job">
              <Button
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const applicationColumns: ColumnsType<any> = [
    {
      title: 'Freelancer',
      key: 'freelancer',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.freelancer.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{record.freelancer.name}</Text>
            <div className="flex items-center space-x-1">
              <Text type="secondary" className="text-sm">Rating: </Text>
              <Text className="text-sm">{record.freelancer.rating}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Proposed Budget',
      key: 'budget',
      render: (_, record) => (
        <Text strong>${record.freelancer.proposedBudget.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_, record) => record.freelancer.timeline,
    },
    {
      title: 'Applied',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small">
            Accept
          </Button>
          <Button size="small">
            Message
          </Button>
          <Button size="small" danger>
            Decline
          </Button>
        </Space>
      ),
    },
  ];

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'all') return true;
    return job.status === activeTab;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(job => job.status === 'active').length,
    draft: jobs.filter(job => job.status === 'draft').length,
    closed: jobs.filter(job => job.status === 'closed').length,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2}>Manage Jobs</Title>
              <Text type="secondary">
                Track and manage your job postings
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate('/post')}
            >
              Post New Job
            </Button>
          </div>

          {/* Statistics */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Total Jobs"
                  value={stats.total}
                  prefix={<ProjectOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Active Jobs"
                  value={stats.active}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Draft Jobs"
                  value={stats.draft}
                  prefix={<EditOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Total Applicants"
                  value={stats.totalApplicants}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Jobs Table */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={`All Jobs (${stats.total})`} key="all" />
              <TabPane tab={`Active (${stats.active})`} key="active" />
              <TabPane tab={`Draft (${stats.draft})`} key="draft" />
              <TabPane tab={`Closed (${stats.closed})`} key="closed" />
            </Tabs>
            
            <Table
              columns={columns}
              dataSource={filteredJobs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>
        </motion.div>
      </div>

      {/* Edit Job Modal */}
      <Modal
        title="Edit Job"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveJob}
        >
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: 'Please enter job title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="draft">Draft</Option>
              <Option value="paused">Paused</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="Budget"
                rules={[{ required: true, message: 'Please enter budget' }]}
              >
                <Input type="number" prefix="$" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budgetType"
                label="Budget Type"
                rules={[{ required: true, message: 'Please select budget type' }]}
              >
                <Select>
                  <Option value="fixed">Fixed Price</Option>
                  <Option value="hourly">Hourly Rate</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Applications Modal */}
      <Modal
        title={`Applications for "${selectedJob?.title}"`}
        open={isApplicationsModalVisible}
        onCancel={() => setIsApplicationsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedJob?.applications?.length > 0 ? (
          <Table
            columns={applicationColumns}
            dataSource={selectedJob.applications}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">No applications yet</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageJobPage;