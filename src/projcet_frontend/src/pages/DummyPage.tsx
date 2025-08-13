import React from 'react';
import DummyDataGenerator from '../components/DummyDataGenerator';
import ControllerDummyGenerator from '../components/ControllerDummyGenerator';
import { Typography, Card, Divider, Tabs } from 'antd';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const DummyPage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-5xl mx-auto shadow-md">
        <Title level={2} className="text-center mb-6">Dummy Data Generator</Title>
        
        <Paragraph className="text-gray-600 dark:text-gray-400 mb-4">
          This page provides tools for generating test data for development and testing purposes.
          Use these tools with caution as they can affect the data in the system.
        </Paragraph>
        
        <Divider />
        
        <Tabs defaultActiveKey="controller" className="mb-6">
          <TabPane tab="Using Controllers (Recommended)" key="controller">
            <ControllerDummyGenerator />
          </TabPane>
          <TabPane tab="Direct Canister Access" key="direct">
            <DummyDataGenerator />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default DummyPage;
