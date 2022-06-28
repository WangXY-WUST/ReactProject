import React, { useState, useEffect } from 'react'
import Home from '../../views/NewsSandBox/Home'
import UserList from '../../views/NewsSandBox/UserList'
import RoleList from '../../views/NewsSandBox/RoleList'
import RightList from '../../views/NewsSandBox/RightList'
import NoPermission from '../../views/NewsSandBox/NoPermission'
import NewsAdd from '../../views/NewsSandBox/NewsAdd'
import NewsDraft from '../../views/NewsSandBox/NewsDraft'
import NewsCategory from '../../views/NewsSandBox/NewsCategory'
import NewsAudit from '../../views/NewsSandBox/NewsAudit'
import AuditList from '../../views/NewsSandBox/AuditList'
import NewsUnpublished from '../../views/NewsSandBox/NewsUnpublished'
import NewsPublished from '../../views/NewsSandBox/NewsPublished'
import NewsSunset from '../../views/NewsSandBox/NewsSunset'
import NewsPreview from '../../views/NewsSandBox/NewsPreview'
import NewsUpdate from '../../views/NewsSandBox/NewsUpdate'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { connect } from 'react-redux'
// 路由权限(因为不知名的原因，不显示数据，所以这里没有路由权限的限制，注释掉了)
// 定义一个路由映射表，与服务器返回的路径进行比较，如果符合要求，就加载对应的路由组件
/* const RouterMap = {
    '/home': <Home />,
    '/user-manage/List': <UserList />,
    '/right-manage/role/List': <RoleList />,
    '/right-manage/right/List': <RightList />,
    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <NewsDraft />,
    '/news-manage/category': <NewsCategory />,
    '/audit-manage/audit': <NewsAudit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <NewsUnpublished />,
    '/publish-manage/published': <NewsPublished />,
    '/publish-manage/sunset': <NewsSunset />
} */
function NewsRouter(props) {
    /*
         const { role:{rigths} } = JSON.parse(localStorage.getItem('token'))
        // 定义一个存放所有数据的数组
        const [routerList, setRouterList] = useState([])
        useEffect(() => {
            Promise.all([
                axios.get('http://localhost:5000/rights'),
                axios.get('http://localhost:5000/children')
            ]).then((res) => {
                setRouterList([...res[0].data, ...res[1].data])
                console.log([...res[0].data, ...res[1].data]);
            })
        }, [])
    
        const checkRoute = (item) => {
            //  如果没有权限或者pagepermission为假都返回false
            return RouterMap[item.key] && item.pagepermission
        }
        // 判断登陆者的权限包含哪些，如果包含就返回真，
        const checkUserPremission = (item) => {
            return rigths.includes(item.key)
        } */
    return (
        <div>
            <Spin size='large' spinning={props.isLoading}>
                <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/user-manage/List' element={<UserList />} />
                    <Route path='/right-manage/role/List' element={<RoleList />} />
                    <Route path='/right-manage/right/List' element={<RightList />} />
                    <Route path='/news-manage/add' element={<NewsAdd />} />
                    <Route path='/news-manage/draft' element={<NewsDraft />} />
                    <Route path='/news-manage/category' element={<NewsCategory />} />
                    <Route path='/news-manage/preview/:id' element={<NewsPreview />} />
                    <Route path='/news-manage/update/:id' element={<NewsUpdate />} />
                    <Route path='/audit-manage/audit' element={<NewsAudit />} />
                    <Route path='/audit-manage/list' element={<AuditList />} />
                    <Route path='/publish-manage/unpublished' element={<NewsUnpublished />} />
                    <Route path='/publish-manage/published' element={<NewsPublished />} />
                    <Route path='/publish-manage/sunset' element={<NewsSunset />} />
                    {/* 重定向 */}
                    <Route path='/' element={<Navigate to='/home' replace />} />
                    <Route path='*' element={<NoPermission />} />
                    {/* {
                    routerList.forEach((item) => {
                        if (checkRoute(item) && checkUserPremission(item)) {
                            <Route path={item.key} element={RouterMap[item.key]} />
                        } else return null
                    })
                } */}
                    {/* 重定向 */}
                    {/* <Route path='/' element={<Navigate to='/home' replace />} />
                {
                    // routerList.length > 0 && <Route path='*' element={<NoPermission />} />
                } */}
                </Routes>
            </Spin>
        </div>
    )
}

export default connect(
    (state) => {
        const { LoadingReducer: { isLoading } } = state
        return {
            isLoading
        }
    }
)(NewsRouter)