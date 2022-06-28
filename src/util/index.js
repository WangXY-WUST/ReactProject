import axios from "axios";
import {store} from '../redux/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'


axios.defaults.baseURL = 'http://localhost:5000'

//请求拦截器：发送请求之前，请求拦截器可以检测到，可以在请求发出之前做一些事情
axios.interceptors.request.use((config) => {
    // 显示loading
    store.dispatch({
        type:'change_loading',
        payload:true
    })
    //进度条开始
    nprogress.start()
    //config配置对象，对象里有一个属性很重要，headers请求头
    return config
})

//响应拦截器
axios.interceptors.response.use((res) => {
    //成功的回调函数

    // 隐藏loading
    store.dispatch({
        type:'change_loading',
        payload:false
    })
    //进度条结束
    nprogress.done()
    return res
}, (error) => {
    //失败的回调
    return Promise.reject(new Error('faile'))
})