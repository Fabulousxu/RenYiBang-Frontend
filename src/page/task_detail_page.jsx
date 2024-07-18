import React, {useEffect, useState, useCallback} from "react";
import BasicLayout from "../component/basic_layout";
import ItemDetail from "../component/item_detail";
import CommentList, {totalCommentEntry} from "../component/comment_list";
import {getTask, getTaskComment, getTaskMessage, collectTask, uncollectTask} from "../service/task";
import {MessageOutlined, PayCircleOutlined, StarOutlined} from "@ant-design/icons";
import {Button, FloatButton, Space} from "antd";
import {useParams} from "react-router-dom";

export default function TaskDetailPage(props) {
  const {id} = useParams();
  const [detail, setDetail] = useState(null);
  const [mode, setMode] = useState('comment');
  const [commentTotal, setCommentTotal] = useState(0);
  const [messageTotal, setMessageTotal] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const getCommentWhenCommentMode = useCallback(() => {
    getTaskComment(id, totalCommentEntry, 0, 'time').then(res => {
      setCommentTotal(res.total);
      setCommentList(res.items);
    }).catch(err => {
    });
    getTaskMessage(id, totalCommentEntry, 0, 'time').then(res => {
      setMessageTotal(res.total);
    }).catch(err => {
    });
  }, [id]);

  const getCommentWhenMessageMode = () => {
    getTaskMessage(id, totalCommentEntry, 0, 'time').then(res => {
      setMessageTotal(res.total);
      setCommentList(res.items);
    }).catch(err => {
    });
    getTaskComment(id, totalCommentEntry, 0, 'time').then(res => {
      setCommentTotal(res.total);
    }).catch(err => {
    });
  };

  useEffect(() => {
    getTask(id).then(res => {
      console.log(res);
      setDetail(res);
    }).catch(err => {
    });
    getCommentWhenCommentMode();
  }, [id, getCommentWhenCommentMode]);

  function handleCollect() {
    if (detail.collected) {
      uncollectTask(id).then(res => {
        setDetail({...detail, collected: false});
      }).catch(err => {
      });
    } else {
      collectTask(id).then(res => {
        setDetail({...detail, collected: true});
      }).catch(err => {
      });
    }
  }

  function handleChat() {
    // 将任务发起者添加为聊天对象，跳转到聊天页面

  }

  function handleAccept() {
    // 接受任务，跳转到任务详情页面

  }

  return (<BasicLayout page="task-detail">
    <ItemDetail detail={detail} descriptionTitle="任务描述" ratingTitle='任务评分:'/>
    <Space style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
      {detail && detail.collected ? <Button type="primary" size="large" onClick={handleCollect}><StarOutlined/>取消收藏</Button> :
        <Button size="large" onClick={handleCollect}><StarOutlined/>收藏</Button>}
      <Button size="large" onClick={handleChat}>><MessageOutlined/>聊一聊</Button>
      <Button type="primary" size="large" onClick={handleAccept}>><PayCircleOutlined/>接任务</Button>
    </Space>
    <div style={{height: '60px'}}></div>
    <CommentList
      commentTotal={commentTotal}
      messageTotal={messageTotal}
      list={commentList}
      total={mode === 'comment' ? commentTotal : messageTotal}
      currentPage={currentPage}
      onChangeMode={key => {
        setMode(key);
        setCurrentPage(0);
        (key === 'comment' ? getCommentWhenCommentMode : getCommentWhenMessageMode)();
      }}
      onChange={(page, pageSize) => {
        (mode === 'comment' ? getTaskComment : getTaskMessage)(id, pageSize, page - 1, 'time')
          .then(res => {
            setCommentTotal(res.total);
            setCommentList(res.items);
            setCurrentPage(page);
          }).catch(err => {
        });
      }}
    />
  </BasicLayout>);
}
