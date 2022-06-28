import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;
export default function Home() {
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [barChart, setBarChart] = useState(null)
  const [pieChart, setPieChart] = useState(null)
  const [visible, setVisible] = useState(false)
  const [allList, setAllList] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then((res) => {
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then((res) => {
      setStarList(res.data)
    })
  }, [])
  const barRef = useRef()
  const pieRef = useRef()
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then((res) => {
      setAllList(res.data)
      renderBarView(_.groupBy(res.data, (item) => item.category.title))
    })
    return () => { window.onresize = null }
  }, [])
  // 渲染柱状图
  const renderBarView = (obj) => {
    var myChart;
    if (!barChart) {
      myChart = echarts.init(barRef.current);
      setBarChart(myChart)
    } else { myChart = barChart }
    var option = {
      title: {
        text: '新闻分类展示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        // 最小间隔
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  // 渲染饼状图
  const renderPieView = () => {
    var myChart
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart)
    } else { myChart = pieChart }
    var option

    var currentList = allList.filter((item) => {return item.author === username })
    var groupObj = _.groupBy(currentList , item => item.category.title)
    console.log(groupObj);
    var list = []
    for(var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }
    option = {
      title: {
        text: '当前用户新闻分析图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最长浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setTimeout(() => {
                  setVisible(true)
                  renderPieView()
                }, 0);
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b style={{ paddingRight: '10px' }}>{region ? region : '全球'}</b>
                  <b>{roleName}</b>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer width={'500px'} title="Basic Drawer" placement="right" onClose={() => { setVisible(false) }} visible={visible}>
        <div style={{ width: '100%', height: '400px', marginTop: '30px' }} ref={pieRef}></div>
      </Drawer>
      <div style={{ width: '100%', height: '400px', marginTop: '30px' }} ref={barRef}></div>
    </div>

  )
}
