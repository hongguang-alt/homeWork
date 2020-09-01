import React, { useState } from 'react'
import { Layout, Card, Form, Input, Button, message, Spin } from 'antd';
import { login } from '../../axios/api'
const { Header, Footer, Content } = Layout;

const Login = (props) => {
    const [errInfo, setErrInfo] = useState('')
    const [loading, setLoading] = useState(false)
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    }
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    }
    //表单验证成功
    const onFinish = async (value) => {
        try {
            setLoading(true)
            const { status, msg, token } = await login(value)
            if (status === '201') {
                setLoading(false)
                setErrInfo(msg)
            } else {
                setErrInfo('')
                setLoading(false)
                window.localStorage.setItem('token', token)
                props.history.push('/upload')
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <React.Fragment>
            <Layout style={{ height: '100%' }}>
                <Header style={{ textAlign: 'center', color: 'white', fontSize: '20px' }}>
                    作业上交系统
                </Header>

                <Content style={{ margin: 'auto', marginTop: '100px' }}>
                    <Spin tip='请求中' spinning={loading}>
                        <Card title="登陆" style={{ width: 500 }}>
                            <Form
                                {...layout}
                                name="basic"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label="学号"
                                    name="sid"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入你的学号！',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入你的密码！',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                {errInfo ? <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{errInfo}</div> : ''}
                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">
                                        登陆
                                </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Spin>
                </Content>
                <Footer style={{ background: '#041527', color: 'white', textAlign: 'center' }}>
                    @网络工程171
                </Footer>
            </Layout>
        </React.Fragment>
    )
}

export default Login