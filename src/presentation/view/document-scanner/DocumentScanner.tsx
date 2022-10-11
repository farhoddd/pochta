import { IdcardOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import './document-scanner.css';
import { Nullable } from '../../../shared/typings';
import { CapturedImage } from '../../../domains/CapturedImage';
import { DocumentScannerViewModel } from '../../view-model/document-scanner/DocumentScannerViewModel';

export type DocumentScannerProps = {
    vm: DocumentScannerViewModel;
    next: () => void;
};

type DocumentScannerState = {
    errMessage: string;
    loading: boolean;
    streaming: boolean;
    capturedImage: Nullable<CapturedImage>;
};

export function DocumentScanner({ vm, next }: DocumentScannerProps): JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [state, setState] = useState<DocumentScannerState>({
        errMessage: '',
        loading: false,
        streaming: false,
        capturedImage: null,
    });

    useEffect(() => {
        if (videoRef.current !== null) {
            vm.videoElement = videoRef.current;
        }

        vm.attachView(() => {
            setState({
                loading: vm.loading,
                streaming: vm.streaming,
                errMessage: vm.errMessage,
                capturedImage: vm.capturedImage,
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

    return (
        <div className="doc app__doc">
            <div className="doc__video">
                {!state.streaming ? (
                    <div className="doc__icon">
                        <IdcardOutlined />
                    </div>
                ) : (
                    <>
                        <div className="doc__contur" />
                        <div className="doc__square" />
                    </>
                )}
                <video ref={videoRef} />
            </div>
            {/* <ImageUploadContainer next={next} /> */}
            
        </div>
    );
}
