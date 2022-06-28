import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'

function usePublish(type) {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then((res) => {
            setDataSource(res.data)
        })
    }, [])
    const newsPublish = (id) => {
        axios.patch(`/news/${id}`, {
            'publishState': 2
        }).then(() => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已发布】中查看您的新闻`,
                placement: 'bottomRight',
            });
            axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then((res) => {
                setDataSource(res.data)
            })
        })
    }

    const newsSunset = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 3
        }).then(() => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已下线】中查看您的新闻`,
                placement: 'bottomRight',
            });
            axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then((res) => {
                setDataSource(res.data)
            })
        })
    }
    const newsDelete = (id) => {
        axios.delete(`/news/${id}`).then(() => {
            notification.info({
                message: `通知`,
                description:
                    `您的新闻已被删除`,
                placement: 'bottomRight',
            });
            axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then((res) => {
                setDataSource(res.data)
            })
        })
    }
    return {
        dataSource,
        newsPublish,
        newsSunset,
        newsDelete
    }
}

export default usePublish