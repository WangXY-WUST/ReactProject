import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { connect } from 'react-redux'
import {
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'

const { Sider } = Layout
const { SubMenu } = Menu;

// 定义一个图标映射表
const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <VideoCameraOutlined />,
  '/right-manage': <VideoCameraOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />
}

function SideMenu(props) {
  // 获取权限列表，侧边栏只能展示自己有权限功能 
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  // 组件状态
  const [menu, setMenu] = useState([])
  // 生命周期钩子
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      setMenu(res.data)
    })
  }, [])
  // useNavigate实现编程式导航
  const navigate = useNavigate()
  // 获取当前路径名称
  const location = useLocation()
  // 获取当前选择的路径的名称（这里写成中括号是因为在Menu的selectedKeys属性可以同时写两个值）
  const selectedKeys = [location.pathname]
  // 截取路径名称的前面一段，使其保持打开状态（因为如果不加，每次刷新会闭合）
  const openKeys = ['/' + location.pathname.split('/')[1]]
  // 动态渲染侧边栏
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermisson(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {/* 递归 */}
            {renderMenu(item.children)}
          </SubMenu>
        )
      } else {
        return checkPagePermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => { navigate(item.key) }}>{item.title}</Menu.Item>
      }
    })
  }

  // 判断是否为页级元素,并且获取到用户的权限列表与已由所有权限进行比较，如果没有就不在侧边栏展示
  const checkPagePermisson = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key)
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
      <div style={{ display: 'flex', height: '100%', 'flexDirection': 'column' }}>
        <div className="logo">新闻管理</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default connect(
  (state) => {
    const { CollApsedReducer: { isCollapsed } } = state
    return {
      isCollapsed
    }
  }
)(SideMenu)
