import React from 'react'
import { Card, Input, Form, Button, message } from 'antd'
import { password } from '../../../axios/api'

const ChangePassword = () => {
    const [form] = Form.useForm();

    //布局
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 10, span: 14 },
    };
    const onFinish = async values => {
        getPassword(values)
        try {
            await form.resetFields()

        } catch (e) {
            console.log(e)
        }
    };


    //调用修改密码的接口
    const getPassword = async (values) => {
        try {
            let { status, msg } = await password(values)
            if (status == '200') {
                message.success('修改成功')
            } else {
                message.error(msg)
            }
        } catch (e) {
            message.error('修改密码接口请求失败')
        }

    }

    return (
        <React.Fragment>
            <h3>修改密码</h3>
            <Card style={{ width: '100%' }}>
                <div style={{ width: '300px', margin: "auto" }}>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            label="旧密码"
                            name="oldPassword"
                            rules={[{ required: true, message: '请输入旧密码!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="新密码"
                            name="newPassword"
                            rules={[{ required: true, message: '请输入新密码!' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (value && getFieldValue('oldPassword') === value) {
                                        return Promise.reject('新密码不能和旧密码相同!');
                                    }
                                    return Promise.resolve();
                                },
                            }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                        </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </React.Fragment>
    )
}

export default ChangePassword