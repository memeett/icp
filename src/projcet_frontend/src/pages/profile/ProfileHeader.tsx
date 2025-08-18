import React from 'react';
import { Row, Col, Avatar, Typography, Button, Space } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import { User } from '../../shared/types/User';
import { DescriptionsContext } from 'antd/es/descriptions';

const { Title, Text } = Typography;

interface ProfileHeaderProps {
  user: User;
  profileImage: string | null;
  onEdit: () => void;
  
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profileImage, onEdit }) => {
  return (
    <Row gutter={[24, 24]} align="middle">
      <Col xs={24} sm={6} className="text-center">
        <Avatar size={120} src={profileImage} icon={<UserOutlined />} />
      </Col>
      <Col xs={24} sm={12}>
        <Title level={2} className="mb-2">{user.username || 'N/A'}</Title>
        <Space direction="vertical" size="small">
          <Space>
            {/* <Descriptions */}
            <Text>{user.description}</Text>
          </Space>
        </Space>
      </Col>
      <Col xs={24} sm={6} className="text-center">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={onEdit}
          block
        >
          Edit Profile
        </Button>
      </Col>
    </Row>
  );
};

export default ProfileHeader;