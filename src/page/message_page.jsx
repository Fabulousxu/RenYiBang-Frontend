import React, {useEffect, useState} from 'react';
import {Layout, message} from 'antd';
import BasicLayout from "../component/basic_layout";
import ChatList from "../component/chat_list";
import ChatWindow from "../component/chat_window";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {getChatList} from "../service/chat";

export default function MessagePage() {
  const [self, setSelf] = useState({});
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState(null);
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    getChatList().then((res) => {
      setSelf(res.self)
      setChatList(res.chats)
    }).catch(err => messageApi.open({type: 'error', content: err}))
  }, []);

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
        {chat ? <ChatWindow chat={chat}/> : <div style={{textAlign: 'center', marginTop: '20%'}}>
          <h2 style={{color: 'gray'}}>选择一个聊天</h2>
        </div>}
      </Content>
    </Layout>
  </BasicLayout>);
}
