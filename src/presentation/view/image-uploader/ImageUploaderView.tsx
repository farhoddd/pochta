import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './image-uploader.css';
import { BACK_END_HOST } from '../../../consts';

function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export function ImageUploaderView({next,vm}:any) {

    let uploadImage = document.getElementById("uploadImage")
    

    const [state, setState] = useState({
        loading: false,
        errMessage: '',
        capturedImage: null,
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        file: null,
        fileList: [
            // {
            //     uid: '-1',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-2',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-xxx',
            //     percent: 50,
            //     name: 'image.png',
            //     status: 'uploading',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-5',
            //     name: 'image.png',
            //     status: 'error',
            // },
        ],
    });
    
    useEffect(() => {
        if (uploadImage !== null) {
            vm.imageElement = uploadImage;
            
        }

        vm.attachView(() => {
            setState((s)=>{
                return { ...s,
                loading: vm.loading,
                errMessage: vm.errMessage,
                capturedImage: vm.capturedImage,
                }
            });
        });
        return () => {
            vm.detachView();
        };
    }, [vm,uploadImage]);

    useEffect(() => {
        if (vm.capturedImage != null) {
            next();
        }
    }, [vm.capturedImage, next]);

    const handleCancel = () => setState((s) => ({ ...s, previewVisible: false }));

    const handlePreview = async (file: any) => {
        
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setState((s) => ({
            ...s,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        }));
    };

    const handleChange = (file: any) => {
        
        console.log(file,"file")
        return setState((s) => ({ ...s, file }))}

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div className="image-uploader">
            
            <input type="file" id="uploadImage" />
            <Upload
                action={BACK_END_HOST + '/upload'}
                listType="picture-card"
                accept=".jpg,.jpeg"
                fileList={state.fileList as any}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {state.fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={state.previewVisible} title={state.previewTitle} footer={null} onCancel={handleCancel}>
                <img id='imagee' alt="image-uploader__image" style={{ width: '100%' }} src={state.previewImage} />
            </Modal>
        </div>
    );
}
