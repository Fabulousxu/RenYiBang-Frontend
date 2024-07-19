import React, {useEffect, useRef, useState} from 'react';
import {Card, List, Input, Button, Avatar, Row, Col, Divider} from 'antd';
import connectWebSocket from '../service/chat';
import TextArea from "antd/es/input/TextArea";

export default function ChatWindow(props) {
  const {chat} = props
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const ws = connectWebSocket({
      userId: chat.senderId,
      onopen: () => console.log('WebSocket connection opened' + chat.senderId),
      onmessage: (data) => handleIncomingMessage(data),
      onclose: () => console.log('WebSocket connection closed' + chat.senderId),
    });

    setSocket(ws);

    return () => {
      if (ws) {
        ws.send(JSON.stringify({type: 'unregister', userId: chat.senderId}));
        ws.close();
      }
    };
  }, [chat.senderId]);

  const handleIncomingMessage = (data) => {
    try {
      const message = JSON.parse(data);
      if (message.taskChatId === chat.taskChatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const handleSend = () => {
    if (message && socket) {
      const newMessage = {
        type: 'task',
        chatId: chat.taskChatId,
        senderId: chat.senderId,
        receiverId: chat.receiverId,
        content: message,
      };
      socket.send(JSON.stringify(newMessage));
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (<Card
    title={props.chat?.chatter.nickname}
    style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
    <div style={{flex: 1, overflowY: 'auto', padding: '10px', height: '40vh'}}>
      <List
        dataSource={messages}
        renderItem={(item) => (<div style={{
          display: 'flex',
          marginBottom: '10px',
          justifyContent: item.senderId === chat.senderId ? 'flex-end' : 'flex-start'
        }}>
          {item.senderId !== chat.senderId &&
            <Avatar src={item.avatar} style={{marginRight: '10px'}}/>}
          <div style={{
            maxWidth: '60%',
            backgroundColor: item.senderId === chat.senderId ? '#1677FF' : '#f1f0f0',
            color: item.senderId === chat.senderId ? '#fff' : '#000',
            padding: '10px',
            borderRadius: '15px',
            wordWrap: 'break-word'
          }}>
            {item.content}
          </div>
          {item.senderId === chat.senderId &&
            <Avatar src={item.avatar} style={{marginLeft: '10px'}}/>}
        </div>)}
      />
      <div ref={messagesEndRef}/>
    </div>
    <Divider/>
    <Row style={{width: '100%', alignItems: 'center'}}>
      <Col style={{flexGrow: 1}}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息"
          onPressEnter={handleSend}
          style={{height: '3rem'}}
        />
      </Col>
      <Col style={{marginLeft: '15px'}}>
        <Button type="primary" onClick={handleSend}>发送</Button>
      </Col>
    </Row>
  </Card>);
}
