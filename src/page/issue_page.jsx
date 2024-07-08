import { Button, Input, Upload, Image, Radio, Modal } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import BasicLayout from '../component/basic_layout';
import { issueService, issueTask } from '../service/issue';


export default function IssuePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [radioValue, setRadioValue] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
  ]);
  const [Base64List, setBase64List] = useState([]);

  const beforeUpload = (file) => {  
    // 阻止文件自动上传
    console.log(fileList);
    return false;
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  //上传图片界面设置

  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
  };
  //单选框设置

  const handleSubmit = () => { 
    if(!title || !description || !price || fileList.length === 0){
      Modal.error({
        title: '请填写完整信息',
        content: '请填写完整信息',
      });
      return;
    }

    fileList.map(file => {
      getBase64(file.originFileObj, imageBase64 => {
        setBase64List(prevList => [...prevList, imageBase64]);
      });
    });

    let newitem = {
      title: title,
      description: description,
      price: price * 100,
      images: Base64List
    }

    if(radioValue === 1){
      issueTask(newitem).then(res => {
        Modal.success({
          title: '发布成功',
          content: '发布成功',
        });
      }).catch(err => {
        Modal.error({
          title: '发布失败',
          content: err,
        });

      })
    }
    else if(radioValue === 2){
      issueService(newitem).then(res => {
        Modal.success({
          title: '发布成功',
          content: '发布成功',
        });
      }).catch(err => {
        Modal.error({
          title: '发布失败',
          content: err,
        });
      })
    }
  }

  return(
    <BasicLayout page='issue'>
      <h1>发布一个新的内容</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ width: '40%', display: 'flex', 'flex-direction': 'column' }}>
          <h3>请上传预览照片，数量不超过8张</h3>
          <Upload
          beforeUpload={beforeUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          onRemove={(file) => {
            setFileList(curr => curr.filter(item => item.uid !== file.uid));
          }}
          >
          {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
          <Image
            wrapperStyle={{
            display: 'none',
            }}
            preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
          )}
        </div>
        <div style={{ width: '40%', display: 'flex', 'flex-direction': 'column' }}>
          <Input placeholder="请输入标题" style={{ margin: '20px', width: '80%' }} size='large' value={title} onChange={e => setTitle(e.target.value)}/>
          <h3 style={{ margin: '20px' }}>请选择发布类型</h3>
          <Radio.Group onChange={onRadioChange} value={radioValue} style={{ margin: '20px', width: '80%' }}>
            <Radio value={1}>任务</Radio>
            <Radio value={2}>服务</Radio>
          </Radio.Group>
          <Input.TextArea placeholder="请输入描述" style={{ margin: '20px', width: '80%' }} value={description} onChange={e => setDescription(e.target.value)}/>
          <Input placeholder="初步定价" addonBefore="￥" style={{ margin: '20px', width: '80%' }} value={price} onChange={e => setPrice(e.target.value)}/>
          <Button type="primary" style={{ margin: '20px', width: '100px' }} onClick={handleSubmit}>提交</Button>
        </div>
      </div>
    </BasicLayout>
  )
}