import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import MockAdapter from "axios-mock-adapter";
import { Base64Image } from '../domains/CapturedImage';
import { ClientMetadata } from '.';
import { BACK_END_HOST, REACT_APP_MOCK, REACT_APP_DEBUG, REACT_APP_COOKIE_NAME } from '../consts';

declare module 'axios' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}

export class ApiService {

    constructor(
        private _axios: AxiosInstance = wrapper(axios.create({
            baseURL: BACK_END_HOST,
            withCredentials: true,
            jar: new CookieJar()
        }))
    ) {
        if (REACT_APP_MOCK === 'true') {
            const mock: MockAdapter = new MockAdapter(_axios, { onNoMatch: 'throwException', delayResponse: 1000 })
            mock.onGet(/\/client\/web\/rest\/metadata.*/).reply(200, {
                wfmId: 990047422,
                iin: 930520311721,
                username: 'ALADEIS717\\Администратор',
                timestamp: '20.11.2020 15:53:39',
            })
                .onPut("/client/web/rest/fullframe").reply(200)
                .onPut("/client/web/rest/preview").reply(200)
        }

        if (REACT_APP_DEBUG === 'true') {
            _axios.interceptors.request.use(request => {
                console.log('Starting Request', JSON.stringify(request, null, 2))
                return request
            })
        }
    }

    addFullframe(metadata: ClientMetadata, faceImage: Base64Image, docImage: Base64Image) {
        return this._axios.put('/client/web/rest/fullframe', {
            _comment: 'empty comment',
            token: metadata.token,
            wfmId: metadata.wfmId,
            iin: metadata.iin,
            username: metadata.username,
            timestamp: metadata.timestamp,
            type: 'fullframe',
            camPic: faceImage,
            scanPic: docImage,
        }).catch(error => {
            throw error
        })
    }

    addPreview(metadata: ClientMetadata, faceImage: Base64Image, docImage: Base64Image) {
        return this._axios.put('/client/web/rest/preview', {
            _comment: 'empty comment',
            wfmId: metadata.wfmId,
            iin: metadata.iin,
            username: metadata.username,
            timestamp: metadata.timestamp,
            type: 'preview',
            camPic: faceImage,
            scanPic: docImage,
        }).catch(error => {
            throw error
        })
    }

    async getMetadata(sessionToken: string): Promise<ClientMetadata> {
        return await this._axios
            .get<ClientMetadata>(`/client/web/rest/metadata?sessionToken=${sessionToken}`)
            .then(body => {
                return body.data
            })
            .catch(error => {
                throw error
            })
    }

    async getSessionMetadata(): Promise<ClientMetadata> {
        return await this._axios
            .get<ClientMetadata>('/client/web/rest/metadata')
            .then(body => {
                return body.data
            })
            .catch(error => {
                throw error
            })
    }
}
