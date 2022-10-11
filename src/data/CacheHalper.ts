// import { Gzip, Gunzip} from 'zlibt2';

const localStorageKeys: string[] = []

export class CacheHalper {

    resetLocalStore() {
        if (typeof window === 'undefined') {
            return
        }
        localStorageKeys.forEach(key => {
            window.localStorage.removeItem(key)
        })
    }

    private circularReplacer = () => {

        // Creating new WeakSet to keep 
        // track of previously seen objects
        const seen = new WeakSet();

        return (key: any, value: any) => {
            // If type of value is an 
            // object or value is null
            if (typeof (value) === "object" &&
                value !== null) {

                // If it has been seen before
                if (seen.has(value)) {
                    return;
                }

                // Add current value to the set
                seen.add(value);
            }

            // return the value
            return value;
        };
    };

    async localSaved<T>(key: string, initialValue: () => T): Promise<T> {
        if (typeof window === 'undefined') {
            return await initialValue()
        }

        const item = window.localStorage.getItem(key)
        if (item !== null) {
            return JSON.parse(item)
        } else {
            const newValue = await initialValue()
            window.localStorage.setItem(key, JSON.stringify(newValue))
            localStorageKeys.push(key)
            return newValue
        }
    }

    // private compress(item: any) {
    //     const str = JSON.stringify(item, this.circularReplacer())
    //     const encoded: Uint8Array = new TextEncoder().encode(str)
    //     const compressed = new Gzip(encoded).compress() as Uint8Array
    //     console.log("compressed", compressed)
    //     return new TextDecoder().decode(compressed)
    // }

    // private decompress(item : string) {
    //     const compressed: Uint8Array = new TextEncoder().encode(item)
    //     console.log("compressed", compressed)
    //     const unziped = new Gunzip(compressed).decompress()
    //     const str = new TextDecoder().decode(unziped)
    // }
}
