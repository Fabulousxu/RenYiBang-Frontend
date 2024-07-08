import BasicLayout from "../component/basic_layout";
import {useParams} from "react-router-dom";
import ItemDetail from "../component/item_detail";
import React, {useEffect, useState} from "react";
import CommentList, {totalCommentEntry} from "../component/comment_list";
import {getService, getServiceComment, getServiceMessage} from "../service/service";
import {Button, Space} from "antd";
import {MessageOutlined, PayCircleOutlined} from "@ant-design/icons";

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

  return (<BasicLayout page='task-detail'>
    <ItemDetail detail={detail} descriptionTitle='服务描述' ratingTitle='服务评分:'/>
      <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} size="large">
          <Button size="large"><MessageOutlined />聊一聊</Button>
          <Button type="primary" size="large"><PayCircleOutlined />享服务</Button>
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