import React, {useEffect, useRef, useState} from 'react';
import {Card, List, Input, Button, Avatar, Row, Col, Divider} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {getChatHistory} from "../service/chat";

export default function ChatWindow(props) {
  const selfId = props.self?.userId
  const [hasHistory, setHasHistory] = useState(true)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const getHistory = () => {
    if (!hasHistory) return
    getChatHistory(props.chat?.chatId, messages.length > 0 ? messages[0].messageId : '', 10)
      .then(res => {
        if (res.length === 0) {
          setHasHistory(false)
          return
        }
        setMessages(messages => [...res.reverse(), ...messages])
      }).catch(error => console.error(error))
  }
  const onsend = () => {
    if (message) {
      props.socket.send({
        type: '', chatId: props.chat?.chatId, content: message
      })
      setMessage('')
    }
  }

  useEffect(() => {
    getChatHistory(props.chat?.chatId, messages.length > 0 ? messages[0].messageId : '', 10)
      .then(res => {
        setMessages(res.reverse())
        messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
        setHasHistory(true)
      }).catch(error => console.error(error))
  }, [props.chat])

  useEffect(() => {
    if (props.socket) {
      props.socket.onmessage = data => {
        setMessages(messages => [...messages, data])
      }
    }
  }, [props.socket]);

  return (<Card
    title={props.chat?.chatter.nickname}
    style={{
      display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100vh - 10rem - 72px)'
    }}>
    <div style={{
      flex: 1,
      overflowY: 'auto',
      height: 'calc(100vh - 10rem - 271px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <a onClick={getHistory}
         style={{
           fontSize: '0.8rem', color: hasHistory ? '' : 'gray'
         }}>{hasHistory ? '获取更多聊天记录' : '无更多聊天记录'}< /a>
      <List
        dataSource={messages}
        style={{width: '100%'}}
        renderItem={item => <div style={{
          display: 'flex',
          margin: '10px',
          justifyContent: item.senderId === selfId ? 'flex-end' : 'flex-start'
        }}>
          {item.senderId !== selfId && <Avatar src={item.avatar} style={{marginRight: '10px'}}/>}
          <div style={{
            maxWidth: '70%',
            backgroundColor: item.senderId === selfId ? '#1677FF' : '#f1f0f0',
            color: item.senderId === selfId ? '#fff' : '#000',
            padding: '10px',
            borderRadius: '15px',
            wordWrap: 'break-word'
          }}>{item.content}</div>
          {item.senderId === selfId && <Avatar src={item.avatar} style={{marginLeft: '10px'}}/>}
        </div>}
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
          onPressEnter={onsend}
          style={{height: '3rem'}}
        />
      </Col>
      <Col style={{marginLeft: '15px'}}>
        <Button type="primary" onClick={onsend}>发送</Button>
      </Col>
    </Row>
  </Card>);
}
