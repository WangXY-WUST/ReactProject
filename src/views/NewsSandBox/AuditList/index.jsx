import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table, Tag , notification } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [newsInfo, setNewsInfo] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
      setNewsInfo(res.data)
    })
  }, [])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            {
              item.auditState === 1 && <Button type='primary' onClick={() => { handleCancel(item) }}>撤销</Button>
            }
            {
              item.auditState === 2 && <Button onClick={() => { handlePublish(item) }}>发布</Button>

            }
            {
              item.auditState === 3 && <Button danger type='primary' onClick={() => { handleUpdate(item.id) }}>更新·</Button>
            }
          </div>
        )
      },
    },
  ];
  // 撤销按钮的回调
  const handleCancel = (item) => {
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(() => {
      axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
        setNewsInfo(res.data)
      })
    })
  }
  // 更新按钮的回调
  const handleUpdate = (id) => {
    navigate(`/news-manage/update/${id}`)
  }
  // 发布按钮的回调
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      'publishTime':Date.now()
    }).then(() => {
      navigate('/publish-manage/published')
        notification.info({
            message: `通知`,
            description:
                `您可以到【发布管理/已发布】中查看您的新闻`,
            placement: 'bottomRight',
        });
    })
  }
  return (
    <div>
      <Table dataSource={newsInfo} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
    </div>
  )
}
