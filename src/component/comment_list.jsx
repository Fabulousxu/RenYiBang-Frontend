import {Avatar, Button, Col, List, Pagination, Rate, Row, Tabs} from "antd";
import Item from "antd/es/list/Item";
import {Link} from "react-router-dom";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";

export const totalCommentEntry = 10

export default function CommentList(props) {
  const list = (<List
    itemLayout="horizontal"
    dataSource={props.list}
    renderItem={(item, index) => (<Item index={index} style={{flexDirection: 'column'}}>
      <Row style={{width: '100%', alignItems: 'center'}}>
        <Col span={4}>
          <Link to={`/user/${item.user.userId}`}>
            <Item.Meta
              avatar={<Avatar src={item.user.avatar}/>}
              title={item.user.nickname}
              description={`帮帮评分${(item.user.rating / 10).toFixed(1)}`}
              style={{width: '100%'}}
            />
          </Link>
        </Col>
        <Col
          span={20}
          style={{visibility: item.hasOwnProperty('rating') ? 'visible' : 'hidden'}}
        >
          <Rate disabled allowHalf value={item?.rating / 20}/>
        </Col>
      </Row>
      <p style={{width: '100%', paddingLeft: '48px'}}>{item.content}</p>
      <Row style={{width: '100%', paddingLeft: '48px', alignItems: 'center'}}>
        <Col style={{paddingRight: '10px '}}>
          <Button
            icon={item.liked ? <LikeFilled/> : <LikeOutlined/>}
            style={{border: 'none'}}
            onClick={() => props.onLike(index)}
          />
        </Col>
        <Col>{item.likedNumber}</Col>
      </Row>
    </Item>)}
  />)
  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Tabs
        type='card'
        style={{width: '100%'}}
        items={[{
          key: 'comment', label: `评论 ${props.commentTotal}条`, children: list
        }, {key: 'message', label: `留言 ${props.messageTotal}条`, children: list}]}
        onChange={props.onChangeMode}
      />
      <Pagination
        pageSize={totalCommentEntry}
        total={props.total}
        current={props.currentPage}
        showSizeChanger={false}
        style={{marginTop: '24px'}}
        onChange={props.onChange}
      />
    </div>)
}