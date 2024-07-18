import BasicLayout from "../component/basic_layout";
import {useParams} from "react-router-dom";
import ItemDetail from "../component/item_detail";
import React, {useEffect, useState} from "react";
import CommentList, {totalCommentEntry} from "../component/comment_list";
import {accessService, getService, getServiceComment, getServiceMessage, unaccessService} from "../service/service";
import {Button, message, Space} from "antd";
import {MessageOutlined, PayCircleOutlined, StarOutlined} from "@ant-design/icons";
import {collectService, uncollectService} from "../service/service";
import {accessTask, collectTask, unaccessTask, uncollectTask} from "../service/task";

export default function TaskDetailPage(props) {
  const {id} = useParams()
  const [detail, setDetail] = useState(null)
  const [mode, setMode] = useState('comment')
  const [commentTotal, setCommentTotal] = useState(0)
  const [messageTotal, setMessageTotal] = useState(0)
  const [commentList, setCommentList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

  const getCommentWhenCommentMode = () => {
    getServiceComment(id, totalCommentEntry, 0, 'time').then(res => {
      setCommentTotal(res.total)
      setCommentList(res.items)
    }).catch(err => {
    })
    getServiceMessage(id, totalCommentEntry, 0, 'time').then(res => {
      setMessageTotal(res.total)
    }).catch(err => {
    })
  }
  const getCommentWhenMessageMode = () => {
    getServiceMessage(id, totalCommentEntry, 0, 'time').then(res => {
      setMessageTotal(res.total)
      setCommentList(res.items)
    }).catch(err => {
    })
    getServiceComment(id, totalCommentEntry, 0, 'time').then(res => {
      setCommentTotal(res.total)
    }).catch(err => {
    })
  }

  useEffect(() => {
    getService(id).then(res => {
      setDetail(res)
    }).catch(err => {
    })
    getCommentWhenCommentMode()
  }, [id])

  function handleCollect() {
    if (detail.collected) {
      uncollectService(id).then(res => {
        setDetail({...detail, collected: false});
        message.success('取消收藏成功');
      }).catch(err => {
        message.error(err);
      });
    } else {
      collectService(id).then(res => {
        setDetail({...detail, collected: true});
        message.success('收藏服务成功');
      }).catch(err => {
        message.error(err);
      });
    }
  }

  function handleChat() {
    // 将任务发起者添加为聊天对象，跳转到聊天页面

  }

  function handleAccept() {
    // 接取/取消接取任务
    if (detail.accessed) {
      unaccessService(id).then(res => {
        setDetail({...detail, accessed: false});
        message.success('取消请求成功');
      }).catch(err => {
        message.error(err);
      });
    } else {
      accessService(id).then(res => {
        setDetail({...detail, accessed: true});
        message.success('请求服务成功');
      }).catch(err => {
        // Message
        message.error(err);
      });
    }
  }

  return (<BasicLayout page='task-detail'>
    <ItemDetail detail={detail} descriptionTitle='服务描述' ratingTitle='服务评分:'/>
      <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} size="large">
        {detail && detail.collected ? <Button type="primary" size="large" onClick={handleCollect}><StarOutlined/>取消收藏</Button> :
            <Button size="large" onClick={handleCollect}><StarOutlined/>收藏</Button>}
          <Button size="large" onClick={handleChat}><MessageOutlined />聊一聊</Button>
        {detail && detail.status !== 'REMOVE' && detail.status !== 'DELETE' ? (
            detail.accessed ?
                <Button type="primary" size="large" onClick={handleAccept}><PayCircleOutlined/>取消请求服务</Button> :
                <Button size="large" onClick={handleAccept}><PayCircleOutlined/>享服务</Button>
        ) : (
            detail && detail.status === 'REMOVE' ? <Button size="large" disabled>服务已被删除</Button> :
                <Button size="large" disabled>服务已被移除</Button>
        )}
      </Space>
    <div style={{height: '60px'}}></div>
    <CommentList
      commentTotal={commentTotal}
      messageTotal={messageTotal}
      list={commentList}
      total={mode === 'comment' ? commentTotal : messageTotal}
      currentPage={currentPage}
      onChangeMode={key => {
        setMode(key)
        setCurrentPage(0);
        (key === 'comment' ? getCommentWhenCommentMode : getCommentWhenMessageMode)()
      }}

      onChange={(page, pageSize) => {
        (mode === 'comment' ? getServiceComment : getServiceMessage)(id, pageSize, page - 1)
          .then(res => {
            setCommentTotal(res.total)
            setCommentList(res.items)
            setCurrentPage(page)
          }).catch(err => {
        })
      }}
    />

  </BasicLayout>)
}