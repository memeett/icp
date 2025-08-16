import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Avatar,
  Row,
  Col,
  DatePicker,
} from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { User } from '../../shared/types/User';
import { JobCategory } from '../../shared/types/Job';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface EditProfileModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  user: User;
  profileImage: string | null;
  handleAvatarUpload: (options: any) => void;
  mockJobCategories: JobCategory[];
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onCancel,
  onSave,
  user,
  profileImage,
  handleAvatarUpload,
  mockJobCategories,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? dayjs(user.dob) : null,
        preference: user.preference?.map(p => p.id) || [],
      });
    }
  }, [user, form]);

  return (
    <Modal
      title="Edit Profile"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
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
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;