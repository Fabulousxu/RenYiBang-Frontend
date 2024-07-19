import React from 'react';
import {List, Avatar, Row, Card, Col} from 'antd';

export default function ChatList(props) {
  return (<List
    itemLayout="horizontal"
    dataSource={props.list}
    renderItem={(item, index) => <List.Item onClick={() => props.onChat(item)}>
      <Row style={{width: '100%'}}>
        <Col style={{flexGrow: 1}}>
          <List.Item.Meta
            avatar={<Avatar src={item?.chatter.avatar}/>}
            title={item?.chatter.nickname}
            description={<div style={{
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>{item?.lastMessageContent}</div>}
          />
        </Col>
        <Col style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
          <div style={{color: 'gray'}}>{item?.lastMessageCreatedAt}</div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            backgroundColor: 'red',
            width: '20px',
            height: '20px',
            borderRadius: '100%',
            visibility: item?.unreadCount > 0 ? 'visible' : 'hidden'
          }}>{item?.unreadCount > 99 ? 99 : item?.unreadCount}</div>
        </Col>
      </Row>
    </List.Item>}
  />);
}
