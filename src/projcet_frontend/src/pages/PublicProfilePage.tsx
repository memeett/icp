import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Rate, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Button, 
  Divider, 
  List, 
  Tabs, 
  Skeleton,
  message
} from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  StarOutlined, 
  ProjectOutlined, 
  MessageOutlined, 
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock user data
const mockUser = {
  id: 'user1',
  name: 'Sarah Johnson',
  title: 'Full Stack Developer',
  avatar: '',
  location: 'New York, USA',
  memberSince: '2022-03-15',
  bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Python'],
  hourlyRate: 85,
  rating: 4.9,
  reviewsCount: 47,
  completedJobs: 32,
  responseTime: '1 hour',
  languages: ['English (Native)', 'Spanish (Conversational)'],
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
  ],
  reviews: [
    {
      id: 1,
      client: 'John Doe',
      rating: 5,
      comment: 'Excellent work! Sarah delivered exactly what we needed on time.',
      project: 'E-commerce Website',
      date: '2024-01-15'
    },
    {
      id: 2,
      client: 'Tech Corp',
      rating: 5,
      comment: 'Great communication and technical skills. Highly recommended!',
      project: 'Mobile App Development',
      date: '2024-01-10'
    }
  ]
};

const PublicProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // TODO: Fetch user profile by id
    console.log('Fetching user profile for:', id);
  }, [id]);

  const handleSaveProfile = () => {
    setIsSaved(!isSaved);
    message.success(isSaved ? 'Profile removed from saved' : 'Profile saved successfully');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Profile link copied to clipboard');
  };

  const handleContact = () => {
    // TODO: Implement contact functionality
    message.info('Contact functionality coming soon');
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
          {/* Profile Header */}
          <Card className="mb-6">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={6} className="text-center">
                <Avatar size={120} src={user.avatar} icon={<UserOutlined />} />
              </Col>
              
              <Col xs={24} sm={12}>
                <Title level={2} className="mb-2">{user.name}</Title>
                <Title level={4} type="secondary" className="mb-3">{user.title}</Title>
                
                <Space direction="vertical" size="small">
                  <Space>
                    <EnvironmentOutlined />
                    <Text>{user.location}</Text>
                  </Space>
                  <Space>
                    <CalendarOutlined />
                    <Text>Member since {new Date(user.memberSince).getFullYear()}</Text>
                  </Space>
                  <Space>
                    <Rate disabled defaultValue={user.rating} allowHalf />
                    <Text>({user.reviewsCount} reviews)</Text>
                  </Space>
                </Space>
              </Col>
              
              <Col xs={24} sm={6}>
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${user.hourlyRate}/hr
                    </div>
                    <Text type="secondary">Hourly Rate</Text>
                  </div>
                  
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      icon={<MessageOutlined />}
                      onClick={handleContact}
                      block
                    >
                      Contact
                    </Button>
                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                      <Button
                        icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
                        onClick={handleSaveProfile}
                        type={isSaved ? 'primary' : 'default'}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        icon={<ShareAltOutlined />}
                        onClick={handleShare}
                      >
                        Share
                      </Button>
                    </Space>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={8}>
              <Card className="text-center">
                <ProjectOutlined className="text-2xl text-blue-500 mb-2" />
                <div className="text-xl font-bold">{user.completedJobs}</div>
                <Text type="secondary">Jobs Completed</Text>
              </Card>
            </Col>
            <Col xs={8}>
              <Card className="text-center">
                <StarOutlined className="text-2xl text-yellow-500 mb-2" />
                <div className="text-xl font-bold">{user.rating}</div>
                <Text type="secondary">Average Rating</Text>
              </Card>
            </Col>
            <Col xs={8}>
              <Card className="text-center">
                <MessageOutlined className="text-2xl text-green-500 mb-2" />
                <div className="text-xl font-bold">{user.responseTime}</div>
                <Text type="secondary">Response Time</Text>
              </Card>
            </Col>
          </Row>

          {/* Profile Content */}
          <Card>
            <Tabs defaultActiveKey="overview">
              <TabPane tab="Overview" key="overview">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    <div className="mb-6">
                      <Title level={4}>About</Title>
                      <Paragraph>{user.bio}</Paragraph>
                    </div>
                    
                    <div className="mb-6">
                      <Title level={4}>Skills</Title>
                      <Space wrap>
                        {user.skills.map(skill => (
                          <Tag key={skill} color="blue" className="mb-2">
                            {skill}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                    
                    <div>
                      <Title level={4}>Portfolio</Title>
                      <Row gutter={[16, 16]}>
                        {user.portfolio.map(project => (
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
                    </div>
                  </Col>
                  
                  <Col xs={24} lg={8}>
                    <Card title="Languages" className="mb-6">
                      <List
                        size="small"
                        dataSource={user.languages}
                        renderItem={lang => <List.Item>{lang}</List.Item>}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="Reviews" key="reviews">
                <List
                  itemLayout="vertical"
                  dataSource={user.reviews}
                  renderItem={review => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div className="flex justify-between items-center">
                            <Text strong>{review.client}</Text>
                            <Rate disabled defaultValue={review.rating} />
                          </div>
                        }
                        description={
                          <div>
                            <Text type="secondary">{review.project}</Text>
                            <Text type="secondary" className="ml-4">
                              {new Date(review.date).toLocaleDateString()}
                            </Text>
                          </div>
                        }
                      />
                      <Text>{review.comment}</Text>
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfilePage;