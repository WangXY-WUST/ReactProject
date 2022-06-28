import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../components/NewsPublish/usePublish'

export default function NewsPublished() {

  const {dataSource , newsSunset} = usePublish(2)
  return (
    <div>
      <NewsPublish 
        dataSource = {dataSource} 
        // 获取返回的id，传给按钮点击的的函数
        button = {(id) => {return <Button danger onClick={() => { newsSunset(id) }}>下线</Button> }}></NewsPublish>
    </div>
  )
}
