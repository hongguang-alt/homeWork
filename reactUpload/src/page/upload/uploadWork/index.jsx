import React, { useState, useEffect } from 'react'
import { Card, Button, Upload, message, Empty } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { getFileName, upload, getUploadName } from '../../../axios/api'

const UploadWork = () => {
    const [fileList, setFileList] = useState([])
    const [uploading, setUploading] = useState(false)
    const [fileName, setFileName] = useState({})
    const [uploadName, setUploadName] = useState('')

    //初始化数据
    useEffect(() => {
        toGetFileName()
        toUploadName()
    }, [])

    //获取文件名以及格式
    const toGetFileName = async () => {
        try {
            let { status, data, msg } = await getFileName()
            if (status === '200') {
                setFileName(data)
            } else {
                message.error(msg)
            }
        } catch (e) {
            message.error('请求文件名称接口失败')
        }
    }

    //上传文件的接口
    const toUpload = async (formdata) => {
        try {
            let { status, msg } = await upload(formdata)
            if (status === '200') {
                setFileList([])
                setUploading(false)
                toUploadName()
                message.success('上传成功')
            } else {
                message.error(msg)
                setUploading(false)
            }
        } catch (e) {
            message.error('请求上传接口失败')
            setUploading(false)
        }
    }

    //获取上传文件名称的接口
    const toUploadName = async () => {
        try {
            let res = await getUploadName()
            if (res.status === '200') {
                const { data } = res
                setUploadName(data.fileName)
            } else {
                message.error('请求上传文件名称接口失败')
            }
        } catch (e) {
            message.error('请求上传文件名称接口失败')
        }
    }

    const props = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1)
            setFileList(newFileList)
        },
        beforeUpload: file => {
            setFileList([file])
            return false;
        },
        fileList,
    };

    const handleUpload = () => {
        setUploading(true)
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file);
        })
        toUpload(formData)
    }

    return <React.Fragment>
        <h3>上传作业</h3>
        <Card title='上传要求' style={{ width: '100%', marginBottom: '50px' }}>
            <div style={{ textAlign: 'center' }}>
                <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>本次上传的作业：</span>
                    <span style={{ color: 'red' }}>{fileName.content}</span>
                </div>
                <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>命名方式：</span>
                    <span style={{ color: 'red' }}>{fileName.format}</span>
                </div>
                {fileName.detail ? <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>详细说明：</span>
                    <span style={{ color: 'red' }}>{fileName.detail}</span>
                </div> : ''}
            </div>
        </Card>
        <Card title='上传内容'>
            <div style={{ marginBottom: 15 }}>
                {uploadName ? <div>你已经上传了文件<a>{uploadName}</a>文件</div> : <div>你还没有上传任何文件，点击上传按钮进行上传</div>}
            </div>
            <Upload {...props}>
                <Button>
                    <UploadOutlined />  上传
                </Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? '上传中' : '开始上传'}
            </Button>
        </Card>
    </React.Fragment >
}

export default UploadWork