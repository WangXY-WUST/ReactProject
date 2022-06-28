import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../components/NewsPublish/usePublish'
import { Button } from 'antd'


export default function NewsUnpublished() {
  const {dataSource , newsPublish} = usePublish(1)
  
  return (
    <div>
      <NewsPublish 
        dataSource = {dataSource} 
        button = {(id) => {return <Button type = 'primary' onClick={() => { newsPublish(id) }}>发布</Button> }}
        ></NewsPublish>
    </div>
  )
}
