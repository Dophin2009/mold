import * as util from "./util";
import { Image } from "image-js";

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

    // When it successfully finishes reading, we save the data url and hide all the upload forms.
    reader.onload = (event: ProgressEvent<FileReader>) => {
        const reader = event.target as FileReader;
        const url = reader.result as string;
        // Save the data url to our global state.

        // Hide the upload forms.
        const uploadBox = util.getUploadBox();
        uploadBox.style.display = "none";

        initEditor(url);
    };

    reader.readAsDataURL(file);
}

function initEditor(url: string) {
    // Show the editor.
    const box = util.getEditorBox();
    box.style.display = "block";

    // Set the image element sources.
    const imageOriginal = util.getEditorImageOriginal();
    const imageNew = util.getEditorImageNew();
    let originalURL = url;
    let newURL = url;
    imageOriginal.src = originalURL;
    imageNew.src = newURL;

    // Load it into image-js for transformation.
    const image = Image.load(newURL);
}

function reloadImage(image: Image) {
    const url = image.toDataURL();
    const imageNew = util.getEditorImageNew();
    imageNew.src = url;
}

// Initialization function.
function init() {
    // We need to get the file upload <input> element and add a listener for
    // "change" events.
    // When the user uploads a file, we'll set the global `image` variable.
    const uploadForm = util.getUploadForm();
    uploadForm.addEventListener("change", (event) => handleFileUpload(event));
}

(function () {
    init();
})();
