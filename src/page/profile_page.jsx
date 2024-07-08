// profile_page.jsx
import React, { useEffect, useState } from 'react';
import BasicLayout from "../component/basic_layout";
import { Descriptions, Avatar, List, Typography, Tag, Button } from 'antd';
import { getUserProfile, getUserTasks } from '../service/user';
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";
import { unaccessTask } from '../service/task';

const { Title } = Typography;

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getUserProfile().then(res => {
            setUser(res);
        }).catch(err => {
            console.error(err);
        });

        getUserTasks().then(res => {
            setTasks(res);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    return (
        <BasicLayout page='profile'>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <Avatar size={64} src={user.avatar} />
                <div style={{ marginLeft: 24 }}>
                    <Title level={2}>{user.nickname}</Title>
                    <Title level={4} type="secondary">{user.intro}</Title>
                </div>
            </div>

            <Descriptions title="用户信息" bordered column={4}>
                <Descriptions.Item label="用户名">{user.nickname}</Descriptions.Item>
                <Descriptions.Item label="用户类型">{user.type}</Descriptions.Item>
                <Descriptions.Item label="评分">{(user.rating / 10).toFixed(1)}</Descriptions.Item>
                <Descriptions.Item label="余额">{(user.balance / 100).toFixed(2)}元</Descriptions.Item>
            </Descriptions>

            <Title level={3} style={{ marginTop: 24 }}>接收的任务</Title>
            <List
                itemLayout="horizontal"
                dataSource={tasks}
                renderItem={task => (
                    <List.Item>
                        {/*id,title,status,rating,time*/}
                        <List.Item.Meta
                            title={<Link to={`/task/${task.id}`}>{task.title}</Link>}
                            description={<>
                                <Tag color="blue">{task.rating}</Tag>
                                <Tag color="green">{task.time}</Tag>
                            </>}
                        />
                        <div>{task.status}</div>
                        <Button type="danger" onClick={() => unaccessTask(task.id)}>取消接取任务</Button>
                    </List.Item>
                )}
            />
        </BasicLayout>
    );
}
