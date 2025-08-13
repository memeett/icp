import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Skeleton,
  Empty
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
import { useAuth, useManageJobs, useUserManagement } from '../shared/hooks';
import { Job } from '../shared/types/Job';
import { User } from '../interface/User';
import { ApplierPayload } from '../interface/Applier';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ManageJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use the custom hooks
  const {
    jobs,
    loading,
    filteredJobs,
    searchQuery,
    selectedStatus,
    setSearchQuery,
    setSelectedStatus,
    handleDeleteJob,
    refreshJobs
  } = useManageJobs();
  
  const { allUsers } = useUserManagement();
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isApplicationsModalVisible, setIsApplicationsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appliers, setAppliers] = useState<ApplierPayload[]>([]);
  const [acceptedAppliers, setAccAppliers] = useState<User[]>([]);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'start': 
      case 'open': return 'green';
      case 'ongoing': 
      case 'in_progress': return 'blue';
      case 'finished': 
      case 'completed': return 'purple';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'start': 
      case 'open': return <CheckCircleOutlined />;
      case 'ongoing': 
      case 'in_progress': return <ClockCircleOutlined />;
      case 'finished': 
      case 'completed': return <CheckCircleOutlined />;
      case 'cancelled': return <StopOutlined />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'start': return 'Open';
      case 'ongoing': return 'In Progress';
      case 'finished': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    form.setFieldsValue({
      jobName: job.jobName,
      jobStatus: job.jobStatus,
      jobSalary: job.jobSalary,
      jobDescription: job.jobDescription.join('\n')
    });
    setIsEditModalVisible(true);
  };

  const handleViewApplications = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationsModalVisible(true);
  };

  const handleSaveJob = async (values: any) => {
    try {
      // TODO: Implement job update functionality
      setIsEditModalVisible(false);
      message.success('Job updated successfully');
      refreshJobs();
    } catch (error) {
      message.error('Failed to update job');
    }
  };

  const handleDeleteJobConfirm = async (jobId: string) => {
    await handleDeleteJob(jobId);
  };

  const columns: ColumnsType<Job> = [
    {
      title: 'Job Title',
      dataIndex: 'jobName',
      key: 'jobName',
      render: (jobName, record) => (
        <div>
          <Text strong className="block">{jobName}</Text>
          <Text type="secondary" className="text-sm">
            {record.jobTags?.[0]?.jobCategoryName || 'General'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'jobStatus',
      key: 'jobStatus',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Budget',
      dataIndex: 'jobSalary',
      key: 'jobSalary',
      render: (salary) => (
        <div>
          <Text strong>${salary?.toLocaleString() || 0}</Text>
          <Text type="secondary" className="block text-sm">
            Fixed Price
          </Text>
        </div>
      ),
    },
    {
      title: 'Slots',
      dataIndex: 'jobSlots',
      key: 'jobSlots',
      render: (slots) => (
        <Badge count={Number(slots)} showZero>
          <UserOutlined />
        </Badge>
      ),
    },
    {
      title: 'Posted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => {
        const date = new Date(Number(createdAt) / 1000000); // Convert from nanoseconds
        return date.toLocaleDateString();
      },
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => {
        const date = new Date(Number(updatedAt) / 1000000); // Convert from nanoseconds
        return date.toLocaleDateString();
      },
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
          <Popconfirm
            title="Are you sure you want to delete this job?"
            onConfirm={() => handleDeleteJobConfirm(record.id)}
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

  // Filter jobs based on active tab
  const getFilteredJobsByTab = () => {
    if (activeTab === 'all') return filteredJobs;
    return filteredJobs.filter(job => {
      switch (activeTab) {
        case 'open':
          return job.jobStatus.toLowerCase() === 'start';
        case 'in_progress':
          return job.jobStatus.toLowerCase() === 'ongoing';
        case 'completed':
          return job.jobStatus.toLowerCase() === 'finished';
        case 'cancelled':
          return job.jobStatus.toLowerCase() === 'cancelled';
        default:
          return true;
      }
    });
  };

  const tabFilteredJobs = getFilteredJobsByTab();

  const stats = {
    total: jobs.length,
    open: jobs.filter(job => job.jobStatus.toLowerCase() === 'start').length,
    inProgress: jobs.filter(job => job.jobStatus.toLowerCase() === 'ongoing').length,
    completed: jobs.filter(job => job.jobStatus.toLowerCase() === 'finished').length,
    totalSlots: jobs.reduce((sum, job) => sum + Number(job.jobSlots), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton active />
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

          {/* Search and Filter */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12}>
              <Input.Search
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12}>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: '100%' }}
                placeholder="Filter by status"
              >
                <Option value="All">All Status</Option>
                <Option value="Start">Open</Option>
                <Option value="Ongoing">In Progress</Option>
                <Option value="Finished">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Col>
          </Row>

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
                  title="Open Jobs"
                  value={stats.open}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="In Progress"
                  value={stats.inProgress}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Total Slots"
                  value={stats.totalSlots}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Jobs Table */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={`All Jobs (${stats.total})`} key="all" />
              <TabPane tab={`Open (${stats.open})`} key="open" />
              <TabPane tab={`In Progress (${stats.inProgress})`} key="in_progress" />
              <TabPane tab={`Completed (${stats.completed})`} key="completed" />
            </Tabs>
            
            {tabFilteredJobs.length === 0 ? (
              <Empty
                description="No jobs found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="py-8"
              />
            ) : (
              <Table
                columns={columns}
                dataSource={tabFilteredJobs}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
            )}
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
            name="jobName"
            label="Job Title"
            rules={[{ required: true, message: 'Please enter job title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="jobStatus"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="Start">Open</Option>
              <Option value="Ongoing">In Progress</Option>
              <Option value="Finished">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="jobSalary"
            label="Budget"
            rules={[{ required: true, message: 'Please enter budget' }]}
          >
            <Input type="number" prefix="$" />
          </Form.Item>

          <Form.Item
            name="jobDescription"
            label="Description"
            rules={[{ required: true, message: 'Please enter job description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

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
        title={`Job Details: "${selectedJob?.jobName}"`}
        open={isApplicationsModalVisible}
        onCancel={() => setIsApplicationsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedJob && (
          <div className="space-y-4">
            <div>
              <Text strong>Description:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {selectedJob.jobDescription.map((desc, index) => (
                  <p key={index}>{desc}</p>
                ))}
              </div>
            </div>
            <div>
              <Text strong>Budget:</Text> ${selectedJob.jobSalary?.toLocaleString()}
            </div>
            <div>
              <Text strong>Available Slots:</Text> {Number(selectedJob.jobSlots)}
            </div>
            <div>
              <Text strong>Status:</Text> 
              <Tag color={getStatusColor(selectedJob.jobStatus)} className="ml-2">
                {getStatusText(selectedJob.jobStatus)}
              </Tag>
            </div>
            {selectedJob.jobTags && selectedJob.jobTags.length > 0 && (
              <div>
                <Text strong>Categories:</Text>
                <div className="mt-2">
                  {selectedJob.jobTags.map((tag, index) => (
                    <Tag key={index} color="blue">{tag.jobCategoryName}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )} 
      </Modal>
    </div>
  );
};

export default ManageJobPage;