import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import { useMatch } from 'react-router-dom';
import { HeartTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs'
export default function Detail() {
  const match = useMatch('/detail/:id')
  const [newsInfo, setNewsInfo] = useState({})
  useEffect(() => {
    axios.get(`news/${match.params.id}?_expand=category&_expand=role`).then((res) => {
      setNewsInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data
    }).then((res) => {
      axios.patch(`news/${match.params.id}`, {
        view: res.view + 1
      })
    })
  }, [])
  // 点击爱心，star+1
  const handleStar = () => {
    axios.patch(`news/${match.params.id}`, {
      star: newsInfo.star + 1
    }).then(() => {
      axios.get(`news/${match.params.id}?_expand=category&_expand=role`).then((res) => {
        setNewsInfo({
          ...res.data,
          view: res.data.view + 1
        })
      })
    })
  }
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        // newsInfo初始值设为null，那么在刷新后数据还没获取就会报错
        // newsInfo初始值设为对象，只有一层的时候不会报错，但是有深层的（对象包对象）就会报错，所以判断一下
        title={newsInfo?.title}
        subTitle={
          <div>
            {/* {console.log(newsInfo.category.title)} */}
            <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
          </div>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{newsInfo.publishState ? `${dayjs(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss')}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
          <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
        <div style={{ border: '1px solid gray', padding: '0 24px' }}>
          {newsInfo.content}
        </div>
      </PageHeader>
    </div>
  )
}
