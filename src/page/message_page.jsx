import React, { useState } from 'react';
import { Layout } from 'antd';
import BasicLayout from "../component/basic_layout";
import ChatList from "../component/chat_list";
import ChatWindow from "../component/chat_window";

const { Sider, Content } = Layout;

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <BasicLayout page='message'>
      <Layout style={{ background: '#fff' }}>
        <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #e8e8e8', overflow: 'auto' }}>
          <ChatList onChatSelect={setSelectedChat} />
        </Sider>
        <Content style={{ padding: '24px', minHeight: 280, display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <ChatWindow chat={selectedChat} />
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20%' }}>
              <h2>Select a chat to start messaging</h2>
            </div>
          )}
        </Content>
      </Layout>
    </BasicLayout>
  );
}
