import React, { useState, useEffect } from 'react'
import { Table, Button, Modal ,Tree} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;
export default function RoleList() {
  // 初始化角色列表状态
  const [roleList, setRoleList] = useState([])
  // 初始化指令列表状态
  const [rightList, setRightList] = useState([])
  // 当前已勾选的权限
  const [currentRights, setCurrentRights] = useState([])
  // 点击修改按钮后存入的当前行的id
  const [currentId, setCurrentId] = useState(0)
  // 控制权限列表的对话框显示与否的状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  // 向服务器获取角色列表
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => {
      setRoleList(res.data)
    })
  }, [])
  // 向服务器获取指令和其关联的子指令列表
  useEffect(() => {
    axios.get('http://localhost:5000/rights/?_embed=children').then((res) => {
      setRightList(res.data)
    })
  }, [])
  // 表格列的显示数据，dataIndex的值对应数据库中字段
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=> {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render:(item)=> {
        return (
          <div>
            <Button danger type='primary' shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmTip(item) }}></Button>
            {/* 点击修改按钮，设置对话框可见。初始化当前角色的指令，收集当前行的id，方便后面进行修改 */}
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { setIsModalVisible(true);setCurrentRights(item.rights);setCurrentId(item.id) }} />
          </div>
        )
      }
    }
  ]

  // 点击删除按钮的提示框，item是传过来的本行的数据
  const confirmTip = (item) => {
    confirm({
      title: '你确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // 在roleList中，把和传过来的item的id不相等的留下，相等的就过滤掉
        let list = roleList.filter((data) => { return data.id !== item.id })
        // 然后更新roleList,但是不会更新roleList的原数据
        setRoleList(list)
        // console.log(list , roleList);
        // 更新服务器数据
        axios.delete(`http://localhost:5000/roles/${item.id}`)
      },
      onCancel() {
      },
    });
  }
  // 点击修改后再点击修改的ok按钮后
  const handleOk = () => {
    // 修改权限列表的对话框隐藏
    setIsModalVisible(false)
    // 点击ok按钮后，将当前id与角色列表的id进行比较，看看更改的是哪个元素
    // 如果id匹配成功，就将当前的item展开和更新后的权限赋值给roleList中的权限字段,原roleList的值并不会改变，是赋给了一个新数组
   setRoleList(roleList.map((item) => { 
      if(item.id === currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      // 如果没有匹配成功，就返回原来的item
      else return item
     }))
    //  修改服务器的数据
     axios.patch(`http://localhost:5000/roles/${currentId}` , {
       rights:currentRights
     })
  }
  // 对话框取消按钮的回调
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // checkKey为当前所有已选中的权限，是默认参数
  //当树形结构的checked发生改变，就触发这个事件，把已选中的权限赋值给当前权限的状态
  const onCheck = (checkKey) => {
    setCurrentRights(checkKey.checked)
  }
  return (
    <div>
      {/*rowKey:如果请求的数据中没有key值,就使用item.id作为key值  */}
      <Table dataSource={roleList} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="权限列表" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          // 获取权限的数据展示，需要数据格式为其指定的格式
          treeData={rightList}
          // 在父权限被选中后，自权限不会被选，就是开启严格匹配
          checkStrictly= 'true'
        />
      </Modal>
    </div>
  )
}
