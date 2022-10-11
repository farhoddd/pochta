import { VideoCameraAddOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import './face-scanner.css';
import type { FaceScannerViewModel } from '../../view-model/face-scanner/FaceScannerViewModel';
import { Nullable } from '../../../shared/typings';
import { useInterval, useTimeout } from '../../../shared/';
import { CapturedImage } from '../../../domains/CapturedImage';
import { Spin } from 'antd';
import { FaceValidations } from '../data-of-worker/FaceValidations';
import { ValidationState } from '../../../validation';

type FaceScannerProps = {
    vm: FaceScannerViewModel;
    next: () => void;
};

type FaceScannerState = {
    errMessage: string;
    loading: boolean;
    streaming: boolean;
    capturedImage: Nullable<CapturedImage>;
};

export type DataOfState = {
    _smiling: boolean;
    _blinking: boolean;
    _glasses: boolean;
    _faceInSize: boolean;
    _docInSize: boolean;
    _faceValid: boolean;
    _docValid: boolean;
};

export function FaceScanner({ vm, next }: FaceScannerProps): JSX.Element {
    const validationState = ValidationState.getInstance()
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoad, setIsLoad] = useState(true)
    const [dataOfValidation, setDataOfValidation] = useState<DataOfState>({
        _smiling: validationState.smiling,
        _blinking: validationState.blinking,
        _glasses: validationState.glasses,
        _faceInSize: validationState.faceInSize,
        _docInSize: validationState.docInSize,
        _faceValid: validationState.faceValid,
        _docValid: validationState.docValid,
    })
    const [state, setState] = useState<FaceScannerState>({
        errMessage: '',
        loading: false,
        streaming: false,
        capturedImage: null
    });

    useTimeout(() => {
        setIsLoad(false)
    }, 5000);

    useInterval(() => {
        setDataOfValidation({
            _smiling: validationState.smiling,
            _blinking: validationState.blinking,
            _glasses: validationState.glasses,
            _faceInSize: validationState.faceInSize,
            _docInSize: validationState.docInSize,
            _faceValid: validationState.faceValid,
            _docValid: validationState.docValid,
        })
    }, 1000);

    useEffect(() => {

        if (videoRef.current !== null) {
            vm.videoElement = videoRef.current;
        }

        vm.attachView(() => {
            setState({
                loading: vm.loading,
                streaming: vm.streaming,
                errMessage: vm.errMessage,
                capturedImage: vm.capturedImage
            });
        });

        vm.startVideo();

        return () => {
            vm.detachView();
        };
    }, [vm]);

    useEffect(() => {
        if (vm.capturedImage != null) {
            next();
        }
    }, [vm.capturedImage, next]);

    return (<Spin spinning={isLoad} tip="Загрузка..." size="large">
        <div className="app__face face">
            <div className="face__video">
                {!state.streaming ? (
                    <div className="face__icon">
                        <VideoCameraAddOutlined />
                    </div>
                ) : (
                    <>
                        <div className="face__contur" />
                        <div className="face__square" />
                    </>
                )}

                <video ref={videoRef} />
            </div>
            <div className="face__checkbox">
                <div className="face__checkbox-inner">

                    <FaceValidations state={dataOfValidation} />
                </div>
            </div>
        </div>
    </Spin>
    );
}
