import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

// 使用forwardRef,并传入ref,在form表单中进行ref绑定,就可以将form表单元素的值带给父组件
const UserForm = forwardRef((props, ref) => {
    const { Option } = Select
    const [isDisabled, setIsDisabled] = useState(false)
    useEffect(() => {
        setIsDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    // 获取token信息进行对比
    const { roleId, role: { roleName }, region } = JSON.parse(localStorage.getItem('token'))
    // 如果你是亚洲的，地区就只能选亚洲，添加也是。这个回调主要用来判断，地区每个option不可选
    const checkRegionDisabled = (item) => {
        // 判断是否为更新
        if (props.isUpdate) {
            // 判断是否为管理员
            if (roleId === 1) {
                // 为管理员就不禁用
                return false
            } else {
                // 不是管理员就直接禁用
                return true
            }
        }
        // 为添加用户，地区的option只有自己区的可以选 
        else {
            // 管理员就不禁用
            if (roleId === 1) {
                return false
            } else {
                // 如果是同一地区，就返回false
                return region !== item.value
            }
        }
    }
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        }
        else {
            if (roleId === 1) {
                return false
            } else {
                return item.id !== 3
            }
        }
    }

    return (
        <div>
            <Form
                ref={ref}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisabled ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Select disabled={isDisabled}>
                        {
                            props.region.map((item) => {
                                // disabled中不能写箭头函数，箭头函数是把一个函数的返回值为函数给你调用，但是disabled没有能触发的事件，他只是需要一个true或者false
                                return <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Select onChange={(value) => {
                        if (value == 1) {
                            setIsDisabled(true)
                            ref.current.setFieldsValue({
                                region: ''
                            })
                        }
                        else {
                            setIsDisabled(false)

                        }
                    }}>
                        {
                            props.roleList.map((item) => {
                                return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form></div>
    )
})


export default UserForm
