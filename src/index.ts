import { Image } from "image-js";

import * as util from "./util";
import * as storage from "./storage";
import * as im from "./image";

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
    const formBox = util.uploadFormBox();
    const progressBarBox = util.uploadFormProgressBox();
    reader.onloadstart = (_event: ProgressEvent<FileReader>) => {
        // Unhide the progress bar.
        progressBarBox.style.display = "block";
        // Hide the form button.
        formBox.style.display = "none";
    };

    const progressBar = util.uploadFormProgress();
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

        // Clear the file list.
        const form = util.uploadForm();
        form.value = "";

        resetUpload();
        loadEditor(url, url);
    };

    reader.readAsDataURL(file);
}

function resetUpload() {
    const formBox = util.uploadFormBox();
    formBox.style.display = "block";

    const progressBarBox = util.uploadFormProgressBox();
    progressBarBox.style.display = "none";

    const progressBar = util.uploadFormProgress();
    progressBar.value = 0;
}

function hideUpload() {
    const uploadBox = util.uploadBox();
    uploadBox.style.display = "none";
}

function unhideUpload() {
    const uploadBox = util.uploadBox();
    uploadBox.style.display = "block";
}

function resetEditor() {
    hideEditorOptions();
}

function hideEditor() {
    const box = util.editorBox();
    box.style.display = "none";
}

// Show the editor.
function unhideEditor() {
    const box = util.editorBox();
    box.style.display = "block";
}

function hideEditorOptions() {
    const optionsBox = util.editorOptions();
    optionsBox.style.display = "none";
}

function unhideEditorOptions() {
    const optionsBox = util.editorOptions();
    optionsBox.style.display = "block";
}

function loadEditor(originalURL: string, newURL: string) {
    // Hide the upload form.
    hideUpload();
    // Show the editor.
    unhideEditor();
    // Load the images onto the screen.
    loadImages(originalURL, newURL);
}

function loadImages(originalURL: string, newURL: string) {
    // Save the image URLs into the storage.
    storage.saveImageData(originalURL, newURL);

    // Set the image element sources.
    const imageOriginal = util.editorImageOriginal();
    const imageNew = util.editorImageNew();
    imageOriginal.src = originalURL;
    imageNew.src = newURL;

    // Load the image data into image-js for transformation.
    Image.load(newURL).then((image) => {
        im.pushVersion(image);
        unhideEditorOptions();

        // Update the download URL.
        const downloadAnchor = util.editorDownloadAnchor();
        downloadAnchor.href = im.currentImage().toDataURL();
    });
}

function discardImages() {
    // Clear the image data from the storage.
    storage.clearImageData();

    // Hide the editor and unhide the upload form.
    resetEditor();
    hideEditor();
    unhideUpload();
}

function reloadImage() {
    const image = im.currentImage();

    const url = image.toDataURL();
    const imageNew = util.editorImageNew();
    imageNew.src = url;

    // Update download URL.
    const downloadAnchor = util.editorDownloadAnchor();
    downloadAnchor.href = url;

    // Save the image URLs.
    storage.saveNewImage(url);
}

// Initialization function.
function init() {
    initUpload();
    initEditor();

    // First check to see if the local storage has images saved.
    // If there is, then just load the editor right away.
    // If not, we have to show the upload button.
    const savedData = storage.loadImageData();
    if (savedData) {
        const [originalURL, newURL] = savedData;
        loadEditor(originalURL, newURL);
    }
}

function initUpload() {
    // We need to get the file upload <input> element and add a listener for
    // "change" events.
    // When the user uploads a file, we'll set the global `image` variable.
    const uploadForm = util.uploadForm();
    uploadForm.addEventListener("change", (event) => handleFileUpload(event));
}

function initEditor() {
    // Add event listeners to editor functions.
    const discardButton = util.editorDiscardButton();
    discardButton.addEventListener("click", (_event: MouseEvent) => discardImages());

    const undoButton = util.editorUndoButton();
    undoButton.addEventListener("click", (_event: MouseEvent) => {
        im.undoLast();
        reloadImage();
    });

    const greyscaleButton = util.editorGreyscaleButton();
    greyscaleButton.addEventListener("click", (_event: MouseEvent) => {
        im.setGreyscale();
        reloadImage();
    });

    const blurForm = util.editorBlurForm();
    blurForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const radiusStr = formData.get("radius") as string;
        const radius = parseInt(radiusStr);
        if (radius > 0) {
            im.applyBlur(radius);
            reloadImage();
        }
    });
}

(function () {
    init();
})();
