import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Table, Modal , notification} from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined , UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;
export default function NewsDraft() {
  // 获取草稿箱数据
  const [newsDraftList, setNewsDraftList] = useState([])
  // 获取token数据
  const { username } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  // 获取新闻列表
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) => {
      let list = res.data
      setNewsDraftList(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title , item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger type='primary' shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmTip(item) }}></Button>
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick = {() => { navigate(`/news-manage/update/${item.id}`) }} />
            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick = {() => { handleCheck(item.id) }}/>
          </div>
        )
      },
    },
  ];
  // 点击删除的确认提示
  const confirmTip = (item) => {
    confirm({
      title: '你确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
          let list = newsDraftList.filter((data) => { return data.id !== item.id })
          setNewsDraftList(list)
          axios.delete(`/news/${item.id}`)
      },
      onCancel() {
      },
    });
  }
  // 点击提交审核按钮的回调
  const handleCheck = (id) => { 
    axios.patch(`/news/${id}` , {
      auditState:1
    }).then(() => {
      navigate('/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement:'bottomRight',
      });
    })
   }
  return (
    <div>
      {/* 数据中有 children 字段时会自动展示为树形表格 */}
      <Table dataSource={newsDraftList} columns={columns} pagination={{ pageSize: 5 }} rowKey = {item => item.id}/>;
    </div>
  )
}
