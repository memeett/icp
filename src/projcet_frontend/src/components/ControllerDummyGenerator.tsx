import React, { useState } from 'react';
import { Button, Card, Input, Space, Typography, Progress, Alert, Divider, message, Radio } from 'antd';
import { seedDummyDataWithControllers } from '../utils/dummyDataWithControllers';
import { seedDummyDataAlternative } from '../utils/dummyDataAlternative';

const { Title, Text, Paragraph } = Typography;

const ControllerDummyGenerator: React.FC = () => {
  // State
  const [counts, setCounts] = useState({
    jobs: 5
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCountChange = (field: keyof typeof counts, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCounts(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleGenerateData = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResults(null);
    setError(null);
    
    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Call the controller-based dummy data generator
      const result = await seedDummyDataWithControllers({
        users: 0, // We don't generate users since we need authentication
        jobs: counts.jobs
      });
      
      // Clear interval and set final state
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        setResults(result.data);
        message.success(result.message);
      } else {
        setError(result.message);
        message.error(result.message);
      }
    } catch (error) {
      setError(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
      message.error('Failed to generate dummy data');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <Title level={4}>Generate Dummy Data with Controllers</Title>
      <Paragraph className="text-gray-500">
        This tool uses your existing controllers to generate dummy data. You must be logged in to use this feature.
      </Paragraph>
      
      <Divider />
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Text className="w-24">Jobs:</Text>
          <Input
            type="number"
            min={0}
            max={50}
            value={counts.jobs}
            onChange={e => handleCountChange('jobs', e.target.value)}
            className="w-24"
            disabled={isGenerating}
          />
          <Text className="text-gray-500 text-sm">Max: 50</Text>
        </div>
        
        <div className="pt-4">
          <Button
            type="primary"
            onClick={handleGenerateData}
            loading={isGenerating}
            disabled={counts.jobs <= 0}
            className="w-full md:w-auto"
          >
            {isGenerating ? 'Generating...' : 'Generate Dummy Data'}
          </Button>
        </div>
        
        {isGenerating && (
          <div className="mt-4">
            <Text>Generating dummy data... {progress}%</Text>
            <Progress percent={progress} status="active" />
          </div>
        )}
        
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mt-4"
          />
        )}
        
        {results && (
          <div className="mt-6 border p-4 rounded-md bg-gray-50">
            <Title level={5}>Generation Results</Title>
            <div className="mt-2">
              <Text strong>Jobs Created: </Text>
              <Text>{results.jobs?.length || 0}</Text>
            </div>
            
            {results.jobs && results.jobs.length > 0 && (
              <div className="mt-4">
                <Text strong>Job Details:</Text>
                <ul className="mt-2 pl-5 list-disc">
                  {results.jobs.map((job: any, index: number) => (
                    <li key={index} className="text-sm">
                      {job.name} (ID: {job.id})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ControllerDummyGenerator;
