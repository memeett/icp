import React, { useState } from 'react';
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
  Progress,
  Rate,
  List,
  Badge,
  Modal,
  message
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  PlusOutlined, 
  CameraOutlined,
  StarOutlined,
  TrophyOutlined,
  ProjectOutlined,
  DollarOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock user data
const mockUser = {
  id: 'user1',
  name: 'John Doe',
  title: 'Full Stack Developer',
  avatar: '',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Python'],
  hourlyRate: 75,
  availability: 'Available',
  completedJobs: 24,
  totalEarnings: 45000,
  rating: 4.9,
  reviewsCount: 18,
  responseTime: '2 hours',
  languages: ['English (Native)', 'Spanish (Conversational)'],
  education: [
    {
      degree: 'Bachelor of Computer Science',
      school: 'University of California, Berkeley',
      year: '2018'
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect',
    'Google Cloud Professional Developer'
  ],
  portfolio: [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: '',
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: 'https://example.com'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Real-time collaborative task management application',
      image: '',
      technologies: ['React', 'Socket.io', 'Express'],
      link: 'https://example.com'
    }
  ]
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    try {
      // TODO: Implement profile update
      console.log('Updating profile:', values);
      setProfile({ ...profile, ...values });
      setIsEditing(false);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = (info: any) => {
    // TODO: Implement avatar upload
    console.log('Uploading avatar:', info);
    message.success('Avatar updated successfully!');
  };

  const ProfileHeader = () => (
    <Card className="mb-6">
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} sm={6} className="text-center">
          <div className="relative inline-block">
            <Avatar size={120} src={profile.avatar} icon={<UserOutlined />} />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarUpload}
            >
              <Button
                icon={<CameraOutlined />}
                shape="circle"
                size="small"
                className="absolute bottom-0 right-0"
              />
            </Upload>
          </div>
          <div className="mt-4">
            <Badge
              status={profile.availability === 'Available' ? 'success' : 'default'}
              text={profile.availability}
            />
          </div>
        </Col>
        
        <Col xs={24} sm={12}>
          <Title level={2} className="mb-2">{profile.name}</Title>
          <Title level={4} type="secondary" className="mb-3">{profile.title}</Title>
          
          <Space direction="vertical" size="small">
            <Space>
              <EnvironmentOutlined />
              <Text>{profile.location}</Text>
            </Space>
            <Space>
              <MailOutlined />
              <Text>{profile.email}</Text>
            </Space>
            <Space>
              <PhoneOutlined />
              <Text>{profile.phone}</Text>
            </Space>
            <Space>
              <LinkOutlined />
              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                {profile.website}
              </a>
            </Space>
          </Space>
        </Col>
        
        <Col xs={24} sm={6}>
          <div className="text-center space-y-4">
            <div>
              <div className="text-2xl font-bold text-green-600">
                ${profile.hourlyRate}/hr
              </div>
              <Text type="secondary">Hourly Rate</Text>
            </div>
            
            <div>
              <Space>
                <Rate disabled defaultValue={profile.rating} allowHalf />
                <Text>({profile.reviewsCount})</Text>
              </Space>
            </div>
            
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              block
            >
              Edit Profile
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const StatsCards = () => (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <ProjectOutlined className="text-2xl text-blue-500 mb-2" />
          <div className="text-xl font-bold">{profile.completedJobs}</div>
          <Text type="secondary">Jobs Completed</Text>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <DollarOutlined className="text-2xl text-green-500 mb-2" />
          <div className="text-xl font-bold">${profile.totalEarnings.toLocaleString()}</div>
          <Text type="secondary">Total Earned</Text>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <StarOutlined className="text-2xl text-yellow-500 mb-2" />
          <div className="text-xl font-bold">{profile.rating}</div>
          <Text type="secondary">Average Rating</Text>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <CalendarOutlined className="text-2xl text-purple-500 mb-2" />
          <div className="text-xl font-bold">{profile.responseTime}</div>
          <Text type="secondary">Response Time</Text>
        </Card>
      </Col>
    </Row>
  );

  const OverviewTab = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Card title="About Me" className="mb-6">
          <Paragraph>{profile.bio}</Paragraph>
        </Card>
        
        <Card title="Skills" className="mb-6">
          <Space wrap>
            {profile.skills.map(skill => (
              <Tag key={skill} color="blue" className="mb-2">
                {skill}
              </Tag>
            ))}
          </Space>
        </Card>
        
        <Card title="Portfolio">
          <Row gutter={[16, 16]}>
            {profile.portfolio.map(project => (
              <Col xs={24} sm={12} key={project.id}>
                <Card
                  size="small"
                  cover={
                    <div className="h-32 bg-gray-200 flex items-center justify-center">
                      <ProjectOutlined className="text-2xl text-gray-400" />
                    </div>
                  }
                  actions={[
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  ]}
                >
                  <Card.Meta
                    title={project.title}
                    description={project.description}
                  />
                  <div className="mt-2">
                    {project.technologies.map(tech => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
      
      <Col xs={24} lg={8}>
        <Card title="Languages" className="mb-6">
          <List
            size="small"
            dataSource={profile.languages}
            renderItem={lang => <List.Item>{lang}</List.Item>}
          />
        </Card>
        
        <Card title="Education" className="mb-6">
          {profile.education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <Text strong>{edu.degree}</Text>
              <br />
              <Text type="secondary">{edu.school}</Text>
              <br />
              <Text type="secondary">{edu.year}</Text>
            </div>
          ))}
        </Card>
        
        <Card title="Certifications">
          <List
            size="small"
            dataSource={profile.certifications}
            renderItem={cert => (
              <List.Item>
                <TrophyOutlined className="mr-2 text-yellow-500" />
                {cert}
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileHeader />
          <StatsCards />
          
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Overview" key="overview">
                <OverviewTab />
              </TabPane>
              <TabPane tab="Reviews" key="reviews">
                <div className="text-center py-8">
                  <Text type="secondary">Reviews functionality coming soon...</Text>
                </div>
              </TabPane>
              <TabPane tab="Work History" key="history">
                <div className="text-center py-8">
                  <Text type="secondary">Work history functionality coming soon...</Text>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={profile}
          onFinish={handleSave}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="Professional Title"
                rules={[{ required: true, message: 'Please enter your title' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: true, message: 'Please enter your bio' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="hourlyRate"
                label="Hourly Rate ($)"
                rules={[{ required: true, message: 'Please enter your hourly rate' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="availability"
                label="Availability"
                rules={[{ required: true, message: 'Please select availability' }]}
              >
                <Select>
                  <Option value="Available">Available</Option>
                  <Option value="Busy">Busy</Option>
                  <Option value="Not Available">Not Available</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;