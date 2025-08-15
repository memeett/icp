import React, { useState } from 'react';
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
  Tooltip,
  Tabs,
  Table,
  AutoComplete
} from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  FlagOutlined,
  SendOutlined,
  PaperClipOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useAuth, useJobDetails, useUserManagement } from '../shared/hooks';
import { User } from '../shared/types/User';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ApplicantData {
  user: User;
  appliedAt: string;
}

const JobDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { user } = useAuth();
  
  // Use optimized custom hooks
  const {
    job,
    applicants,
    acceptedFreelancers,
    hasApplied,
    isJobOwner,
    loading,
    isApplying,
    handleApply,
    handleAcceptApplicant,
    handleRejectApplicant,
    handleStartJob,
    handleFinishJob
  } = useJobDetails(jobId, user);
  
  const {
    searchUsers,
    searchUsersByUsername,
    sendInvitation,
    clearSearch
  } = useUserManagement();
  
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const [form] = Form.useForm();
  const [inviteForm] = Form.useForm();

  // Handle user invitation
  const handleInviteUser = async (values: any) => {
    if (!user || !jobId || !values.userId) return;
    
    try {
      const success = await sendInvitation(values.userId, user.id, jobId);
      if (success) {
        setIsInviteModalVisible(false);
        inviteForm.resetFields();
        clearSearch();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  // Handle application submission
  const handleApplicationSubmit = async (values: any) => {
    const success = await handleApply(values);
    if (success) {
      setIsApplyModalVisible(false);
      form.resetFields();
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

  console.log("Job details:", acceptedFreelancers);

  // Component for job details content
  const JobDetailsContent = () => {
    if (!job) return null;
    
    return (
    <Row gutter={[24, 24]}>
      {/* Main Content */}
      <Col xs={24} lg={16}>
        <Card className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Title level={2} className="mb-2">{job!.jobName}</Title>
              <Space size="middle" wrap>
                <Tag color="blue">{job!.jobTags[0]?.jobCategoryName || 'General'}</Tag>
                <Tag color="green">{job!.jobStatus}</Tag>
                <Text type="secondary">
                  <ClockCircleOutlined className="mr-1" />
                  Posted {getTimeAgo(new Date(Number(job!.createdAt) / 1000000).toISOString())}
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
              <div className="text-center p-4 bg-background rounded-lg">
                <DollarOutlined className="text-2xl text-green-500 mb-2" />
                <div className="font-semibold">${job!.jobSalary.toLocaleString()}</div>
                <Text type="secondary">Fixed Price</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-background rounded-lg">
                <UserOutlined className="text-2xl text-purple-500 mb-2" />
                <div className="font-semibold">{Number(job!.jobSlots) - acceptedFreelancers.length}</div>
                <Text type="secondary">Available Slots</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-background rounded-lg">
                <UserOutlined className="text-2xl text-blue-500 mb-2" />
                <div className="font-semibold">{applicants.length}</div>
                <Text type="secondary">Applicants</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-background rounded-lg">
                <StarOutlined className="text-2xl text-orange-500 mb-2" />
                <div className="font-semibold">{job!.jobRating.toFixed(1)}</div>
                <Text type="secondary">Rating</Text>
              </div>
            </Col>
          </Row>

          <Divider />

          <div className="mb-6">
            <Title level={4}>Job Description</Title>
            <div className="whitespace-pre-line">
              {job!.jobDescription.map((desc, index) => (
                <Paragraph key={index}>{desc}</Paragraph>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Title level={4}>Required Skills</Title>
            <Space wrap>
              {job!.jobTags.map((tag) => (
                <Tag key={tag.id} color="processing" className="mb-2">
                  {tag.jobCategoryName}
                </Tag>
              ))}
            </Space>
          </div>

          {user && !isJobOwner  && Number(job!.jobSlots) - acceptedFreelancers.length !== 0 && (

            <div className="text-center">
              {hasApplied ? (
                <Button
                  size="large"
                  disabled
                  className="px-8"
                >
                  Already Applied
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  onClick={() => setIsApplyModalVisible(true)}
                  className="px-8"
                >
                  Apply for this Job
                </Button>
              )}
            </div>
          )}

          {user && Number(job!.jobSlots) - acceptedFreelancers.length == 0 && (
            <div className="text-center">
                <Button
                  size="large"
                  disabled
                  className="px-8"
                >
                  <Text>All Slots Filled</Text>
                </Button>
            </div>
          )}

          {isJobOwner && (
            <div className="text-center space-x-4">
              {job!.jobStatus=== 'Open' && acceptedFreelancers.length > 0 && (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStartJob}
                >
                  Start Job
                </Button>
              )}
              {job!.jobStatus=== 'Ongoing' && (
                <Button
                  type="primary"
                  size="large"
                  icon={<StopOutlined />}
                  onClick={handleFinishJob}
                >
                  Finish Job
                </Button>
              )}
            </div>
          )}
        </Card>
      </Col>

      {/* Sidebar */}
      <Col xs={24} lg={8}>
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
    );
  };

  // Component for applicants content
  const ApplicantsContent = () => {
    const columns = [
      {
        title: 'Freelancer',
        key: 'freelancer',
        render: (_: any, record: ApplicantData) => (
          <div className="flex items-center space-x-3">
            <Avatar src={record.user.profilePicture ? URL.createObjectURL(record.user.profilePicture) : undefined} icon={<UserOutlined />} />
            <div>
              <Text strong>{record.user.username}</Text>
              <div className="flex items-center space-x-1">
                <Text type="secondary" className="text-sm">Rating: </Text>
                <Text className="text-sm">{record.user.rating.toFixed(1)}</Text>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Applied',
        dataIndex: 'appliedAt',
        key: 'appliedAt',
        render: (date: string) => formatDate(date),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: ApplicantData) => (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleAcceptApplicant(record.user.id)}
            >
              Accept
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleRejectApplicant(record.user.id)}
            >
              Reject
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Card>
        <Table
          columns={columns}
          dataSource={applicants}
          rowKey={(record) => record.user.id}
          pagination={false}
          locale={{ emptyText: 'No applicants yet' }}
        />
      </Card>
    );
  };

  // Component for accepted freelancers content
  const AcceptedContent = () => {
    const columns = [
      {
        title: 'Freelancer',
        key: 'freelancer',
        render: (_: any, record: User) => (
          <div className="flex items-center space-x-3">
            <Avatar src={record.profilePicture ? URL.createObjectURL(record.profilePicture) : undefined} icon={<UserOutlined />} />
            <div>
              <Text strong>{record.username}</Text>
              <div className="flex items-center space-x-1">
                <Text type="secondary" className="text-sm">Rating: </Text>
                <Text className="text-sm">{record.rating.toFixed(1)}</Text>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: User) => (
          <Space>
            <Button
              onClick={() => navigate(`/profile/${record.id}`)}
            >
              View Profile
            </Button>
            <Button
              danger
              onClick={() => handleRejectApplicant(record.id)}
            >
              Remove
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Card>
        <Table
          columns={columns}
          dataSource={acceptedFreelancers}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'No accepted freelancers yet' }}
        />
      </Card>
    );
  };

  // Component for invite users content
  const InviteContent = () => (
    <Card>
      <Form
        form={inviteForm}
        layout="vertical"
        onFinish={handleInviteUser}
      >
        <Form.Item
          name="userId"
          label="Search and Select User"
          rules={[{ required: true, message: 'Please select a user to invite' }]}
        >
          <AutoComplete
            placeholder="Search by username..."
            onSearch={searchUsersByUsername}
            options={searchUsers.map(user => ({
              value: user.id,
              label: (
                <div className="flex items-center space-x-2">
                  <Avatar size="small" src={user.profilePicture ? URL.createObjectURL(user.profilePicture) : undefined} icon={<UserOutlined />} />
                  <span>{user.username}</span>
                </div>
              )
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
            Send Invitation
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  if (loading || !job) {
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
          {/* Job Management Tabs for Job Owner */}
          {isJobOwner ? (
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
              <TabPane tab="Job Details" key="details">
                <JobDetailsContent />
              </TabPane>
              <TabPane tab={`Applicants (${applicants.length})`} key="applicants">
                <ApplicantsContent />
              </TabPane>
              <TabPane tab={`Accepted (${acceptedFreelancers.length})`} key="accepted">
                <AcceptedContent />
              </TabPane>
              <TabPane tab="Invite Users" key="invite">
                <InviteContent />
              </TabPane>
            </Tabs>
          ) : (
            <JobDetailsContent />
          )}
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
          onFinish={handleApplicationSubmit}
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