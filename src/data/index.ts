import { ApiService } from "./ApiService";
import { CacheHalper } from "./CacheHalper";

export type ClientMetadata = {
    token: string,
    wfmId: number,
    iin: number,
    username: string,
    timestamp: string,
    error?: string
};

export { ApiService }
export { CacheHalper }
