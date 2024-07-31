import React, {useEffect, useState} from 'react';
import {Layout, message} from 'antd';
import BasicLayout from "../component/basic_layout";
import ChatList from "../component/chat_list";
import ChatWindow from "../component/chat_window";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import connectWebSocket, {getChatList} from "../service/chat";

export default function MessagePage() {
  const [self, setSelf] = useState(null)
  const [chatList, setChatList] = useState([])
  const [chat, setChat] = useState(null)
  const [socket, setSocket] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    getChatList().then(res => {
      setSelf(res.self)
      setChatList(res.chats)
      setChat(res.chats[0])
    }).catch(error => messageApi.error(error))
  }, [])

  useEffect(() => {
    if (self) {
      let ws = connectWebSocket(self.userId)
      setSocket(ws)
      return () => {
        if (ws) ws.close()
      }
    }
  }, [self])

  return (<BasicLayout page='message'>
    <Layout style={{background: '#fff'}}>
      <Sider
        width={324}
        style={{background: '#fff', borderRight: '1px solid #e8e8e8', paddingRight: '24px'}}>
        <ChatList
          list={chatList}
          onChat={setChat}
        />
      </Sider>
      <Content
        style={{paddingLeft: '24px', display: 'flex', flexDirection: 'column'}}>
        {chat ? <ChatWindow chat={chat} self={self} socket={socket}/> :
          <div style={{textAlign: 'center', marginTop: '20%'}}>
            <h2 style={{color: 'gray'}}>暂无聊天</h2>
          </div>}
      </Content>
    </Layout>
  </BasicLayout>);
}
