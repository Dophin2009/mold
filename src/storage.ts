// Keys to use when we persist the image data into the browser storage.
const ORIGINAL_KEY = "original";
const NEW_KEY = "new";

// To access the local browser storage, we have to use `window.localStorage`.
const storage = window.localStorage;

// Save an arbitrary object to the storage with the given key.
export function save(key: string, data: Record<string, unknown>): void {
    storage.setItem(key, JSON.stringify(data));
}

// Load the value with the given key from the storage and parse it into the
// type T.
// Return undefined if no such key exists in the storage.
export function load<T>(key: string): T | undefined {
    const val = storage.getItem(key);
    if (!val) {
        return undefined;
    }
    return JSON.parse(val) as T;
}

// We call this to save the given image data URLs to the storage.
export function saveImageData(originalURL: string, newURL: string): void {
    // Use `window.localStorage.setItem()` to save a value.
    storage.setItem(ORIGINAL_KEY, originalURL);
    saveNewImage(newURL);
}

export function saveNewImage(url: string): void {
    storage.setItem(NEW_KEY, url);
}

// This function loads the image data URLs from the storage, returning
// undefined if it doesn't exist.
//
// [string, string] | undefined tells the compiler that we're return either a
// tuple of two strings or nothing.
export function loadImageData(): [string, string] | undefined {
    // Use `window.localStorage.getItem()` to load a value.
    const originalURL = storage.getItem(ORIGINAL_KEY);
    const newURL = storage.getItem(NEW_KEY);
    if (!originalURL || !newURL) {
        clearImageData();
        return undefined;
    }
    return [originalURL, newURL];
}

// This function clears image data URLs from the storage.
export function clearImageData(): void {
    storage.removeItem(ORIGINAL_KEY);
    storage.removeItem(NEW_KEY);
}
