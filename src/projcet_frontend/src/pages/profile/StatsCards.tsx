import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { DollarOutlined, StarOutlined, ProjectOutlined } from '@ant-design/icons';
import { User } from '../../shared/types/User';

const { Text } = Typography;

interface StatsCardsProps {
  user: User;
  jobsCompleted: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ user, jobsCompleted }) => {
  return (
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
          <div className="text-xl font-bold">{jobsCompleted}</div>
          <Text type="secondary">Jobs Completed</Text>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;