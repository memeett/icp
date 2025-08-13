import React, { useState, useCallback } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Steps, 
  Select, 
  InputNumber, 
  DatePicker, 
  Upload, 
  Tag, 
  Space,
  Typography,
  Row,
  Col,
  Divider,
  message
} from 'antd';
import { 
  PlusOutlined, 
  InboxOutlined, 
  EyeOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useJobs } from '../shared/hooks/useJobs';
import { createJob } from '../controller/jobController';
// Define Job type locally for now
interface Job {
  id?: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  deadline: string;
  skills: string[];
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  projectType: 'one-time' | 'ongoing';
  status: 'draft' | 'active' | 'closed';
  postedAt: string;
  applicants: number;
}

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Dragger } = Upload;

interface JobFormData {
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  deadline: string;
  skills: string[];
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  projectType: 'one-time' | 'ongoing';
  maxApplicants: number;
  attachments?: File[];
}

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useJobs();
  const [form] = Form.useForm<JobFormData>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<JobFormData>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const steps = [
    {
      title: 'Basic Info',
      description: 'Job title and category'
    },
    {
      title: 'Details',
      description: 'Description and requirements'
    },
    {
      title: 'Budget & Timeline',
      description: 'Budget and deadline'
    },
    {
      title: 'Review',
      description: 'Review and publish'
    }
  ];

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Digital Marketing',
    'Content Writing',
    'Graphic Design',
    'Video Editing',
    'Translation',
    'Virtual Assistant'
  ];

  const handleNext = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setFormData(prev => ({ ...prev, ...values }));
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }, [form]);

  const handlePrev = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  const handleAddSkill = useCallback(() => {
    if (skillInput && !skills.includes(skillInput)) {
      const newSkills = [...skills, skillInput];
      setSkills(newSkills);
      form.setFieldValue('skills', newSkills);
      setSkillInput('');
    }
  }, [skillInput, skills, form]);

  const handleRemoveSkill = useCallback((skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    form.setFieldValue('skills', newSkills);
  }, [skills, form]);

  const handleSubmit = useCallback(async (isDraft = false) => {
    try {
      const values = await form.validateFields();
      const allFormData = { ...formData, ...values };
      
      // Prepare job data for backend
      const jobName = allFormData.title;
      const jobDescription = [allFormData.description];
      const jobTags = skills;
      const jobSalary = allFormData.budget;
      const jobSlots = allFormData.maxApplicants;

      // Call backend createJob function
      const result = await createJob(jobName, jobDescription, jobTags, jobSalary, jobSlots);
      
      if (result[0] === 'Success') {
        message.success(`Job ${isDraft ? 'saved as draft' : 'published'} successfully!`);
        navigate('/manage');
      } else {
        message.error(result[1] || 'Failed to create job. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      message.error('Failed to create job. Please try again.');
    }
  }, [form, formData, skills, navigate]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Item
              name="title"
              label="Job Title"
              rules={[{ required: true, message: 'Please enter job title' }]}
            >
              <Input 
                size="large" 
                placeholder="e.g., Full Stack Developer for E-commerce Platform"
                maxLength={100}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select size="large" placeholder="Select job category">
                {categories.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="projectType"
              label="Project Type"
              rules={[{ required: true, message: 'Please select project type' }]}
            >
              <Select size="large" placeholder="Select project type">
                <Option value="one-time">One-time Project</Option>
                <Option value="ongoing">Ongoing Work</Option>
              </Select>
            </Form.Item>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Item
              name="description"
              label="Job Description"
              rules={[{ required: true, message: 'Please enter job description' }]}
            >
              <TextArea
                rows={6}
                placeholder="Describe your project in detail..."
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="experienceLevel"
              label="Experience Level"
              rules={[{ required: true, message: 'Please select experience level' }]}
            >
              <Select size="large" placeholder="Select required experience level">
                <Option value="entry">Entry Level</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="expert">Expert</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Required Skills">
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  onPressEnter={handleAddSkill}
                />
                <Button type="primary" onClick={handleAddSkill} icon={<PlusOutlined />}>
                  Add
                </Button>
              </Space.Compact>
              <div className="mt-2">
                {skills.map(skill => (
                  <Tag
                    key={skill}
                    closable
                    onClose={() => handleRemoveSkill(skill)}
                    className="mb-1"
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </Form.Item>

            <Form.Item label="Attachments (Optional)">
              <Dragger
                multiple
                beforeUpload={() => false}
                className="upload-area"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to upload</p>
                <p className="ant-upload-hint">
                  Support for documents, images, and other relevant files
                </p>
              </Dragger>
            </Form.Item>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Item
              name="budgetType"
              label="Budget Type"
              rules={[{ required: true, message: 'Please select budget type' }]}
            >
              <Select size="large" placeholder="Select budget type">
                <Option value="fixed">Fixed Price</Option>
                <Option value="hourly">Hourly Rate</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="budget"
              label="Budget Amount ($)"
              rules={[{ required: true, message: 'Please enter budget amount' }]}
            >
              <InputNumber
                size="large"
                min={1}
                max={100000}
                style={{ width: '100%' }}
                placeholder="Enter budget amount"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => Number(value!.replace(/\$\s?|(,*)/g, '')) as any}
              />
            </Form.Item>

            <Form.Item
              name="maxApplicants"
              label="Maximum Number of Applicants"
              rules={[{ required: true, message: 'Please enter maximum applicants' }]}
            >
              <InputNumber
                size="large"
                min={1}
                max={50}
                style={{ width: '100%' }}
                placeholder="Enter maximum number of applicants"
              />
            </Form.Item>

            <Form.Item
              name="deadline"
              label="Project Deadline"
              rules={[{ required: true, message: 'Please select deadline' }]}
            >
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                placeholder="Select deadline"
                disabledDate={(current) => current && current.valueOf() < Date.now()}
              />
            </Form.Item>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4">
              <Title level={4}>Job Preview</Title>
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}>{formData.title}</Title>
                  <Text type="secondary">{formData.category} • {formData.projectType}</Text>
                </Col>
                
                <Col span={24}>
                  <Text strong>Description:</Text>
                  <div className="mt-2">
                    <Text>{formData.description}</Text>
                  </div>
                </Col>
                
                <Col span={12}>
                  <Text strong>Budget:</Text>
                  <div>
                    <Text>${formData.budget} ({formData.budgetType})</Text>
                  </div>
                </Col>
                
                <Col span={12}>
                  <Text strong>Experience Level:</Text>
                  <div>
                    <Text className="capitalize">{formData.experienceLevel}</Text>
                  </div>
                </Col>
                
                <Col span={24}>
                  <Text strong>Required Skills:</Text>
                  <div className="mt-2">
                    {skills.map(skill => (
                      <Tag key={skill} color="blue">{skill}</Tag>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Title level={2}>Post a New Job</Title>
              <Text type="secondary">
                Create a detailed job posting to attract the best freelancers
              </Text>
            </div>

            <Card className="mb-6">
              <Steps current={currentStep} items={steps} />
            </Card>

            <Card>
              <Form
                form={form}
                layout="vertical"
                initialValues={formData}
                onValuesChange={(_, allValues) => setFormData(prev => ({ ...prev, ...allValues }))}
              >
                {renderStepContent()}

                <Divider />

                <div className="flex justify-between">
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    size="large"
                  >
                    Previous
                  </Button>

                  <Space>
                    {currentStep === steps.length - 1 && (
                      <Button
                        onClick={() => handleSubmit(true)}
                        loading={isLoading}
                        size="large"
                        icon={<SaveOutlined />}
                      >
                        Save as Draft
                      </Button>
                    )}
                    
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        onClick={handleNext}
                        size="large"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => handleSubmit(false)}
                        loading={isLoading}
                        size="large"
                        icon={<SendOutlined />}
                      >
                        Publish Job
                      </Button>
                    )}
                  </Space>
                </div>
              </Form>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJobPage;