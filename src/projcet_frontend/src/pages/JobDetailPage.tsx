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
  Tooltip,
  Tabs,
  Table,
  AutoComplete,
  UploadFile,
  Rate
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
  StopOutlined,
  MailOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useAuth, useJobDetails, useUserManagement, useRating } from '../shared/hooks';
import { User } from '../shared/types/User';
import { formatDate } from '../utils/dateUtils';
import { RcFile } from 'antd/es/upload';
import { createSubmission, getUserSubmissionsByJobId, getSubmissionByJobId, updateSubmissionStatus } from '../controller/submissionController';
import JobChatButton from '../components/chat/JobChatButton';

import type { Submission } from '../../../declarations/projcet_backend_single/projcet_backend_single.did';
import { getUserById, getUserByName } from '../controller/userController';
import { getStatusColor } from '../utils/JobStatusCololer';
import { useWallet } from '../hooks/useWallet';
import { Select } from "antd";
import dayjs from "dayjs";


const { Option } = Select;

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
    isJobFreelancer,
    isAccepting,
    isRejecting,
    isFetchingLetter,
    isStartingJob,
    similarJobs,
    handleApply,
    handleAcceptApplicant,
    handleRejectApplicant,
    handleStartJob,
    handleFinishJob,
    handleCoverLetter
  } = useJobDetails(jobId, user);

  const {
    walletSymbol
  } = useWallet();

  const {
    allUsers,
    fetchAllUsers,
    sendInvitation,
    clearSearch
  } = useUserManagement();

  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isCoverModalVisible, setIsCoverModalVisible] = useState(false);
  const [localLoading, setlocalLoading] = useState<boolean>(false);
  const [isStartJobModalVisible, setIsStartJobModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [form] = Form.useForm();
  const [inviteForm] = Form.useForm();

  const [coverLetter, setCoverLetter] = useState<string>("");
  const [selectedWalletSymbol, setSelectedWalletSymbol] = useState(walletSymbol);


  const columns = [
    {
      title: "Freelancer",
      dataIndex: "name",
      key: "name",
    },
    {
      title: `Amount (${walletSymbol})`,
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const data = acceptedFreelancers.map((f, index) => ({
    key: index,
    name: f.username || `Freelancer ${index + 1}`,
    amount: job ? (job.jobSalary).toLocaleString() : 'N/A',
  }));


  // Handle user invitation
  const handleInviteUser = async (values: any) => {
    if (!user || !jobId || !values.userId) return;

    try {
      setlocalLoading(true);
      const success = await sendInvitation(values.userId, user.id, jobId);
      if (success) {
        message.success('Invitation sent successfully');
        setIsInviteModalVisible(false);
        inviteForm.resetFields();
        clearSearch();
      } else {
        message.error('Failed to send invitation');
      }
      setlocalLoading(false)
    } catch (error) {
      console.error('Error sending invitation:', error);
      message.error('Error sending invitation');
    }
  };

  const handleApplicationSubmit = async (values: any) => {
    if (Number(job!.jobSlots) - acceptedFreelancers.length <= 0) {
      message.error('No available slots for new applicants');
      return;
    }
    const success = await handleApply(values);
    if (success) {
      setIsApplyModalVisible(false);
      form.resetFields();
    }
  };


  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Job link copied to clipboard');
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - posted.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };


  // Inside ApplicantsContent
  const getLatestCoverLetter = async (applicantId: string) => {
    setIsCoverModalVisible(true)
    if (!jobId || !user) return null;

    const message = await handleCoverLetter(jobId, user.id, applicantId);
    setCoverLetter(message);
  };

  const JobDetailsContent = () => {
    if (!job) {
      return null;
    }
    const {
      ratingRecords,
      localRatings,
      isSubmittingRating,
      isRatingFinalized,
      loading: ratingLoading,
      handleRateChange,
      handleFinalizeRatings,
    } = useRating(jobId, isJobOwner);
    const displayFreelancers = acceptedFreelancers;

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
                  <Tag color={getStatusColor(job!.jobStatus)}>{job!.jobStatus}</Tag>
                  <Text type="secondary">
                    <ClockCircleOutlined className="mr-1" />
                    Posted {getTimeAgo(new Date(Number(job!.createdAt) / 1_000_000).toISOString())}
                  </Text>
                </Space>
              </div>

              <Space>
                <Tooltip title="Share job">
                  <Button icon={<ShareAltOutlined />} onClick={handleShare} />
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
                  <div className="font-semibold">
                    {job!.jobStatus !== 'Finished'
                      ? (Number(job!.jobSlots) - acceptedFreelancers.length > 0
                        ? `${Number(job!.jobSlots) - acceptedFreelancers.length}`
                        : "No Slots")
                      : "Closed"}
                  </div>
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
                <div
                  className="text-center p-4 bg-background rounded-lg cursor-pointer hover:shadow-md transition"
                  onClick={() => setIsInvoiceModalVisible(true)}
                >
                  <MailOutlined className="text-2xl text-orange-500 mb-2" />
                  <div className="font-semibold">{acceptedFreelancers.length}</div>
                  <Text type="secondary">Invoice</Text>
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

            {user && job!.jobStatus === 'Open' && !isJobOwner && (
              <div className="text-center space-x-4">
                {Number(job!.jobSlots) - acceptedFreelancers.length <= 0 ? (
                  <Button size="large" disabled className="px-8">
                    All Slots Filled
                  </Button>
                ) : hasApplied ? (
                  <Button size="large" disabled className="px-8">
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
            
            {/* Chat button for anyone (client or accepted freelancer) when job is Ongoing/Finished */}
            {user && (job!.jobStatus === 'Ongoing' || job!.jobStatus === 'Finished') && (
              <div className="text-center mt-4">
                <JobChatButton
                  jobId={job!.id}
                  jobStatus={job!.jobStatus}
                  clientId={job!.userId}
                  freelancerId={user?.id}
                />
              </div>
            )}

            {isJobOwner && (
              <div className="text-center space-x-4">
                {job!.jobStatus === 'Open' && acceptedFreelancers.length > 0 && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => setIsStartJobModalVisible(true)}
                    loading={isStartingJob}
                  >
                    Start Job
                  </Button>

                )}
                {job!.jobStatus === 'Open' && acceptedFreelancers.length == 0 && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<CloseOutlined />}
                    disabled={true}
                  >
                    Job has no accepted freelancers
                  </Button>
                )
                }
                {job!.jobStatus === 'Ongoing' && (
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

            <Modal
              title="Start Job"
              open={isStartJobModalVisible}
              onCancel={() => setIsStartJobModalVisible(false)}
              width={600}
              footer={null}
            >
              {job && (
                <div>
                  <Paragraph>
                    Are you sure you want to start this job? Once started, your wallet will be
                    charged {job.jobSalary * acceptedFreelancers.length}{" "}
                    <strong>{selectedWalletSymbol}</strong>, the job status will change to
                    "Ongoing" and freelancers can begin their work.
                  </Paragraph>

                <div className="mb-4">
                  <span className="mr-2 font-semibold">Choose Wallet:</span>
                  <Select
                    value={selectedWalletSymbol}
                    style={{ width: 160 }}
                    onChange={(value) => setSelectedWalletSymbol(value)}
                  >
                    <Option value={walletSymbol}>{walletSymbol}</Option>
                  </Select>
                </div>

                <div className="text-right">
                  <Button
                    type="primary"
                    onClick={async () => {
                      console.log('🚀 Start Job clicked. Job data:', job);
                      if (!job) {
                        console.error('❌ Job is null when trying to start job');
                        message.error('Job data not loaded. Please refresh the page.');
                        return;
                      }
                      setIsStartJobModalVisible(false);
                      await handleStartJob();
                      setIsInvoiceModalVisible(false);
                    }}
                  >
                    Confirm
                  </Button>
                </div>
                </div>
              )}
            </Modal>

            <Modal
              title="Invoice"
              open={isInvoiceModalVisible}
              onCancel={() => setIsInvoiceModalVisible(false)}
              width={700}
              footer={null}
            >
              {job && (
                <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <Paragraph className="m-0">
                    <strong>Status:</strong>{" "}
                    <Tag color="green" className="ml-2">PAID</Tag>
                  </Paragraph>
                  <Paragraph className="m-0 text-gray-500">
                    <strong>Date:</strong> {dayjs().format("YYYY-MM-DD HH:mm:ss")}
                  </Paragraph>
                </div>

                <div>
                  <Title level={5} className="mb-3">Freelancers</Title>
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                    size="middle"
                  />
                </div>

                <div className="flex justify-end border-t pt-3">
                  <Paragraph className="text-lg font-semibold m-0">
                    Total: {job.jobSalary * acceptedFreelancers.length} {walletSymbol}
                  </Paragraph>
                </div>
                </div>
              )}
            </Modal>


            {isJobOwner && job!.jobStatus === 'Finished' && (
              <>
                <Divider />
                <div className="mb-6">
                  <Title level={4}>Freelancer Ratings</Title>
                  <Text type="secondary">
                    Rate accepted freelancers, then click Finalize Ratings to submit.
                  </Text>
                  <Row gutter={[16, 16]} className="mt-3">
                    {displayFreelancers.length > 0 ? (
                      displayFreelancers.map((f) => (
                        <Col xs={24} sm={12} key={f.id}>
                          <Card size="small" className="hover:shadow">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={f.profilePictureUrl || undefined}
                                icon={<UserOutlined />}
                              />
                              <div className="flex-1">
                                <Text strong>{f.username}</Text>
                                <div className="text-xs text-gray-500">
                                  Current: {(Number(f.rating) / 10).toFixed(1)}
                                </div>
                              </div>
                              <Rate
                                allowHalf
                                value={localRatings[f.id] ?? Number(f.rating || 0)}
                                onChange={(value) => handleRateChange(f.id, value)}
                                disabled={Boolean(ratingRecords.find((r: any) => r.user.id === f.id)?.isEdit)}
                              />
                            </div>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col span={24}>
                        <Text type="secondary">No freelancers to rate yet.</Text>
                      </Col>
                    )}
                  </Row>
                  <div className="mt-3 text-right">
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={handleFinalizeRatings}
                      disabled={displayFreelancers.length === 0 || isSubmittingRating || isRatingFinalized}
                      loading={isSubmittingRating}
                    >
                      {isRatingFinalized ? "Ratings Finalized" : "Finalize Ratings"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card title="Similar Jobs" size="small">
            <div className="space-y-3">
              {similarJobs && similarJobs.length > 0 ? (
                similarJobs.map(similarJob => (
                  <div
                    key={similarJob.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/job/${similarJob.id}`)}
                  >
                    <Text strong className="block mb-1">
                      {similarJob.jobName}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      ${similarJob.jobSalary.toLocaleString()} • Fixed Price
                    </Text>
                  </div>
                ))
              ) : (
                <Text type="secondary">No similar jobs found.</Text>
              )}
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
            <Avatar src={record.user.profilePictureUrl || undefined} icon={<UserOutlined />} />
            <div>
              <Text strong>{record.user.username}</Text>
              <div className="flex items-center space-x-1">
                <Text type="secondary" className="text-sm">Rating: </Text>
                <Text className="text-sm">{(Number(record.user.rating) / 10).toFixed(1)}</Text>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Applied',
        dataIndex: 'appliedAt',
        key: 'appliedAt',
        render: (date: string) => formatDate(BigInt(new Date(date).getTime()) * 1_000_000n),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: ApplicantData) => (
          <Space>
            <Button
              size="small"
              onClick={() => navigate(`/profile/${record.user.id}`)}
            >
              View Profile
            </Button>
            <Button
              size="small"
              onClick={() => getLatestCoverLetter(record.user.id)}
            >
              View Cover Letter
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => setIsAcceptModalVisible(true)}
            >
              Accept
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => setIsRejectModalVisible(true)}
            >
              Reject
            </Button>

            <Modal
              title="Cover Letter"
              open={isCoverModalVisible}
              onCancel={() => setIsCoverModalVisible(false)}
              footer={[
                <Button key="close" onClick={() => setIsCoverModalVisible(false)}>
                  Close
                </Button>,
              ]}
              width={600}
            >
              {isFetchingLetter ? (
                <div className="container mx-auto px-4 py-8">
                  <Skeleton active />
                </div>
              ) : (
                <Paragraph style={{ whiteSpace: "pre-line" }}>
                  {coverLetter}
                </Paragraph>
              )}

            </Modal>

            <Modal
              title="Accept Applicant"
              open={isAcceptModalVisible}
              onCancel={() => setIsAcceptModalVisible(false)}
              footer={null}
              width={600}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={async () => {
                  const success = await handleAcceptApplicant(record.user.id, form.getFieldsValue());
                  if (success) {
                    message.success("Applicant accepted successfully!");
                    setIsAcceptModalVisible(false);
                  } else {
                    message.error("Failed to accept applicant.");
                  }
                }}
              >
                <Form.Item
                  name="acceptancereason"
                  label="Acceptance Reason"
                  rules={[{ required: true, message: 'Please write an acceptance reason' }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Explain why this applicant is fit for this job..."
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setIsAcceptModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isAccepting}
                    icon={<SendOutlined />}

                  >
                    Accept Applicant
                  </Button>
                </div>
              </Form>
            </Modal>

            <Modal
              title="Reject Applicant"
              open={isRejectModalVisible}
              onCancel={() => setIsRejectModalVisible(false)}
              footer={null}
              width={600}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={() => handleRejectApplicant(record.user.id, form.getFieldsValue())}
              >
                <Form.Item
                  name="rejectionreason"
                  label="Rejection Reason"
                  rules={[{ required: true, message: 'Please write a rejection reason' }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Explain why this applicant isn't fit for this job..."
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setIsRejectModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isRejecting}
                    icon={<CloseOutlined />}

                  >
                    Reject Applicant
                  </Button>
                </div>
              </Form>
            </Modal>

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
            <Avatar src={record.profilePictureUrl || undefined} icon={<UserOutlined />} />
            <div>
              <Text strong>{record.username}</Text>
              <div className="flex items-center space-x-1">
                <Text type="secondary" className="text-sm">Rating: </Text>
                <Text className="text-sm">{(Number(record.rating) / 10).toFixed(1)}</Text>
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
  const InviteContent = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [optionsUsers, setOptionsUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);

    const baseUsers = (allUsers || []).filter(u => (user ? u.id !== user.id : true));

    useEffect(() => {
      setOptionsUsers(baseUsers);
    }, [allUsers, user?.id]);

    const handleSelectUser = (value: string) => {
      const found = baseUsers.find(u => u.id === value) || null;
      setSelectedUser(found);
    };

    const handleSearch = (text: string) => {
      const query = text.trim().toLowerCase();
      if (!query) {
        setOptionsUsers(baseUsers);
        return;
      }
      const filtered = baseUsers
        .filter(u => (u.username || '').toLowerCase().includes(query))
        .slice(0, 20);
      setOptionsUsers(filtered);
    };

    return (
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
              placeholder="Select a freelancer or type a username..."
              open={open}
              onSearch={handleSearch}
              onSelect={(value) => {
                handleSelectUser(value as string);
                setOpen(false);
              }}
              onFocus={async () => {
                if (!allUsers || allUsers.length === 0) {
                  await fetchAllUsers();
                }
                setOptionsUsers(baseUsers);
                setOpen(true);
              }}
              onBlur={() => setOpen(false)}
              options={optionsUsers.map(u => ({
                value: u.id,
                label: (
                  <div className="flex items-center space-x-2">
                    <Avatar
                      size="small"
                      src={u.profilePictureUrl || undefined}
                      icon={<UserOutlined />}
                    />
                    <span>{u.username}</span>
                  </div>
                )
              }))}
            />
          </Form.Item>

          {selectedUser && (
            <Card size="small" className="mb-4" title="Selected User">
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={selectedUser.profilePictureUrl || undefined}
                      icon={<UserOutlined />}
                    />
                    <div>
                      <Text strong>{selectedUser.username}</Text>
                      <div className="text-sm text-gray-500">Rating: {(Number(selectedUser.rating) / 10).toFixed(1)}</div>
                    </div>
                  </div>
                </Col>

                {selectedUser.description && (
                  <Col span={24}>
                    <Text type="secondary">
                      {selectedUser.description.length > 160
                        ? `${selectedUser.description.slice(0, 160)}...`
                        : selectedUser.description}
                    </Text>
                  </Col>
                )}

                {selectedUser.preference && selectedUser.preference.length > 0 && (
                  <Col span={24}>
                    <Space wrap>
                      {selectedUser.preference.slice(0, 5).map(tag => (
                        <Tag key={tag.id} color="blue">
                          {tag.jobCategoryName}
                        </Tag>
                      ))}
                    </Space>
                  </Col>
                )}
              </Row>
            </Card>
          )}

          <Form.Item
            name="message"
            label="Invitation Message"
            rules={[
              { required: true, message: 'Please enter an invitation message' },
              { min: 10, message: 'Message must be at least 10 characters long' },
              { max: 500, message: 'Message cannot exceed 500 characters' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder={`Hi ${selectedUser ? selectedUser.username : 'there'}, I would like to invite you to work on this job. Please let me know if you're interested!`}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                onClick={() => {
                  inviteForm.resetFields();
                  setSelectedUser(null);
                  clearSearch();
                  setOptionsUsers(baseUsers);
                }}
              >
                Clear
              </Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Send Invitation
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  const SubmissionContent = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([]);
    const [ownerSubmissions, setOwnerSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
      const run = async () => {
        try {
          if (user && jobId && !isJobOwner) {
            const list = await getUserSubmissionsByJobId(jobId, user.id);
            setSubmissionHistory(list);
          }
          if (isJobOwner && jobId) {
            const listOwner = await getSubmissionByJobId(jobId);
            setOwnerSubmissions(listOwner);
          }
        } catch (err) {
          console.error('Failed to load submission history', err);
        }
      };
      run();
    }, [user, jobId, isJobOwner]);

    const handleFileUpload = (info: any) => {
      let newList = [...info.fileList].slice(-1); // keep only last file
      setFileList(newList);
    };

    const beforeUpload = (file: RcFile) => {
      const validZipTypes = [
        "application/zip",
        "application/x-zip-compressed",
        "multipart/x-zip",
      ];

      const isZip = validZipTypes.includes(file.type);
      if (!isZip) {
        message.error("You can only upload ZIP files!");
      }

      return false;
    };

    const handleSubmit = async (values: any) => {
      try {
        if (!user || !jobId) {
          message.error("You must be logged in and have a valid job selected.");
          return;
        }
        if (!fileList.length || !fileList[0]?.originFileObj) {
          message.error("Please upload your submission file.");
          return;
        }

        const file = fileList[0].originFileObj as File;
        // Save the file to src/projcet_frontend/src/shared/FreelancerAnswer/{jobId}/{userId}/{filename}
        const resp = await fetch('/api/save-file', {
          method: 'POST',
          headers: {
            'x-job-id': jobId,
            'x-user-id': user.id,
            'x-filename': file.name,
          },
          body: file,
        });

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`Failed to save file: ${resp.status} ${errText}`);
        }

        const data = await resp.json() as { path: string };
        const relativePath = data.path; // e.g. src/projcet_frontend/src/shared/FreelancerAnswer/{jobId}/{userId}/{filename}

        // Store the relative path in canister
        const result = await createSubmission(jobId, user as any, relativePath, values.message);
        if (result[0] === "Ok") {
          message.success("Submission sent successfully!");
          form.resetFields();
          setFileList([]);
          // refresh history
          try {
            if (user && jobId) {
              const list = await getUserSubmissionsByJobId(jobId, user.id);
              setSubmissionHistory(list);
            }
          } catch (e) {
            console.warn('Failed to refresh submission history', e);
          }
        } else {
          throw new Error("Create submission did not return Ok");
        }
      } catch (e: any) {
        console.error("Submission error:", e);
        message.error(e?.message || "Failed to submit work.");
      }
    };

    // UI for Freelancer
    if (!isJobOwner) {
      // submissionHistory loaded from canister via useEffect

      return (
        <Row gutter={[16, 24]}>
          <Col xs={24} md={12}>
            <Card title="Submit Your Work">
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[{ required: true, message: 'Please enter a message for your submission.' }]}
                >
                  <TextArea rows={4} placeholder="Add a message about your submission..." />
                </Form.Item>

                <Form.Item
                  name="submissionFile"
                  label="Submission File (ZIP only)"
                  rules={[{ required: true, message: 'Please upload your submission file.' }]}
                >
                  <Upload
                    beforeUpload={beforeUpload}
                    onChange={handleFileUpload}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button icon={<PaperClipOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    Submit Work
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Submission History">
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '16px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {submissionHistory.length > 0 ? (
                    submissionHistory.map((sub) => {
                      const filePath = sub.submissionFilePath || '';
                      const fileName = (filePath.split('/').pop() || 'file.zip');
                      return (
                        <Card key={sub.id} type="inner">
                          <Paragraph>{sub.submissionMessage || '-'}</Paragraph>
                          <Tag color={sub.status === 'Accept' ? 'green' : sub.status === 'Reject' ? 'red' : 'blue'}>
                            {sub.status}
                          </Tag>
                          <br />
                          <Text type="secondary">File: {fileName}</Text>
                          <br />
                          {filePath && (
                            <Button
                              href={`/api/download-file?path=${encodeURIComponent(filePath)}`}
                              download
                              icon={<PaperClipOutlined />}
                              size="small"
                              style={{ marginTop: 8 }}
                            >
                              Download File
                            </Button>
                          )}
                        </Card>
                      );
                    })
                  ) : (
                    <Text>No submission history.</Text>
                  )}
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      );
    }

    // UI for Job Owner
    const SubmitterInfo = ({ sub }: { sub: Submission }) => {
      const [submitter, setSubmitter] = useState<User | null>(null);

      useEffect(() => {
        const fetchSubmitter = async () => {
          const result = await getUserById(sub.userId);
          if (result && 'ok' in result) {
            setSubmitter(result.ok);
          }
        };
        fetchSubmitter();
      }, [sub.userId]);

      const filePath = sub.submissionFilePath || '';
      const fileName = (filePath.split('/').pop() || 'file.zip');

      return (
        <Card key={sub.id} title={`Submission from ${submitter?.username || '...'}`}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Text strong>{submitter?.username || '...'}</Text>
                  <br />
                  <Tag color={sub.status === 'Accept' ? 'green' : sub.status === 'Reject' ? 'red' : 'blue'}>
                    {sub.status}
                  </Tag>
                </div>
              </div>
            </Col>
            <Col span={24}>
              <Title level={5}>Message:</Title>
              <Paragraph>{sub.submissionMessage || '-'}</Paragraph>
            </Col>
            <Col span={24}>
              {filePath ? (
                <Button href={`/api/download-file?path=${encodeURIComponent(filePath)}`} download icon={<PaperClipOutlined />}>
                  Download Submission ({fileName})
                </Button>
              ) : (
                <Text type="secondary">No file attached</Text>
              )}
            </Col>
            <Col span={24}>
              {sub.status === 'Waiting' && (
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={async () => {
                      try {
                        const res = await updateSubmissionStatus(sub.id, 'Accept', sub.submissionMessage || '');
                        if (res[0] === 'Ok') {
                          message.success('Submission accepted');
                          const listOwner = await getSubmissionByJobId(jobId!);
                          setOwnerSubmissions(listOwner);
                        }
                      } catch (e) {
                        message.error('Failed to accept submission');
                      }
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={async () => {
                      try {
                        const res = await updateSubmissionStatus(sub.id, 'Reject', sub.submissionMessage || '');
                        if (res[0] === 'Ok') {
                          message.success('Submission rejected');
                          const listOwner = await getSubmissionByJobId(jobId!);
                          setOwnerSubmissions(listOwner);
                        }
                      } catch (e) {
                        message.error('Failed to reject submission');
                      }
                    }}
                  >
                    Decline
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        </Card>
      );
    }

    const submissions = ownerSubmissions;

    return (
      <Space direction="vertical" size="large" className="w-full">
        {submissions.map(sub => <SubmitterInfo key={sub.id} sub={sub} />)}
        {submissions.length === 0 && <Text>No submissions yet.</Text>}
      </Space>
    );
  };

  if (loading || localLoading ||!job) {
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
              <TabPane tab="Submission Answer" key="submission">
                <SubmissionContent />
              </TabPane>

              {job.jobStatus === "Open" && (
                <TabPane tab="Invite Users" key="invite">
                  <InviteContent />
                </TabPane>
              )}
              {job.jobStatus === "Ongoing" && (
                <TabPane tab="Submission Answer" key="submission">
                  <SubmissionContent />
                </TabPane>
              )}
            </Tabs>
          ) : (
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">

              <TabPane tab="Job Details" key="details">
                <JobDetailsContent />
              </TabPane>
              {isJobFreelancer && job!.jobStatus === "Ongoing" && (
                <TabPane tab="Submission Upload" key="submission">
                  <SubmissionContent />

                </TabPane>
              )}
            </Tabs>
          )}
        </motion.div>
      </div>

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
