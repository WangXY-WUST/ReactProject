import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Table, Modal, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/UserForm';

const { confirm } = Modal;
export default function UserList() {
  // 获取用户列表，并根据roleId获取对应角色的信息
  const {roleId , username , region} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then((res) => {
      let list = res.data
      setUserList(roleId===1?list:[
        ...list.filter((item) => item.username === username),
        ...list.filter((item) => item.region === region )
      ])
    })
  }, [])
  // 获取角色列表，在添加用户等地方展示进行选取
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => {
      let list = res.data
      setRoleList(list)
    })
  }, [])
  // 获取地区数据
  useEffect(() => {
    axios.get('http://localhost:5000/regions').then((res) => {
      let list = res.data
      setRegionList(list)
    })
  }, [])
  // 用户列表
  const [userList, setUserList] = useState([])
  // 添加用户的对话框
  const [isVisible, setIsVisible] = useState(false)
  // 更新用户对话框
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  // 角色信息
  const [roleList, setRoleList] = useState([])
  //地区信息
  const [regionList, setRegionList] = useState([])
  // 打开更新页面，区域框是否可以点击
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  // 当前要更新的数据
  const [current, setCurrent] = useState(null)
  // 配置添加属性的ref
  const addFormRef = useRef()
  // 配置更新的
  const updateFormRef = useRef()
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      // 筛选功能
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        } else {
          return item.region === value
        }
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }}></Switch>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger type='primary' shape="circle" icon={<DeleteOutlined />}
              onClick={() => { confirmTip(item) }}
              disabled={item.default}
            ></Button>
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { handleUpdate(item) }} />
          </div>
        )
      },
    },
  ];
  // 删除提示框
  const confirmTip = (item) => {
    console.log(item);
    confirm({
      title: '你确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setUserList(userList.filter((data) => data.id !== item.id))
        axios.delete(`http://localhost:5000/users/${item.id}`)
      },
      onCancel() {
      },
    });

  }
  // 点击添加用户的确定按钮触发的回调
  const formOk = () => {
    // console.log(addFormRef);
    // 用ref获取到表单数据,form表单的接口:validateFields:触发表单验证
    // addFormRef.current上有许多操作表单的接口,value就是表单元素中的值
    addFormRef.current.validateFields().then((value) => {
      // resetFields:重置字段
      addFormRef.current.resetFields()
      // 设添加用户框不可见
      setIsVisible(false)
      // 先post到后端，生成id，再设置userList，不然没有ID
      axios.post('http://localhost:5000/users', {
        ...value,
        "roleState": true,
        "default": false
      }).then((res) => {
        // setUserList([...userList, {
        //   ...res.data,
        //   role:roleList.filter((item) =>  item.id === value.roleId)[0]
        // }])
        axios.get('http://localhost:5000/users?_expand=role').then((res) => {
          let list = res.data
          console.log(list , list.filter((item) => item.id === 2))
          setUserList(list)
        })
      })

    }).catch((error) => { console.log(error); })
  }
  // 更改用户状态触发的回调
  const handleChange = (item) => {
    // 更改用户状态
    item.roleState = item.roleState == true ? false : true
    setUserList([...userList])
    axios.patch(`http://localhost:5000/users/${item.id}`, { roleState: item.roleState })
  }
  // 点击更新用户信息触发的回调
  const handleUpdate = (item) => {
    // 存储当前行的数据，方便确定更新时获取id
    setCurrent(item)
    // 在异步中可以同步执行，不然react状态的改变是异步的，可能更换框还没出来，值也没拿到，所以就没有表单的值
    // 这里不知道为啥还是刷新后第一次获取不到值
    setTimeout(() => {
      // 更新框可见
      setIsUpdateVisible(true)
      // 如果roleId为1，就是超级管理员，设置区域框为不可选
      if (item.roleId === 1) {
        setisUpdateDisabled(true)
      } else {
        setisUpdateDisabled(false)
      }
      //setFieldsValue 设置表单的值
      updateFormRef.current.setFieldsValue(item)
    }, 0)
  }
  // 点击确定更新按钮的回调
  const updateformOk = () => {
    updateFormRef.current.validateFields().then((value) => {
      // 输入框不可见
      setIsUpdateVisible(false)
      // setUserList(userList.map((item) => { 
      //   if(item.id === current.id) {
      //     console.log(item , value);
      //     return {
      //       ...item,
      //       ...value,
      //       role:roleList.filter((item) =>  item.id === value.roleId)[0]
      //     }
      //   }
      //   else return item
      //  }))
      // 触发表单的监听
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`http://localhost:5000/users/${current.id}`, value).then(() => {
        axios.get('http://localhost:5000/users?_expand=role').then((res) => {
          let list = res.data
          setUserList(list)
        })
      })
    }).catch((error) => { console.log(error); })
  }
  return (
    <div>
      <Button type='primary' onClick={() => { setIsVisible(true) }}>添加用户</Button>
      {/* 之前这里的rowKey使用的是：(item) => item.id 但是在输出后并没有发现key不唯一，但是一直报警告，所以随机生成吧*/}
      <Table dataSource={userList} columns={columns} pagination={{ pageSize: 5 }}  rowKey={Math.random} />;
      {/* 添加用户的表单 */}
      <Modal
        visible={isVisible}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => { setIsVisible(false) }}
        onOk={() => { formOk() }}
      >
        <UserForm region={regionList} roleList={roleList} ref={addFormRef}></UserForm>
      </Modal>
      {/* 更新用户的表单 */}
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => {
          setIsUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => { updateformOk() }}
      >
        <UserForm region={regionList} isUpdate = 'true' roleList={roleList} ref={updateFormRef} isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>
    </div>
  )
}
