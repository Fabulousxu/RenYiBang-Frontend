// profile_page.jsx
import React, { useEffect, useState } from 'react';
import BasicLayout from "../component/basic_layout";
import {Descriptions, Avatar, List, Typography, Tag, Button, Table, Tabs} from 'antd';
import { getSelfProfile, getUserTasks } from '../service/user';
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";
import { unaccessTask } from '../service/task';
import TabPane from "antd/es/tabs/TabPane";
import moment from "moment/moment";
import {unaccessService} from "../service/service";

const { Title } = Typography;

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState('1');
    const [data, setData] = useState([]);

    useEffect(() => {
        getSelfProfile().then(res => {
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

    const task_initiator_columns = [{
        title: '任务标题',
        dataIndex: 'name',
        key: 'title',
        render: (text, record) => <Link to="">{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'time',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '已接受人数',
        dataIndex: 'accepted',
        key: 'accepted',
        render: (text, record) => <>{text} / {record.maxAccess}</>,
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => unaccessTask(record.taskId)}>取消</Button>
        ),
    }];

    const task_recipient_columns = [{
        title: '任务标题',
        dataIndex: 'name',
        key: 'title',
        render: (text, record) => <Link to="">{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'time',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => unaccessTask(record.taskId)}>取消接取</Button>
        ),
    }];

    const service_initiator_columns = [{
        title: '任务标题',
        dataIndex: 'name',
        key: 'title',
        render: (text, record) => <Link to="">{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'time',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '已接受人数',
        dataIndex: 'accepted',
        key: 'accepted',
        render: (text, record) => <>{text} / {record.maxAccess}</>,
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => unaccessService(record.serviceId)}>取消</Button>
        ),
    }];

    const service_recipient_columns = [{
        title: '任务标题',
        dataIndex: 'name',
        key: 'title',
        render: (text, record) => <Link to="">{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'time',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => unaccessService(record.serviceId)}>取消接取</Button>
        ),
    }];

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

            {/*一段占位的空白*/}
            <p style={{margin: '30px 0', fontSize: '20px'}}>
                <br></br>
                与我相关的任务和服务
            </p>


            <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                <TabPane tab="我发布的任务" key="1">
                    <Table columns={task_initiator_columns} dataSource={data} />
                </TabPane>
                <TabPane tab="我接收的任务" key="2">
                    <Table columns={task_recipient_columns} dataSource={data} />
                </TabPane>
                <TabPane tab="我发布的服务" key="3">
                    <Table columns={service_initiator_columns} dataSource={data} />
                </TabPane>
                <TabPane tab="我接收的服务" key="4">
                    <Table columns={service_recipient_columns} dataSource={data} />
                </TabPane>
            </Tabs>


        </BasicLayout>
    );
}
