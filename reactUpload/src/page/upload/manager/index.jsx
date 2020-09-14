import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { URL } from '../../../config'
import { Card, Button, Table, Space, Modal, Form, Input, message, Empty } from 'antd'
import { noHomeWorkListName, changeFileFormat, detailList, deleteAll, deteleOne, changefileName } from '../../../axios/api'
const { confirm } = Modal;


const CollectionCreateForm = ({ visible, onCreate, onCancel, initName }) => {
    const [editform] = Form.useForm();
    useEffect(() => {
        if (editform) {
            editform.setFieldsValue({
                name: initName
            })
        }
    })
    return (
        <Modal
            visible={visible}
            destroyOnClose={true}
            title="重命名"
            okText="确定"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                editform
                    .validateFields()
                    .then((values) => {
                        // editform.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('验证失败', info);
                    });
            }}
        >
            <Form
                form={editform}
                name="form_in_modal"
                initialValues={{
                    name: initName,
                }}
            >
                <Form.Item
                    name="name"
                    label="文件名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入重名名的文件名称',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};


const ReNameForm = ({ visible, onCreate, onCancel }) => {
    const [editform] = Form.useForm();
    return (
        <Modal
            visible={visible}
            destroyOnClose={true}
            title="导出文件名称"
            okText="确定"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                editform
                    .validateFields()
                    .then((values) => {
                        editform.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('验证失败', info);
                    });
            }}
        >
            <Form
                form={editform}
                name="form_in_modal"
                initialValues={{
                    name: '网络工程171.zip',
                }}
            >
                <Form.Item
                    name="name"
                    label="文件名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入重名名的文件名称',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const Manager = () => {
    const [noHomeWorkList, setNoHomeWorkList] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [editVisible, setEditVisible] = useState(false)
    const [initName, setInitName] = useState('')
    const [changeSid, setChangeSid] = useState('')
    const [reNameVisible, setReNameVisible] = useState(false)
    const [form] = Form.useForm()


    useEffect(() => {
        getNoHomeWorkList()
        getDetailList()
    }, [])

    const onFinish = (value) => {
        toChangeFileFormat(value)
        form.resetFields()
    }

    //获取全部文件
    const getAllFile = async (name) => {
        const token = window.localStorage.getItem('token')
        window.location.assign(`${URL}/file/downloadall/` + name + '/' + token)
    }

    //导出单个文件
    const getOneFile = async (name) => {
        const token = window.localStorage.getItem('token')
        window.location.assign(`${URL}/file/download/` + name + '/' + token)
    }

    //修改文件名称的接口
    const toChangeFileFormat = async (param) => {
        try {
            let { msg, status } = await changeFileFormat(param)
            if (status == '200') {
                message.success('修改成功')
            } else {
                message.error(msg)
            }
        } catch (e) {
            console.log(e)
            message.error("访问修改接口失败")
        }
    }


    //获取未完成作业的列表
    const getNoHomeWorkList = async () => {
        try {
            let { data, status, msg } = await noHomeWorkListName()
            if (status == '200') {
                message.success('获取未完成作业列表成功')
                setNoHomeWorkList(data.data)
            } else {
                message.error(msg)
            }
        } catch (e) {
            console.log(e)
            message.error('获取未完成作业接口失败')
        }
    }

    //获取文件详情数据的接口
    const getDetailList = async () => {
        try {
            let { data, status, msg } = await detailList()
            if (status == '200') {
                message.success('获取列表成功')
                setDataSource(data.data)
            } else {
                message.error(msg)
            }
        } catch (e) {

        }
    }


    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '学号',
            dataIndex: 'sid',
            key: 'sid',
            sorter: (a, b) => Number(a.sid) - Number(b.sid)
        }, {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName'
        },
        {
            title: '提交时间',
            dataIndex: 'ctime',
            key: 'ctime',
            sorter: (a, b) => new Date(a.ctime).getTime() - new Date(b.ctime).getTime(),
            render: (text) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                return <Space size="middle">
                    <a onClick={() => toDeleteData(record)}>删除</a>
                    <a onClick={() => {
                        setEditVisible(true)
                        setInitName(record.fileName)
                        setChangeSid(record.sid)
                    }}>编辑</a>
                    <a onClick={() => {
                        getOneFile(record.fileName)
                    }}>导出</a>
                </Space>
            }
        }
    ];

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
            offset: 10,
            span: 14,
        },
    }

    const toDeleteData = (record) => {
        confirm({
            title: '确定删除这条数据?',
            okText: "确认",
            cancelText: "取消",
            onOk: async () => {
                try {
                    const { status, msg } = await deteleOne({ name: record.fileName })
                    if (status === '200') {
                        message.success('删除文档成功')
                        getDetailList()
                        getNoHomeWorkList()
                    } else {
                        message.error(msg)
                    }
                } catch (e) {
                    console.log(e)
                    message.error('删除单个接口失败')
                }

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const toDeleteAll = () => {
        confirm({
            title: '确定清空数据?',
            okText: "确认",
            cancelText: "取消",
            onOk: async () => {
                try {
                    const { status, msg } = await deleteAll()
                    if (status == '200') {
                        message.success('删除全部文档成功')
                        getDetailList()
                        getNoHomeWorkList()
                    } else {
                        message.error(msg)
                    }
                } catch (e) {
                    message.error('删除全部接口失败')
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    //修改文件名称的表单
    const onCreate = async (value) => {
        let newValue = {
            ...value,
            sid: changeSid
        }
        try {
            let { status, msg } = await changefileName(newValue)
            if (status === '200') {
                message.success(msg)
                setEditVisible(false)
                getDetailList()
            }
        } catch (e) {
            message.error(e)
        }
    }
    const onReNameCreate = (value) => {
        getAllFile(value.name)
        setReNameVisible(false)
    }
    return (
        <React.Fragment>
            <h3>管理作业</h3>
            <Card title='作业未上交名单' style={{ marginBottom: '50px' }} >
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                        Array.isArray(noHomeWorkList) && noHomeWorkList.length !== 0 ? noHomeWorkList.map((item, index) => {
                            return <div key={index} style={{ width: '50px', textAlign: 'center', bold: 'bolder' }}>{item}</div>
                        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </div>
            </Card>
            <Card title='作业内容' style={{ marginBottom: '50px' }}>
                <div style={{ width: '600px', margin: 'auto' }}>
                    <Form
                        {...layout}
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            label="上传作业内容"
                            name="content"
                            rules={[{ required: true, message: '请输入作业内容' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="命名格式"
                            name="format"
                            rules={[{ required: true, message: '请输入命名格式' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="详细说明"
                            name="detail"
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                        </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
            <Card title='作业列表' extra={
                <div>
                    <Button type='primary' style={{ fontSize: "14px" }} onClick={() => { setReNameVisible(true) }}>全部导出</Button>
                    <Button type='primary' style={{ fontSize: "14px", marginLeft: '10px' }} onClick={toDeleteAll}>清空数据</Button>
                </div>}>
                <Table dataSource={dataSource} columns={columns} />
            </Card>
            <CollectionCreateForm
                visible={editVisible}
                onCreate={onCreate}
                onCancel={() => {
                    setEditVisible(false);
                }}
                initName={initName}
            />
            <ReNameForm
                visible={reNameVisible}
                onCreate={onReNameCreate}
                onCancel={() => {
                    setReNameVisible(false);
                }}
            />
        </React.Fragment>
    )
}

export default Manager