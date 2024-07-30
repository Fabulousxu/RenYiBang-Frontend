import React, { useEffect, useState } from 'react';
import BasicLayout from "../component/basic_layout";
import {Descriptions, Avatar, Typography, Button, Table, Tabs, Modal} from 'antd';
import { getSelfProfile } from '../service/user';
import {Link, Navigate, useParams} from "react-router-dom";
import {cancelTask, unaccessTask} from '../service/task';
import TabPane from "antd/es/tabs/TabPane";
import moment from "moment/moment";
import {cancelService, unaccessService} from "../service/service";
import {
    fetchInitiatorServices,
    fetchInitiatorTasks,
    fetchRecipientServices,
    fetchRecipientTasks
} from "../service/user";

const { Title } = Typography;

const PAGE_SIZE = 10;

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('1');
    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        getSelfProfile().then(res => {
            setUser(res);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    useEffect(() => {
        fetchData(activeTab, pageIndex, PAGE_SIZE);
    }, [activeTab, pageIndex]);

    const fetchData = async (tabKey, pageIndex, pageSize) => {
        try {
            let responseData;
            switch (tabKey) {
                case '1':
                    responseData = await fetchInitiatorTasks(pageSize, pageIndex);
                    break;
                case '2':
                    responseData = await fetchRecipientTasks(pageSize, pageIndex);
                    break;
                case '3':
                    responseData = await fetchInitiatorServices(pageSize, pageIndex);
                    break;
                case '4':
                    responseData = await fetchRecipientServices(pageSize, pageIndex);
                    break;
                default:
                    responseData = await fetchInitiatorTasks(pageSize, pageIndex);
            }
            if (Array.isArray(responseData.items)) {
                setData(responseData.items);
            } else {
                setData([]);
                console.error("Fetched data is not an array:", responseData);
            }
        } catch (error) {
            setData([]);
            console.error("Error fetching data:", error);
        }
    };

    const task_initiator_columns = [{
        title: '任务标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/task/${record.taskId}`}>{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'createdAt',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '已接受人数',
        dataIndex: 'accessedNumber',
        key: 'accepted',
        render: (text, record) => <>{text} / {record.maxAccess}</>,
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => cancelTask(record.taskId)}>取消</Button>
        ),
    }, {
        title: '操作',
        key: 'action', // 跳转到select_page
        render: (text, record) => <Link to={`/select/task/${record.taskId}`}>选择接取人</Link>,

    }];

    const task_recipient_columns = [{
        title: '任务标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/task/${record.taskId}`}>{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'createdAt',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => unaccessTask(record.taskId).then(res => {
                // 删除本条记录
                Modal.success({
                    title: '取消接取成功',
                    content: '取消接取成功',
                });
                setData(data.filter(item => item.taskId !== record.taskId));
            }
            )}>取消接取</Button>
        ),
    }];

    const service_initiator_columns = [{
        title: '任务标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/service/${record.serviceId}`}>{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'createdAt',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '已接受人数',
        dataIndex: 'accessedNumber',
        key: 'accepted',
        render: (text, record) => <>{text} / {record.maxAccess}</>,
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => cancelService(record.serviceId).then(res => {
                // 删除本条记录
                console.log("Cancel service success:", res);
                setData(data.filter(item => item.serviceId !== record.serviceId));
            })}>取消</Button>
        ),
    }, {
        title: '操作',
        key: 'action', // 跳转到select_page
        render: (text, record) => <Link to={`/select/service/${record.serviceId}`}>选择接取人</Link>,
    }];

    const service_recipient_columns = [{
        title: '任务标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/service/${record.serviceId}`}>{text}</Link>,
    }, {
        title: '发起时间',
        dataIndex: 'createdAt',
        key: 'time',
        sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => unaccessService(record.serviceId).then(res => {
                    // 删除本条记录
                    Modal.success({
                        title: '取消接取成功',
                        content: '取消接取成功',
                    });
                    setData(data.filter(item => item.serviceId !== record.serviceId));
                }
            )}>取消接取</Button>
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
            <p style={{ margin: '30px 0', fontSize: '20px' }}>
                <br></br>
                与我相关的任务和服务
            </p>

            <Tabs defaultActiveKey="1" onChange={key => setActiveTab(key)}>
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
