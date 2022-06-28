import React, { useEffect, useState } from 'react'
import { PageHeader , Descriptions } from 'antd';
import axios from 'axios';
import { useMatch } from 'react-router-dom';
import dayjs from 'dayjs'

export default function NewsPreview() {
  const match = useMatch('news-manage/preview/:id')
  const [newsInfo, setNewsInfo] = useState({})
  useEffect(() => {
    axios.get(`news/${match.params.id}?_expand=category&_expand=role`).then((res) => {
      setNewsInfo(res.data)
    })
  }, [])
  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['black' , 'orange' , 'green' , 'red']
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        // newsInfo初始值设为null，那么在刷新后数据还没获取就会报错
        // newsInfo初始值设为对象，只有一层的时候不会报错，但是有深层的（对象包对象）就会报错，所以判断一下
        title={newsInfo?.title}
        // subTitle={newsInfo.category.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{dayjs(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{newsInfo.publishState ? `${dayjs(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss')}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态"><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
          <Descriptions.Item label="发布状态" ><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
          <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
        <div style={{border:'1px solid gray' , padding:'0 24px'}}>
          {newsInfo.content}
        </div>
      </PageHeader>
    </div>
  )
}
