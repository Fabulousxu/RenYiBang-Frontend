import React from "react";
import { Table, Image, Button } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import BasicLayout from "../component/basic_layout";
import ImageGallery from "../component/image_gallary";
import { getTask } from "../service/task";
import { getService } from "../service/service";
import useSyncCallback from "../util/useSyncCallback";

export default function SelectPage() { 
    const [selectedperson, setSelectedPerson] = useState();
    const [task, setTask] = useState({});
    const [flag, setFlag] = useState(false);
    const location = useLocation();
    const isTask = location.pathname.includes("task");
    const isService = location.pathname.includes("service");
    let { taskId } = useParams();

    const handleClick = () => {
        console.log(selectedperson);
    }

    const fetchdata = async () => {
        if (isTask) {
            let data = await getTask(taskId);
            setTask(data.data);
        } else if (isService) {
            let data = await getService(taskId);
            setTask(data.data);
        }
    };

    const syncconsole = useSyncCallback(() => {
        console.log(task);
    });

    useEffect(() => {
        fetchdata();
        // syncconsole();
    }, []);

    const columns = [
        {
            title: "用户名",
            dataIndex: "username",
            render: (text) => <div>{text}</div>,
        },
        {
            title: "头像",
            dataIndex: "avatar",
            render: (text) => <Image src={text} width={50} />,
        },
        {
            title: "评分",
            dataIndex: "rating",
            render: (text) => <div>{text}</div>, 
        },
    ];

    return (
        <BasicLayout>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            {/* <div style={{ width: '40%', display: 'flex', 'flex-direction': 'column', margin: '20px' }}>
            <Image.PreviewGroup style={{display: 'flex', 'flex-wrap': 'wrap'}}>
                {task && Array.isArray(task.images) ? task.images.map((imageSrc, index) => (
                <Image key={imageSrc} src={imageSrc} style={{display: 'flex', 'flex-direction': 'row'}}/>
                )) : []}
            </Image.PreviewGroup> */}
            <ImageGallery 
                images={task && Array.isArray(task.images) ? task.images : []}
                style={{ width: '55%', display: 'flex', 'flex-direction': 'column', margin: '20px' }}
            />
            {/* </div> */}
            <div style={{ width: '40%', display: 'flex', 'flex-direction': 'column', margin: '20px' }}>
                <h1>{task.title}</h1>
                <h3>项目描述：</h3>
                <p>{task.description}</p>
                <h3>项目价格：￥{task.price / 100}</h3>
                <h3>请选择候选人：</h3>
                <Table 
                    columns={columns} 
                    rowSelection={{
                        onChange: (_, selectedPerson) => {
                            setSelectedPerson(selectedPerson);
                        },
                    }}
                    dataSource={task && Array.isArray(task.proposer) ? task.proposer.map(proposer => ({
                        ...proposer,
                        key: proposer.userId,
                    })) : []}
                    pagination={false}
                />
                <div style={{ marginTop: 16 }}>
                    <Button type="primary" onClick={handleClick}>
                        确认选择
                    </Button>
                </div>
            </div>
            </div>
        </BasicLayout>
    );
}