import { Image } from "image-js";

import * as util from "./util";
import * as storage from "./storage";

// We need to get the file data, read it, and store it.
function handleFileUpload(event: Event): void {
    // Get the file object.
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    if (!fileList) {
        return;
    }
    const file = fileList[0];

    // We need to actually read the file into a data url.
    // We do this by using FileReader.readAsDataURL() below.
    const reader = new FileReader();

    // Let's also display a primitive progress bar for the reading.
    const formBox = util.getUploadFormBox();
    const progressBarBox = util.getUploadFormProgressBox();
    reader.onloadstart = (_event: ProgressEvent<FileReader>) => {
        // Unhide the progress bar.
        progressBarBox.style.display = "block";
        // Hide the form button.
        formBox.style.display = "none";
    };

    const progressBar = util.getUploadFormProgress();
    reader.onprogress = (event: ProgressEvent<FileReader>) => {
        const value = event.loaded;
        const max = event.total;
        progressBar.value = value;
        progressBar.max = max;
    };

    // When it successfully finishes reading, we can load the image editor.
    reader.onload = (event: ProgressEvent<FileReader>) => {
        const reader = event.target as FileReader;
        const url = reader.result as string;

        initEditor(url, url);
    };

    reader.readAsDataURL(file);
}

function hideUpload() {
    const uploadBox = util.getUploadBox();
    uploadBox.style.display = "none";
}

function initEditor(originalURL: string, newURL: string) {
    // Hide the upload form.
    hideUpload();

    // Save the image URLs.
    storage.saveData(originalURL, newURL);

    // Show the editor.
    const box = util.getEditorBox();
    box.style.display = "block";

    // Set the image element sources.
    const imageOriginal = util.getEditorImageOriginal();
    const imageNew = util.getEditorImageNew();
    imageOriginal.src = originalURL;
    imageNew.src = newURL;

    // Load it into image-js for transformation.
    const image = Image.load(newURL);
}

function reloadImage(image: Image) {
    const url = image.toDataURL();
    const imageNew = util.getEditorImageNew();
    imageNew.src = url;

    // Save the image URLs.
    storage.saveNewURL(url);
}

// Initialization function.
function init() {
    // First check to see if the local storage has images saved.
    // If there is, then just load the editor right away.
    // If not, we have to show the upload button.
    const savedData = storage.loadData();
    if (savedData) {
        const [originalURL, newURL] = savedData;
        initEditor(originalURL, newURL);
        return;
    }

    // We need to get the file upload <input> element and add a listener for
    // "change" events.
    // When the user uploads a file, we'll set the global `image` variable.
    const uploadForm = util.getUploadForm();
    uploadForm.addEventListener("change", (event) => handleFileUpload(event));
}

(function () {
    init();
})();
