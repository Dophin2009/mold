const ORIGINAL_KEY = "original";
const NEW_KEY = "new";

const storage = window.localStorage;

export function saveData(originalURL: string, newURL: string): void {
    storage.setItem(ORIGINAL_KEY, originalURL);
    saveNewURL(newURL);
}

export function saveNewURL(url: string): void {
    storage.setItem(NEW_KEY, url);
}

export function loadData(): [string, string] | null {
    const originalURL = storage.getItem(ORIGINAL_KEY);
    const newURL = storage.getItem(NEW_KEY);
    if (!originalURL || !newURL) {
        clearData();
        return null;
    }
    return [originalURL, newURL];
}

export function clearData(): void {
    storage.removeItem(ORIGINAL_KEY);
    storage.removeItem(NEW_KEY);
}
