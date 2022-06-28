import React from 'react'
import { Menu, Layout, Dropdown, Avatar } from 'antd';
import { connect } from 'react-redux';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
const { Header } = Layout;
function TopHeader(props) {
  const navigate = useNavigate()
  const changeState = () => {
    props.changeCollapsed()
  }
  // 从token中获取数据
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu>
      <Menu.Item>
        {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={() => {
        localStorage.removeItem('token')
        navigate('/login')
      }}>
        退出
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeState} /> : <MenuFoldOutlined onClick={changeState} />
      }
      <div style={{ float: 'right' }}>
        <span style={{ margin: '0 10px' }}>歡迎回來<span style={{color:'#1890ff'}}>{username}</span></span>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Avatar size={35} icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

export default connect(
  (state) => { 
    const {CollApsedReducer:{isCollapsed}} = state
    return {
      isCollapsed
    }
   },
   (dispatch) => ({
     changeCollapsed:() => { 
      //  dispatch中应写的是action中的函数，这里没写action文件
       dispatch({
         type:'change_collapsed'
       })
      }
   })
)(TopHeader)