import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Avatar, 
  Rate, 
  Tag, 
  Space, 
  Typography, 
  Slider, 
  Checkbox, 
  Divider,
  Empty,
  Spin,
  Pagination
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  UserOutlined, 
  DollarOutlined, 
  StarOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useDebounce } from '../shared/hooks/useDebounce';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock freelancer data
const mockFreelancers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Full Stack Developer',
    avatar: '',
    rating: 4.9,
    reviewsCount: 47,
    hourlyRate: 85,
    location: 'New York, USA',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    completedJobs: 32,
    responseTime: '1 hour',
    availability: 'Available',
    bio: 'Experienced full-stack developer specializing in modern web applications with React and Node.js.',
    languages: ['English', 'Spanish'],
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'UI/UX Designer',
    avatar: '',
    rating: 4.8,
    reviewsCount: 23,
    hourlyRate: 65,
    location: 'San Francisco, USA',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    completedJobs: 18,
    responseTime: '30 minutes',
    availability: 'Available',
    bio: 'Creative UI/UX designer with a passion for creating intuitive and beautiful user experiences.',
    languages: ['English', 'Mandarin'],
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Mobile App Developer',
    avatar: '',
    rating: 4.7,
    reviewsCount: 31,
    hourlyRate: 75,
    location: 'Austin, USA',
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    completedJobs: 25,
    responseTime: '2 hours',
    availability: 'Busy',
    bio: 'Mobile app developer with expertise in cross-platform development using React Native and Flutter.',
    languages: ['English', 'Spanish'],
    lastActive: '4 hours ago'
  }
];

const BrowseFreelancerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedFreelancers, setSavedFreelancers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Digital Marketing',
    'Content Writing',
    'Graphic Design',
    'Video Editing'
  ];

  const skills = [
    'React', 'Node.js', 'TypeScript', 'Python', 'Java', 'PHP',
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
    'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'
  ];

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    // TODO: Implement actual search
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [debouncedSearchTerm, selectedCategory, priceRange, selectedSkills, availability, sortBy]);

  const handleSaveFreelancer = useCallback((freelancerId: string) => {
    setSavedFreelancers(prev => 
      prev.includes(freelancerId) 
        ? prev.filter(id => id !== freelancerId)
        : [...prev, freelancerId]
    );
  }, []);

  const handleContactFreelancer = useCallback((freelancerId: string) => {
    // TODO: Implement contact functionality
    console.log('Contacting freelancer:', freelancerId);
  }, []);

  const FreelancerCard = ({ freelancer }: { freelancer: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        hoverable
        className="h-full"
        actions={[
          <Button
            key="save"
            type="text"
            icon={savedFreelancers.includes(freelancer.id) ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => handleSaveFreelancer(freelancer.id)}
            className={savedFreelancers.includes(freelancer.id) ? 'text-red-500' : ''}
          >
            Save
          </Button>,
          <Button
            key="contact"
            type="text"
            icon={<MessageOutlined />}
            onClick={() => handleContactFreelancer(freelancer.id)}
          >
            Contact
          </Button>,
          <Button
            key="view"
            type="text"
            onClick={() => navigate(`/profile/${freelancer.id}`)}
          >
            View Profile
          </Button>
        ]}
      >
        <div className="text-center mb-4">
          <Avatar size={64} src={freelancer.avatar} icon={<UserOutlined />} />
          <div className="mt-2">
            <Title level={4} className="mb-1">{freelancer.name}</Title>
            <Text type="secondary">{freelancer.title}</Text>
          </div>
        </div>

        <div className="mb-4">
          <Space className="w-full justify-center">
            <Rate disabled defaultValue={freelancer.rating} allowHalf />
            <Text>({freelancer.reviewsCount})</Text>
          </Space>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <Text type="secondary">Hourly Rate:</Text>
            <Text strong>${freelancer.hourlyRate}/hr</Text>
          </div>
          <div className="flex justify-between">
            <Text type="secondary">Jobs Completed:</Text>
            <Text>{freelancer.completedJobs}</Text>
          </div>
          <div className="flex justify-between">
            <Text type="secondary">Response Time:</Text>
            <Text>{freelancer.responseTime}</Text>
          </div>
        </div>

        <div className="mb-4">
          <Space>
            <EnvironmentOutlined />
            <Text type="secondary">{freelancer.location}</Text>
          </Space>
        </div>

        <div className="mb-4">
          <Text type="secondary" className="block mb-2">Skills:</Text>
          <Space wrap>
            {freelancer.skills.slice(0, 4).map((skill: string) => (
              <Tag key={skill} color="blue">{skill}</Tag>
            ))}
            {freelancer.skills.length > 4 && (
              <Tag>+{freelancer.skills.length - 4} more</Tag>
            )}
          </Space>
        </div>

        <div className="mb-4">
          <Text type="secondary" className="text-sm">{freelancer.bio}</Text>
        </div>

        <div className="flex justify-between items-center">
          <Space>
            <div className={`w-2 h-2 rounded-full ${
              freelancer.availability === 'Available' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <Text type="secondary" className="text-sm">{freelancer.availability}</Text>
          </Space>
          <Text type="secondary" className="text-sm">
            <ClockCircleOutlined className="mr-1" />
            {freelancer.lastActive}
          </Text>
        </div>
      </Card>
    </motion.div>
  );

  const FilterSidebar = () => (
    <Card title="Filters" className="mb-6">
      <div className="space-y-6">
        <div>
          <Text strong className="block mb-2">Category</Text>
          <Select
            placeholder="Select category"
            style={{ width: '100%' }}
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong className="block mb-2">Hourly Rate ($)</Text>
          <Slider
            range
            min={0}
            max={200}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            marks={{
              0: '$0',
              50: '$50',
              100: '$100',
              150: '$150',
              200: '$200+'
            }}
          />
          <div className="text-center mt-2">
            <Text type="secondary">
              ${priceRange[0]} - ${priceRange[1]}/hr
            </Text>
          </div>
        </div>

        <div>
          <Text strong className="block mb-2">Skills</Text>
          <Select
            mode="multiple"
            placeholder="Select skills"
            style={{ width: '100%' }}
            value={selectedSkills}
            onChange={setSelectedSkills}
            maxTagCount={3}
          >
            {skills.map(skill => (
              <Option key={skill} value={skill}>{skill}</Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong className="block mb-2">Availability</Text>
          <Select
            placeholder="Select availability"
            style={{ width: '100%' }}
            value={availability}
            onChange={setAvailability}
            allowClear
          >
            <Option value="Available">Available</Option>
            <Option value="Busy">Busy</Option>
          </Select>
        </div>

        <Button
          type="primary"
          block
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={isLoading}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
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
          <div className="text-center mb-8">
            <Title level={2}>Browse Freelancers</Title>
            <Text type="secondary">
              Find the perfect freelancer for your project
            </Text>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Input
                  size="large"
                  placeholder="Search freelancers..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  size="large"
                  placeholder="Sort by"
                  style={{ width: '100%' }}
                  value={sortBy}
                  onChange={setSortBy}
                >
                  <Option value="rating">Highest Rated</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                  <Option value="recent">Most Recent</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={10}>
                <div className="flex justify-end">
                  <Text type="secondary">
                    Showing {mockFreelancers.length} freelancers
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          <Row gutter={[24, 24]}>
            {/* Filters Sidebar */}
            <Col xs={24} lg={6}>
              <FilterSidebar />
            </Col>

            {/* Freelancers Grid */}
            <Col xs={24} lg={18}>
              {isLoading ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : mockFreelancers.length > 0 ? (
                <>
                  <Row gutter={[16, 16]}>
                    {mockFreelancers.map(freelancer => (
                      <Col xs={24} sm={12} lg={8} key={freelancer.id}>
                        <FreelancerCard freelancer={freelancer} />
                      </Col>
                    ))}
                  </Row>
                  
                  <div className="text-center mt-8">
                    <Pagination
                      current={currentPage}
                      total={50}
                      pageSize={9}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                </>
              ) : (
                <Card>
                  <Empty
                    description="No freelancers found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </Card>
              )}
            </Col>
          </Row>
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseFreelancerPage;