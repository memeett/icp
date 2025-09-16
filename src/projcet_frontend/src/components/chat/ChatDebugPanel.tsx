import React, { useState } from 'react';
import { Card, Button, Space, Typography, Alert, Divider } from 'antd';
import { BugOutlined, ReloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import ChatService from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text, Paragraph } = Typography;

interface ChatDebugPanelProps {
  onRefresh?: () => void;
}

const ChatDebugPanel: React.FC<ChatDebugPanelProps> = ({ onRefresh }) => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebugCheck = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      console.log('🔍 Running chat debug check...');

      // Test different query strategies
      const results = {
        userId: user.id,
        strategies: {
          filtered: null,
          allThenFilter: null,
          manual: null
        },
        errors: []
      };

      // Strategy 1: Filtered query
      try {
        const { data: filtered, error: filterError } = await ChatService.supabase
          .from('chat_rooms')
          .select('*')
          .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
          .eq('status', 'active')
          .order('updated_at', { ascending: false });

        results.strategies.filtered = {
          count: filtered?.length || 0,
          data: filtered,
          error: filterError
        };
      } catch (error) {
        results.errors.push(`Filtered query: ${error}`);
      }

      // Strategy 2: All rooms then filter
      try {
        const { data: allRooms, error: allError } = await ChatService.supabase
          .from('chat_rooms')
          .select('*')
          .eq('status', 'active')
          .order('updated_at', { ascending: false });

        const filtered = allRooms?.filter(room =>
          room.client_id === user.id || room.freelancer_id === user.id
        ) || [];

        results.strategies.allThenFilter = {
          total: allRooms?.length || 0,
          filtered: filtered.length,
          error: allError
        };
      } catch (error) {
        results.errors.push(`All rooms query: ${error}`);
      }

      // Strategy 3: Manual separate queries
      try {
        const [clientRooms, freelancerRooms] = await Promise.all([
          ChatService.supabase
            .from('chat_rooms')
            .select('*')
            .eq('status', 'active')
            .eq('client_id', user.id),
          ChatService.supabase
            .from('chat_rooms')
            .select('*')
            .eq('status', 'active')
            .eq('freelancer_id', user.id)
        ]);

        const combined = [
          ...(clientRooms.data || []),
          ...(freelancerRooms.data || [])
        ];

        const unique = combined.filter((room, index, self) =>
          index === self.findIndex(r => r.id === room.id)
        );

        results.strategies.manual = {
          client: clientRooms.data?.length || 0,
          freelancer: freelancerRooms.data?.length || 0,
          combined: unique.length,
          error: clientRooms.error || freelancerRooms.error
        };
      } catch (error) {
        results.errors.push(`Manual query: ${error}`);
      }

      setDebugInfo(results);
      console.log('🔍 Debug results:', results);

    } catch (error) {
      console.error('Debug check failed:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearChatData = async () => {
    if (!confirm('Are you sure you want to clear all chat data? This cannot be undone!')) return;

    try {
      await ChatService.supabase.from('messages').delete().neq('id', '');
      await ChatService.supabase.from('chat_rooms').delete().neq('id', '');
      alert('Chat data cleared successfully');
      onRefresh?.();
    } catch (error) {
      alert('Failed to clear chat data: ' + error);
    }
  };

  return (
    <Card
      title={
        <Space>
          <BugOutlined />
          Chat Debug Panel
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button
            onClick={runDebugCheck}
            loading={loading}
            icon={<DatabaseOutlined />}
            size="small"
          >
            Run Debug Check
          </Button>

          <Button
            onClick={() => onRefresh?.()}
            icon={<ReloadOutlined />}
            size="small"
          >
            Refresh Chat
          </Button>

          <Button
            danger
            onClick={clearChatData}
            size="small"
          >
            Clear All Data
          </Button>
        </Space>

        {debugInfo && (
          <>
            <Divider />
            <div>
              <Title level={5}>Debug Results for User: {debugInfo.userId}</Title>

              {debugInfo.error && (
                <Alert message={debugInfo.error} type="error" showIcon />
              )}

              {!debugInfo.error && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card size="small" title="Strategy 1: Filtered Query">
                    <Text>Count: {debugInfo.strategies.filtered?.count || 0}</Text>
                    {debugInfo.strategies.filtered?.error && (
                      <Alert message={debugInfo.strategies.filtered.error.message} type="error" showIcon />
                    )}
                  </Card>

                  <Card size="small" title="Strategy 2: All Rooms + Filter">
                    <Text>Total: {debugInfo.strategies.allThenFilter?.total || 0}</Text><br />
                    <Text>Filtered: {debugInfo.strategies.allThenFilter?.filtered || 0}</Text>
                  </Card>

                  <Card size="small" title="Strategy 3: Manual Queries">
                    <Text>Client rooms: {debugInfo.strategies.manual?.client || 0}</Text><br />
                    <Text>Freelancer rooms: {debugInfo.strategies.manual?.freelancer || 0}</Text><br />
                    <Text>Combined: {debugInfo.strategies.manual?.combined || 0}</Text>
                  </Card>

                  {debugInfo.errors.length > 0 && (
                    <Alert
                      message="Errors encountered:"
                      description={debugInfo.errors.map((err: string, i: number) => (
                        <div key={i}>• {err}</div>
                      ))}
                      type="warning"
                      showIcon
                    />
                  )}
                </Space>
              )}
            </div>
          </>
        )}

        <Alert
          message="Debug Information"
          description={
            <div>
              <Paragraph>This panel helps diagnose chat room filtering issues.</Paragraph>
              <Paragraph>
                <strong>Expected behavior:</strong> Each user should only see chat rooms where they are either the client or freelancer.
              </Paragraph>
              <Paragraph>
                <strong>If seeing wrong rooms:</strong> Check Supabase RLS policies or run the SQL fix script.
              </Paragraph>
            </div>
          }
          type="info"
          showIcon
        />
      </Space>
    </Card>
  );
};

export default ChatDebugPanel;
