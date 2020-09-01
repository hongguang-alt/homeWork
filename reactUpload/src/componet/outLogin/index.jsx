import React from 'react'
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'
import jwt from 'jsonwebtoken'
import { useState, useEffect } from 'react';

const OutLogin = (props) => {
    const [name, setName] = useState('')

    useEffect(() => {
        let { name } = jwt.verify(window.localStorage.getItem('token'), 'yinxiu')
        setName(name)
    })
    //退出的函数
    const outLogin = () => {
        window.localStorage.removeItem("token")
        props.history.push('/')
    }
    const menu = (
        <Menu onClick={({ key }) => {
            if (key === 'out') {
                outLogin()
            }
        }}>
            <Menu.Item key='out'>
                退出
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                欢迎你，{name} <DownOutlined />
            </a>
        </Dropdown>
    )
}

const TOutLogin = withRouter(OutLogin)
export default TOutLogin