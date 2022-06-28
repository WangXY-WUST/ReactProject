import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;
export default function RightList() {

  // 获取指令列表以及其关联的children权限列表
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      res.data.forEach((item) => {
        // 数据中有 children 字段时会自动展示为树形表格,数据库中都有children字段，但是有的是空数组，所以把空的字段置为''
        if (item.children.length == 0) {
          item.children = ''
        }
      })
      let list = res.data
      setRightList(list)
    })
  }, [])
  // 指令列表
  const [rightList, setRightList] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=> {
        return <b>{id}</b>
      },
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      // 匹配服务器数据中的key字段
      dataIndex: 'key',
      render:(key)=> {
        return <Tag color='orange'>{key}</Tag>
      },
    },
    {
      title: '操作',
      render:(item)=> {
        return (
          <div>
            <Button danger type='primary' shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmTip(item) }}></Button>
            <Popover
              title='配置项'
              content={<div style={{ textAlign: 'center' }} >
                {/* 一个switch按钮 ,根据每个数据项的pagepermisson决定switch状态*/}
                <Switch checked = {item.pagepermisson} onChange={() => { changeSwitch(item) }}/>
              </div>}
              // 只有在右边列表栏展示的才有pagepemission这个属性,没有这个属性,Popover就不能使用
              trigger={item.pagepermisson == undefined?'':'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled = {item.pagepermisson == undefined}/>
            </Popover>
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
        // 根据grade判断是一级还是二级，一级直接过滤出来，更新列表，向服务器发数据
        if (item.grade == 1) {
          let list = rightList.filter((data) => { return data.id !== item.id })
          setRightList(list)
          axios.delete(`http://localhost:5000/rights/${item.id}`)
        }
        else {
          // 二级的权限，需要先匹配父级id，然后过滤出来，再根据children把删除的那个id过滤掉（深层次filter的会更新原数据rightList，浅层次不会影响原数据）
          let list = rightList.filter((data) => {
            return data.id == item.rightId
          })
          list[0].children = list[0].children.filter((data) => {
            return data.id !== item.id
          })
          // 因为原数据会受到影响，所以这里直接把原数据展开
          setRightList([...rightList])
          axios.delete(`http://localhost:5000/children/${item.id}`)
        }
      },
      onCancel() {
      },
    });
  }
  // 更改switch的checked状态
  const changeSwitch = (item) => { 
    // 更改pagepermisson状态
    item.pagepermisson = item.pagepermisson == 1?0:1
    setRightList([...rightList])
    if(item.grade == 1){
      axios.patch(`http://localhost:5000/rights/${item.id}` , {pagepermisson:item.pagepermisson})
    }else {
      axios.patch(`http://localhost:5000/children/${item.id}` , {pagepermisson:item.pagepermisson})

    }
   }
  return (
    <div>
      {/* 数据中有 children 字段时会自动展示为树形表格 */}
      <Table dataSource={rightList} columns={columns} pagination={{ pageSize: 5 }} />;
    </div>
  )
}
