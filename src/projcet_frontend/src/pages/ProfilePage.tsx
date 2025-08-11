import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Avatar,
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Space,
  Divider,
  Rate,
  List,
  Modal,
  message,
  Skeleton,
  DatePicker,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  StarOutlined,
  ProjectOutlined,
  DollarOutlined,
  CalendarOutlined,
  MailOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
import { getProfilePictureUrl } from '../controller/userController';
import dayjs from 'dayjs';
import { JobCategory } from '../shared/types/Job';
import { User } from '../shared/types/User';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock job categories - in a real app, this would be fetched from the backend
const mockJobCategories: JobCategory[] = [
    { id: '1', jobCategoryName: 'Web Development' },
    { id: '2', jobCategoryName: 'Mobile Development' },
    { id: '3', jobCategoryName: 'UI/UX Design' },
    { id: '4', jobCategoryName: 'Data Science' },
    { id: '5', jobCategoryName: 'DevOps' },
];

const ProfilePage: React.FC = () => {
  const { user, isLoading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? dayjs(user.dob) : null,
        preference: user.preference?.map(p => p.id) || [],
      });
      if (user.profilePicture) {
        setProfileImage(getProfilePictureUrl(user.id, user.profilePicture));
      }
    }
  }, [user, form]);

  const handleSave = async (values: any) => {
    if (!user) return;

    const payload: Partial<User> = {
      username: values.username,
      description: values.description,
    };
    
    if (values.dob) {
      payload.dob = values.dob.format('YYYY-MM-DD');
    }
    
    if (values.preference) {
      payload.preference = values.preference.map((id: string) => mockJobCategories.find(cat => cat.id === id)).filter(Boolean);
    }

    if (uploadedFile) {
      console.log("1");
      payload.profilePicture = new Blob([uploadedFile], { type: uploadedFile.type });
    }
    else {
      console.log("2");
      payload.profilePicture = user.profilePicture;
    }

    payload.isProfileCompleted = user.isProfileCompleted;

    const success = await updateProfile(payload);
    if (success) {
      setIsEditing(false);
      setUploadedFile(null); // Reset uploaded file state
    }
  };

  const handleAvatarUpload = ({ file }: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setUploadedFile(file);
    }
  };

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
          <Card className="mb-6">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={6} className="text-center">
                <Avatar size={120} src={profileImage} icon={<UserOutlined />} />
              </Col>
              <Col xs={24} sm={12}>
                <Title level={2} className="mb-2">{user.username || 'N/A'}</Title>
                <Space direction="vertical" size="small">
                  <Space>
                    <MailOutlined />
                    <Text>{user.id}</Text>
                  </Space>
                  <Space>
                    <CalendarOutlined />
                    <Text>Member since {dayjs(Number(user.createdAt)).format('MMMM YYYY')}</Text>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} sm={6} className="text-center">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  block
                >
                  Edit Profile
                </Button>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={12} sm={8}>
              <Card className="text-center">
                <DollarOutlined className="text-2xl text-green-500 mb-2" />
                <div className="text-xl font-bold">${user.wallet.toLocaleString()}</div>
                <Text type="secondary">Wallet Balance</Text>
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card className="text-center">
                <StarOutlined className="text-2xl text-yellow-500 mb-2" />
                <div className="text-xl font-bold">{user.rating.toFixed(1)}</div>
                <Text type="secondary">Average Rating</Text>
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card className="text-center">
                <ProjectOutlined className="text-2xl text-blue-500 mb-2" />
                <div className="text-xl font-bold">0</div>
                <Text type="secondary">Jobs Completed</Text>
              </Card>
            </Col>
          </Row>

          <Card>
            <Tabs defaultActiveKey="overview">
              <TabPane tab="Overview" key="overview">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    <Card title="About Me" className="mb-6">
                      <Paragraph>{user.description || 'No description provided.'}</Paragraph>
                    </Card>
                    <Card title="Skills">
                      <Space wrap>
                        {user.preference?.length > 0 ? (
                          user.preference.map(skill => (
                            <Tag key={skill.id} color="blue">{skill.jobCategoryName}</Tag>
                          ))
                        ) : (
                          <Text type="secondary">No skills listed.</Text>
                        )}
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card title="Details">
                      <List>
                        <List.Item>
                          <List.Item.Meta
                            avatar={<InfoCircleOutlined />}
                            title="Date of Birth"
                            description={user.dob ? dayjs(user.dob).format('MMMM D, YYYY') : 'Not specified'}
                          />
                        </List.Item>
                        <List.Item>
                          <List.Item.Meta
                            avatar={<GlobalOutlined />}
                            title="Face Recognition"
                            description={user.isFaceRecognitionOn ? 'Enabled' : 'Disabled'}
                          />
                        </List.Item>
                      </List>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      <Modal
        title="Edit Profile"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={24} className="text-center mb-4">
              <Upload
                customRequest={handleAvatarUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Avatar size={120} src={profileImage} icon={<UserOutlined />} className="cursor-pointer" />
                <Button icon={<CameraOutlined />} className="mt-2">Change Photo</Button>
              </Upload>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="preference" label="Skills" rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="Select your skills">
                  {mockJobCategories.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.jobCategoryName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Changes</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;