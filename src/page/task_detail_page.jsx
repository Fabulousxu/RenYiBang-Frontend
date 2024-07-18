import React, {useEffect, useState, useCallback} from "react";
import BasicLayout from "../component/basic_layout";
import ItemDetail from "../component/item_detail";
import CommentList, {totalCommentEntry} from "../component/comment_list";
import {
  getTask, getTaskComment, getTaskMessage, likeComment, likeMessage, unlikeComment, unlikeMessage
} from "../service/task";
import {MessageOutlined, PayCircleOutlined, StarOutlined} from "@ant-design/icons";
import {Button, FloatButton, message, Space} from "antd";
import {useParams} from "react-router-dom";

export default function TaskDetailPage(props) {
  const {id} = useParams();
  const [detail, setDetail] = useState(null);
  const [mode, setMode] = useState('comment');
  const [commentTotal, setCommentTotal] = useState(0);
  const [messageTotal, setMessageTotal] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [messageApi, contextHolder] = message.useMessage()

  const getCommentWhenCommentMode = useCallback(() => {
    getTaskComment(id, totalCommentEntry, 0, 'time').then(res => {
      setCommentTotal(res.total);
      setCommentList(res.items);
    }).catch(err => messageApi.open({type: 'error', content: err}))
    getTaskMessage(id, totalCommentEntry, 0, 'time').then(res => {
      setMessageTotal(res.total);
    }).catch(err => messageApi.open({type: 'error', content: err}))
  }, [id]);

  const getCommentWhenMessageMode = () => {
    getTaskMessage(id, totalCommentEntry, 0, 'time').then(res => {
      setMessageTotal(res.total);
      setCommentList(res.items);
    }).catch(err => messageApi.open({type: 'error', content: err}))
    getTaskComment(id, totalCommentEntry, 0, 'time').then(res => {
      setCommentTotal(res.total);
    }).catch(err => messageApi.open({type: 'error', content: err}))
  };

  useEffect(() => {
    getTask(id).then(res => {
      console.log(res);
      setDetail(res);
    }).catch(err => messageApi.open({type: 'error', content: err}))
    getCommentWhenCommentMode();
  }, [id, getCommentWhenCommentMode]);

  return (<BasicLayout page="task-detail">
    <ItemDetail detail={detail} descriptionTitle="任务描述" ratingTitle='任务评分:'/>
    <Space style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
      <Button size='large'><StarOutlined/>收藏</Button>
      <Button size="large"><MessageOutlined/>聊一聊</Button>
      <Button type="primary" size="large"><PayCircleOutlined/>接任务</Button>
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
          }).catch(err => messageApi.open({type: 'error', content: err}))
      }}
      onLike={index => {
        if (commentList[index].liked) {
          (mode === 'comment' ? unlikeComment : unlikeMessage)(mode === 'comment' ? commentList[index].taskCommentId : commentList[index].taskMessageId).then(res => {
            commentList[index].liked = false
            commentList[index].likedNumber--
            setCommentList([...commentList])
            messageApi.open({type: 'success', content: '取消点赞成功'})
          }).catch(err => messageApi.open({type: 'error', content: err}))
        } else {
          (mode === 'comment' ? likeComment : likeMessage)(mode === 'comment' ? commentList[index].taskCommentId : commentList[index].taskMessageId).then(res => {
            commentList[index].liked = true
            commentList[index].likedNumber++
            setCommentList([...commentList])
            messageApi.open({type: 'success', content: '点赞成功'})
          }).catch(err => messageApi.open({type: 'error', content: err}))
        }
      }}
    />
  </BasicLayout>);
}
