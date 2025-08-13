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
import { F, J } from 'vitest/dist/chunks/reporters.66aFHiyX';
import { getAcceptedFreelancer, getJobApplier, getUserJobs } from '../controller/jobController';
import { User } from '../interface/User';
import { fetchUserBySession } from '../controller/userController';
import { Job, JobCategory } from '../interface/job/Job';
import { ApplierPayload } from '../interface/Applier';
import { hasUserApplied } from '../controller/applyController';
import { formatDate } from '../utils/dateUtils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ManageJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]); // Assuming Job is a type/interface for your job data
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isApplicationsModalVisible, setIsApplicationsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appliers, setAppliers] = useState<ApplierPayload[]>([]);
  const [acceptedAppliers, setAccAppliers] = useState<User[]>([]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'purple';
      case 'Ongoing': return 'orange';
      case 'Open': return 'green';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircleOutlined />;
      case 'Ongoing': return <EditOutlined />;
      case 'Open': return <PlusOutlined />;
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

  const fetchData = async () => {
    try {
      const jobs = await getUserJobs(currentUser?.id || "");
      if (jobs) {
        const convertedJobs = jobs.map((job) => ({
          ...job,
          createdAt: BigInt(job.createdAt),
          updatedAt: BigInt(job.updatedAt),
        }));
        console.log("Converted Jobs:", convertedJobs);
        let formattedJobs = formatJobData(convertedJobs);
        setJobs(formattedJobs);
        console.log("Fetched Jobs:", formattedJobs);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const handleViewApplications = async (job: any) => {
    // Fetch applications for the selected job
    console.log("Selected Job:", job);
    const [acceptedFreelancers, jobAppliers] = await Promise.all([
      getAcceptedFreelancer(job.id),
      getJobApplier(job.id),
    ]);



    setAccAppliers(acceptedFreelancers);
    setAppliers(jobAppliers);

    const hasApplied = await hasUserApplied(currentUser?.id || "", job.id);

    const isUserAcceptedOrApplied = await
      acceptedFreelancers.some((user) => user.id === currentUser?.id) || hasApplied;
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

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserBySession();
      if (user) setCurrentUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {

  }, [currentUser]);

  const columns: ColumnsType<any> = [
  {
    title: 'Job Title',
    dataIndex: 'name', // changed from jobName
    key: 'name',
    render: (name, record) => (
      <div>
        <Text strong className="block">{name}</Text>
        <Text type="secondary" className="text-sm">
          {record.tags || "Uncategorized"} 
        </Text>
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status', // changed from jobStatus
    key: 'status',
    render: (status) => (
      <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Budget',
    dataIndex: 'salary', // changed from jobSalary
    key: 'salary',
    render: (salary) => (
      <div>
        <Text strong>${salary}</Text>
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
    dataIndex: 'createdAt', // already matches formatJobData
    key: 'createdAt',
  },
  {
    title: 'Deadline',
    dataIndex: 'deadline',
    key: 'deadline',
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
          onConfirm={() => handleDeleteJob(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete Job">
            <Button icon={<DeleteOutlined />} danger />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];


  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'all') return true;
    return job.jobStatus === activeTab;
  });

  function formatJobData(rawJobs: any[]): any[] {
    return rawJobs.map(job => ({
      id: job.id,
      name: job.jobName,
      description: Array.isArray(job.jobDescription)
        ? job.jobDescription.join(' ')
        : job.jobDescription,
      salary: Number(job.jobSalary).toLocaleString(), 
      slots: Number(job.jobSlots),
      rating: job.jobRating,
      status: job.jobStatus,
      tags: job.jobTags.map((tag: JobCategory) => tag.jobCategoryName).join(', '),
      createdAt: formatDate(job.createdAt),
      updatedAt: formatDate(job.updatedAt),
      wallet: job.wallet
    }));
  }

  const stats = {
    total: jobs.length,
    Finished: jobs.filter(job => job.jobStatus === 'Finished').length,
    Ongoing: jobs.filter(job => job.jobStatus === 'Ongoing').length,
    Open: jobs.filter(job => job.jobStatus === 'Open').length,
    totalApplicants: appliers.filter(applier => applier.user === selectedJob?.id).length,
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
                  title="Finished Jobs"
                  value={stats.Finished}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Ongoing Jobs"
                  value={stats.Ongoing}
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
              <TabPane tab={`Finished (${stats.Finished})`} key="finished" />
              <TabPane tab={`Ongoing (${stats.Ongoing})`} key="ongoing" />
              <TabPane tab={`Open (${stats.Open})`} key="open" />
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
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: 'Please select deadline' }]}
          >
            <Input type="date" />
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
        {/* {selectedJob?.applications?.length > 0 ? (
          <Table
            columns={columns}
            dataSource={selectedJob.applications}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">No applications yet</Text>
          </div>
        )} */}
      </Modal>
    </div>
  );
};

export default ManageJobPage;