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

// Show the editor.
function unhideEditor() {
    const box = util.editorBox();
    box.style.display = "block";
}

function hideEditor() {
    const box = util.editorBox();
    box.style.display = "none";
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
    storage.saveData(originalURL, newURL);

    // Set the image element sources.
    const imageOriginal = util.editorImageOriginal();
    const imageNew = util.editorImageNew();
    imageOriginal.src = originalURL;
    imageNew.src = newURL;

    // Load the image data into image-js for transformation.
    const image = Image.load(newURL);
}

function discardImages() {
    // Clear the image data from the storage.
    storage.clearData();

    // Hide the editor and unhide the upload form.
    hideEditor();
    unhideUpload();
}

function reloadImage(image: Image) {
    const url = image.toDataURL();
    const imageNew = util.editorImageNew();
    imageNew.src = url;

    // Save the image URLs.
    storage.saveNewURL(url);
}

// Initialization function.
function init() {
    initUpload();
    initEditor();

    // First check to see if the local storage has images saved.
    // If there is, then just load the editor right away.
    // If not, we have to show the upload button.
    const savedData = storage.loadData();
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
}

(function () {
    init();
})();
