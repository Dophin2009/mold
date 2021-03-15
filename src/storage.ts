const ORIGINAL_KEY = "original";
const NEW_KEY = "new";

const storage = window.localStorage;

export function save(key: string, data: object): void {
    storage.setItem(key, JSON.stringify(data));
}

export function load<T>(key: string): T | undefined {
    const val = storage.getItem(key);
    if (!val) {
        return undefined;
    }
    return JSON.parse(val) as T;
}

export function saveImageData(originalURL: string, newURL: string): void {
    storage.setItem(ORIGINAL_KEY, originalURL);
    saveNewImage(newURL);
}

export function saveNewImage(url: string): void {
    storage.setItem(NEW_KEY, url);
}

export function loadImageData(): [string, string] | null {
    const originalURL = storage.getItem(ORIGINAL_KEY);
    const newURL = storage.getItem(NEW_KEY);
    if (!originalURL || !newURL) {
        clearImageData();
        return null;
    }
    return [originalURL, newURL];
}

export function clearImageData(): void {
    storage.removeItem(ORIGINAL_KEY);
    storage.removeItem(NEW_KEY);
}
