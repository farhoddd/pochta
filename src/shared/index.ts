import { useEffect, useRef } from 'react';

export const sleepForAnimate = (fn: () => any) => new Promise<number>((res) => res(requestAnimationFrame(fn)));
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const videoParam = { width: 1280, height: 720 }
//export const videoParam = { width: 680, height: 680 }


export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return
        }

        const id = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(id)
    }, [delay])
}

export function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the timeout.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return
        }

        const id = setTimeout(() => savedCallback.current(), delay)

        return () => clearTimeout(id)
    }, [delay])
}
