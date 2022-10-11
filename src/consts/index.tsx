export const BACK_END_HOST = (window as any)._env_?.REACT_APP_BACK_END || process.env.REACT_APP_BACK_END
export const REACT_APP_DEBUG = (window as any)._env_?.REACT_APP_DEBUG || process.env.REACT_APP_DEBUG
export const REACT_APP_MOCK = (window as any)._env_?.REACT_APP_MOCK || process.env.REACT_APP_MOCK
export const REACT_APP_COOKIE_NAME= (window as any)._env_?.REACT_APP_COOKIE_NAME || process.env.REACT_APP_COOKIE_NAME
export const PUBLIC_URL = process.env.PUBLIC_URL

console.log('REACT_APP_BACK_END=' + BACK_END_HOST)
console.log('REACT_APP_MOCK=' + REACT_APP_MOCK)
