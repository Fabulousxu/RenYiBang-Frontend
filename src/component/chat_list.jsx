import React from 'react';
import { List, Avatar } from 'antd';

const chatData = [
  {
    title: 'User 1',
    senderId: 2,
    receiverId:12,
    taskChatId: 1,
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
  },
  {
    title: 'User 2',
    senderId: 12,
    receiverId: 2,
    taskChatId: 1,
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
  },
  // Add more chat data as needed
];

const ChatList = ({ onChatSelect }) => (
  <List
    itemLayout="horizontal"
    dataSource={chatData}
    renderItem={(item) => (
      <List.Item onClick={() => onChatSelect(item)}>
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={item.title}
        />
      </List.Item>
    )}
  />
);

export default ChatList;
