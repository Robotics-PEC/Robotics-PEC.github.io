export const sessionStorageAdapter = {
    getItem: (key: string) => {
        if (typeof window !== 'undefined') {
            return window.sessionStorage.getItem(key);
        }
        return null;
    },
    setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, value);
        }
    },
    removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(key);
        }
    }
};