import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table , notification } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function NewsAudit() {
  const [auditList, setAuditList] = useState([])
  const { region, username, roleId } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/news?auditState=1&_expand=category').then((res) => {
      let list = res.data
      // 如果是管理员就展示全部列表，如果不是，就把自己的新闻过滤出来，并且把同一地区，区域编辑的也过滤出来（区域编辑没有审核新闻的权限）
      setAuditList(roleId === 1 ? list : [
        ...list.filter((item) => { return item.author === username }),
        ...list.filter((item) => item.region === region && item.roleId === 3)
      ])
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
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button type='primary' icon={<CheckOutlined />} shape="circle" onClick={() => { handleClick(item, 2, 1) }}></Button>
            <Button danger shape="circle" icon={<CloseOutlined />} onClick={() => { handleClick(item, 3, 0) }}></Button>
          </div>
        )
      },
    },
  ];
  // 点击按钮的回调
  const handleClick = (item, auditState, publishState) => {
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(() => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【审核管理/审核列表】中查看您的新闻`,
        placement:'bottomRight',
      });
      axios.get('/news?auditState=1&_expand=category').then((res) => {
        let list = res.data
        setAuditList(roleId === 1 ? list : [
          ...list.filter((item) => { return item.author === username }),
          ...list.filter((item) => item.region === region && item.roleId === 3)
        ])
      })
    })
  }
  return (
    <div>
      <Table dataSource={auditList} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
    </div>
  )
}
