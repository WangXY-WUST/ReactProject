import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../components/NewsPublish/usePublish'
import { Button } from 'antd'

export default function NewsSunSet() {
  const {dataSource , newsDelete} = usePublish(3)
  return (
    <div>
      <NewsPublish 
        dataSource = {dataSource} 
        button = {(id) => {return <Button danger onClick={() => { newsDelete(id) }}>删除</Button> }}
        ></NewsPublish>
    </div>
  )
}
