import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Avatar, 
  Divider,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Skeleton,
  Badge,
  Tooltip
} from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  FlagOutlined,
  SendOutlined,
  PaperClipOutlined,
  ClockCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useJobs } from '../shared/hooks/useJobs';
import { useAuth } from '../shared/hooks/useAuth';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock job data for demonstration
const mockJob = {
  id: '1',
  title: 'Full Stack Developer for E-commerce Platform',
  description: `We are looking for an experienced Full Stack Developer to build a modern e-commerce platform from scratch. The project involves creating both frontend and backend components with a focus on performance, scalability, and user experience.

Key Requirements:
- 3+ years of experience with React and Node.js
- Experience with database design (PostgreSQL preferred)
- Knowledge of payment gateway integration
- Understanding of modern deployment practices
- Strong communication skills

The ideal candidate should be able to work independently and deliver high-quality code within the specified timeline.`,
  category: 'Web Development',
  budget: 5000,
  budgetType: 'fixed' as const,
  deadline: '2024-02-15',
  skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
  experienceLevel: 'intermediate' as const,
  projectType: 'one-time' as const,
  status: 'active' as const,
  postedAt: '2024-01-15T10:00:00Z',
  applicants: 12,
  client: {
    id: 'client1',
    name: 'TechCorp Solutions',
    avatar: '',
    rating: 4.8,
    reviewsCount: 24,
    jobsPosted: 15,
    memberSince: '2022-03-15'
  }
};

const JobDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { user } = useAuth();
  const { isLoading } = useJobs();
  
  const [job, setJob] = useState(mockJob);
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // TODO: Fetch job details by jobId
    console.log('Fetching job details for:', jobId);
  }, [jobId]);

  const handleApply = async (values: any) => {
    setIsApplying(true);
    try {
      // TODO: Implement job application
      console.log('Applying to job:', { jobId, ...values });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      message.success('Application submitted successfully!');
      setIsApplyModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    message.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Job link copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (isLoading) {
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
          <Row gutter={[24, 24]}>
            {/* Main Content */}
            <Col xs={24} lg={16}>
              <Card className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Title level={2} className="mb-2">{job.title}</Title>
                    <Space size="middle" wrap>
                      <Tag color="blue">{job.category}</Tag>
                      <Tag color="green">{job.projectType}</Tag>
                      <Text type="secondary">
                        <ClockCircleOutlined className="mr-1" />
                        Posted {getTimeAgo(job.postedAt)}
                      </Text>
                    </Space>
                  </div>
                  
                  <Space>
                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save job'}>
                      <Button
                        icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
                        onClick={handleSaveJob}
                        type={isSaved ? 'primary' : 'default'}
                      />
                    </Tooltip>
                    <Tooltip title="Share job">
                      <Button icon={<ShareAltOutlined />} onClick={handleShare} />
                    </Tooltip>
                    <Tooltip title="Report job">
                      <Button icon={<FlagOutlined />} />
                    </Tooltip>
                  </Space>
                </div>

                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <DollarOutlined className="text-2xl text-green-500 mb-2" />
                      <div className="font-semibold">${job.budget.toLocaleString()}</div>
                      <Text type="secondary" className="capitalize">{job.budgetType}</Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <CalendarOutlined className="text-2xl text-blue-500 mb-2" />
                      <div className="font-semibold">Deadline</div>
                      <Text type="secondary">{formatDate(job.deadline)}</Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <UserOutlined className="text-2xl text-purple-500 mb-2" />
                      <div className="font-semibold">{job.applicants}</div>
                      <Text type="secondary">Applicants</Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <StarOutlined className="text-2xl text-orange-500 mb-2" />
                      <div className="font-semibold capitalize">{job.experienceLevel}</div>
                      <Text type="secondary">Level</Text>
                    </div>
                  </Col>
                </Row>

                <Divider />

                <div className="mb-6">
                  <Title level={4}>Job Description</Title>
                  <Paragraph className="whitespace-pre-line">
                    {job.description}
                  </Paragraph>
                </div>

                <div className="mb-6">
                  <Title level={4}>Required Skills</Title>
                  <Space wrap>
                    {job.skills.map(skill => (
                      <Tag key={skill} color="processing" className="mb-2">
                        {skill}
                      </Tag>
                    ))}
                  </Space>
                </div>

                {user && (
                  <div className="text-center">
                    <Button
                      type="primary"
                      size="large"
                      icon={<SendOutlined />}
                      onClick={() => setIsApplyModalVisible(true)}
                      className="px-8"
                    >
                      Apply for this Job
                    </Button>
                  </div>
                )}
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              <Card title="About the Client" className="mb-6">
                <div className="text-center mb-4">
                  <Avatar size={64} icon={<UserOutlined />} className="mb-3" />
                  <Title level={4} className="mb-1">{job.client.name}</Title>
                  <Space>
                    <Badge count={job.client.rating} color="gold" />
                    <Text type="secondary">({job.client.reviewsCount} reviews)</Text>
                  </Space>
                </div>

                <Divider />

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="text-center">
                      <div className="font-semibold text-lg">{job.client.jobsPosted}</div>
                      <Text type="secondary">Jobs Posted</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-center">
                      <div className="font-semibold text-lg">
                        {new Date(job.client.memberSince).getFullYear()}
                      </div>
                      <Text type="secondary">Member Since</Text>
                    </div>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button 
                    block 
                    onClick={() => navigate(`/profile/${job.client.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>

              <Card title="Similar Jobs" size="small">
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Text strong className="block mb-1">
                        React Developer Needed
                      </Text>
                      <Text type="secondary" className="text-sm">
                        $2,500 • Fixed Price
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </div>

      {/* Apply Modal */}
      <Modal
        title="Apply for this Job"
        open={isApplyModalVisible}
        onCancel={() => setIsApplyModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApply}
        >
          <Form.Item
            name="coverLetter"
            label="Cover Letter"
            rules={[{ required: true, message: 'Please write a cover letter' }]}
          >
            <TextArea
              rows={6}
              placeholder="Explain why you're the perfect fit for this job..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="proposedBudget"
            label="Your Proposed Budget ($)"
            rules={[{ required: true, message: 'Please enter your proposed budget' }]}
          >
            <Input
              type="number"
              placeholder="Enter your budget"
              prefix={<DollarOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="timeline"
            label="Estimated Timeline (days)"
            rules={[{ required: true, message: 'Please enter estimated timeline' }]}
          >
            <Input
              type="number"
              placeholder="How many days will you need?"
              suffix="days"
            />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="Attachments (Optional)"
          >
            <Upload
              multiple
              beforeUpload={() => false}
              listType="text"
            >
              <Button icon={<PaperClipOutlined />}>
                Attach Files
              </Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsApplyModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isApplying}
              icon={<SendOutlined />}
            >
              Submit Application
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default JobDetailPage;