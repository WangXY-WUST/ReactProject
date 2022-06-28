import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select , notification } from 'antd'
import style from './index.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const { Step } = Steps
const { Option } = Select
const { TextArea } = Input
export default function NewsAdd() {
  // 当前步骤信息
  const [current, setCurrent] = useState(0)
  // 新闻类别列表
  const [cateGoryList, setCateGoryList] = useState([])
  // 第一步表单的信息
  const [formInfo, setFormInfo] = useState({})
  // 第二步表单的信息
  const [content, setContent] = useState({})
  // 获取token
  const user = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  // 获取第一步表单信息的ref
  const newsForm = useRef(null)
  // 获取第二步表单信息的ref
  const contentForm = useRef(null)
  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCateGoryList(res.data)
    })
  }, [])

  // 点击下一步按钮回调
  const nextStep = () => {
    if (current === 0) {
      newsForm.current.validateFields().then((res) => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch((error) => { console.log(error); })
    } else if (current === 1) {
      contentForm.current.validateFields().then((res) => {
        setContent(res.content)
        setCurrent(current + 1)
      }).catch((error) => { console.log(error); })
    } else {
      setCurrent(current + 1)
    }
  }
  // 上一步按钮的回调
  const upStep = () => {
    setCurrent(current - 1)
  }
  // 点击提交审核或到草稿箱的回调
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      'content': content,
      "region": user.region ? user.region : '全球',
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 1649574943743
    }).then(() => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement:'bottomRight',
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: '50px' }}>
        {/* 第一步的组件 */}
        <div className={current === 0 ? '' : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            ref={newsForm}
          >
            {/* Form.item的name字段是之后要收集的字段名 */}
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select>
                {
                  cateGoryList.map((item) =>
                    // value是表单要收集的数据
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>

          </Form>
        </div>
        {/* 第二步的组件 */}
        <div className={current === 1 ? '' : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            ref={contentForm}
          >
            <Form.Item
              label="新闻内容"
              name="content"
              rules={[{ required: true, message: 'Please input your content!' }]}
            >
              <TextArea rows={4} placeholder="请输入新闻内容" />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 2 ? '' : style.active}>

        </div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current === 2 &&
          <span>
            <Button type='primary' onClick={() => { handleSave(0) }}>保存到草稿箱</Button>
            <Button danger onClick={() => { handleSave(1) }}>提交审核</Button>
          </span>
        }
        {
          current > 0 && <Button onClick={upStep}>上一步</Button>
        }
        {
          current < 2 && <Button type='primary' onClick={nextStep}>下一步</Button>
        }
      </div>
    </div >
  )
}
