import React from 'react'
import { Routes , Route , Navigate } from 'react-router-dom'
import Login from './views/Login'
import NewsSandBox from './views/NewsSandBox'
import './App.css'
import News from './views/News'
import Detail from './views/News/Detail'
export default function App() {
  return (
    <div className='container' style={{height:'100%'}}>
      {/* 注册路由 */}
      <Routes>
        <Route path = '/news' element = {<News/>} />
        <Route path = '/detail/:id' element = {<Detail/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={localStorage.getItem("token") ? <NewsSandBox /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}
