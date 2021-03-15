export function uploadBox(): HTMLDivElement {
    return getElementById("upload-box");
}

// Get a reference to the file upload <input> element.
// Ignore the null check.
export function uploadForm(): HTMLInputElement {
    return getElementById("upload-form");
}

export function uploadFormBox(): HTMLDivElement {
    return getElementById("upload-form-box");
}

// Get a reference to the file upload progress bar <progress> element.
export function uploadFormProgress(): HTMLProgressElement {
    return getElementById("upload-form-progress");
}

export function uploadFormProgressBox(): HTMLProgressElement {
    return getElementById("upload-form-progress-box");
}

export function editorBox(): HTMLDivElement {
    return getElementById("editor-box");
}

export function editorImageOriginal(): HTMLImageElement {
    return getElementById("editor-image-original");
}

export function editorImageNew(): HTMLImageElement {
    return getElementById("editor-image-new");
}

export function editorDiscardButton(): HTMLButtonElement {
    return getElementById("editor-discard-button");
}

export function editorUndoButton(): HTMLButtonElement {
    return getElementById("editor-controls-undo");
}

export function editorDownloadAnchor(): HTMLAnchorElement {
    return getElementById("editor-download-anchor");
}

export function editorOptions(): HTMLDivElement {
    return getElementById("editor-options-box");
}

export function editorGreyscaleButton(): HTMLButtonElement {
    return getElementById("editor-greyscale-button");
}

export function editorBlurForm(): HTMLFormElement {
    return getElementById("editor-blur-form");
}

export function editorBlurInput(): HTMLInputElement {
    return getElementById("editor-blur-input");
}

export function editorRotateForm(): HTMLFormElement {
    return getElementById("editor-rotate-form");
}

export function editorRotateInput(): HTMLInputElement {
    return getElementById("editor-rotate-input");
}

export function getElementById<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
}
