import React, { useState } from 'react'
import { AppstoreOutlined, SettingOutlined, FormOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd'
import ChangePassword from './changePassword'
import UploadWork from './uploadWork'
import OutLogin from '../../componet/outLogin'
import Manager from './manager'
import { useEffect } from 'react';
import { sercet } from '../../config'
import jwt from 'jsonwebtoken'
const { Header, Content, Sider } = Layout;



const Upload = () => {
    const [show, setShow] = useState('uploadwork')
    const [role, setRole] = useState('student')

    useEffect(() => {
        let { role } = jwt.verify(window.localStorage.getItem('token'), sercet)
        setRole(role)
    })
    const getRight = () => {
        if (show === 'changep') {
            return <ChangePassword />
        } else if (show === 'uploadwork') {
            return <UploadWork />
        } else if (show === 'manager') {
            return <Manager />
        }
    }
    return (
        <React.Fragment>
            <Layout style={{ height: '100%' }}>
                <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1 style={{ color: '#fff' }}>作业上传</h1>
                    <OutLogin />
                </Header>
                <Layout>
                    <Sider style={{ overflow: 'hidden', background: 'white' }}>
                        <Menu style={{ borderRight: 0, fontSize: '14px' }}
                            defaultSelectedKeys={['uploadwork']}
                            onClick={({ item, key, keyPath, domEvent }) => {
                                setShow(key)
                            }}

                        >
                            <Menu.Item key="uploadwork" icon={<AppstoreOutlined />} >
                                上传作业文件
                            </Menu.Item>
                            <Menu.Item key="changep" icon={<FormOutlined />}>
                                修改密码
                            </Menu.Item>
                            {
                                role === 'admin' ? <Menu.Item key="manager" icon={<SettingOutlined />}>
                                    管理作业
                            </Menu.Item> : null
                            }

                        </Menu>
                    </Sider>
                    <Content>
                        <div style={{ padding: 30 }}>
                            {getRight()}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </React.Fragment>
    )
}

export default Upload