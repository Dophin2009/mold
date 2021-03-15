export function getUploadBox(): HTMLDivElement {
    return getElementById("upload-box");
}

// Get a reference to the file upload <input> element.
// Ignore the null check.
export function getUploadForm(): HTMLInputElement {
    return getElementById("upload-form");
}

export function getUploadFormBox(): HTMLDivElement {
    return getElementById("upload-form-box");
}

// Get a reference to the file upload progress bar <progress> element.
export function getUploadFormProgress(): HTMLProgressElement {
    return getElementById("upload-form-progress");
}

export function getUploadFormProgressBox(): HTMLProgressElement {
    return getElementById("upload-form-progress-box");
}

export function getEditorBox(): HTMLDivElement {
    return getElementById("editor-box");
}

export function getEditorImageOriginal(): HTMLImageElement {
    return getElementById("editor-image-original");
}

export function getEditorImageNew(): HTMLImageElement {
    return getElementById("editor-image-new");
}

function getElementById<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
}
