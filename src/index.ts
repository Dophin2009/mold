// We're going to be using and manipulating Image objects from the image-js
// library.
import { Image } from "image-js";

// util provides us functions to get the elements on the page.
import * as util from "./util";

// storage gives us functions to persist the image data; if the user closes the
// page and reopens it later, their progress will be saved.
import * as storage from "./storage";

// The image module maintains the list of image versions and actually applies
// the transformations described by the buttons on the page.
import * as im from "./image";

// This function is called when the user submits the file upload form.
// We need to get the file data, read it, and store it.
function handleFileUpload(event: Event): void {
    // We have to get the form itself to get the file data.
    const form = event.target as HTMLInputElement;

    // The `files` property gives us access to the list of files uploaded.
    const fileList = form.files;
    if (!fileList) {
        return;
    }

    // We only care about the first file.
    const file = fileList[0];

    // We need to actually read the file into a data url.
    // We do this by using FileReader.readAsDataURL() below.
    // We could also read the contents into a string, an array buffer, and
    // other things.
    const reader = new FileReader();

    // Let's also display a primitive progress bar for the reading.
    //
    // When the user submits the upload and we start reading, we want to hide
    // the upload button and instead show a progress bar.
    //
    // We do this by doing stuff when the reader emits an `onloadstart` event.
    const formBox = util.uploadFormBox();
    const progressBarBox = util.uploadFormProgressBox();
    reader.onloadstart = (_event: ProgressEvent<FileReader>) => {
        // Hide the form button.
        formBox.style.display = "none";
        // Unhide the progress bar.
        progressBarBox.style.display = "block";
    };

    // As reading progresses, we need to update the progress bar.
    // We do this by doing stuff when the reader emits an `onprogress` event.
    //
    // We have to get the progress bar element and modify the `value` and `max`
    // values.
    const progressBar = util.uploadFormProgress();
    reader.onprogress = (event: ProgressEvent<FileReader>) => {
        // We get those values from the `loaded` and `total` properties of the
        // event object.
        const value = event.loaded;
        const max = event.total;
        progressBar.value = value;
        progressBar.max = max;
    };

    // When it successfully finishes reading, we can load the image editor.
    //
    // This will be on an `onload` event.
    reader.onload = (event: ProgressEvent<FileReader>) => {
        // We can find the data URL that the reader read in the `result`
        // property.
        const reader = event.target as FileReader;
        const url = reader.result as string;

        // Clear the file list, so we can redo this the next time the user
        // uploads.
        const form = util.uploadForm();
        form.value = "";

        // We'll call the function to reset the upload part of the page.
        // Basically, we undo what we did in the callback for `onloadstart`.
        resetUpload();

        // Let's load the editor with the image data.
        loadEditor(url, url);
    };

    // Here we actually call the readAsDataURL function now that we've told the
    // reader what to do when the above events happen.
    reader.readAsDataURL(file);
}

// This function resets the upload form.
function resetUpload() {
    // Unhide the <div> containing the actual upload form.
    const formBox = util.uploadFormBox();
    formBox.style.display = "block";

    // Rehide the progress bar.
    const progressBarBox = util.uploadFormProgressBox();
    progressBarBox.style.display = "none";

    // Reset the progress bar value to 0.
    const progressBar = util.uploadFormProgress();
    progressBar.value = 0;
}

// Function to hide the upload part of the page.
function hideUpload() {
    const uploadBox = util.uploadBox();
    // We do this by editing the `display` style attribute.
    uploadBox.style.display = "none";
}

// Function to unhide the upload part of the page.
function unhideUpload() {
    const uploadBox = util.uploadBox();
    uploadBox.style.display = "block";
}

// Function to reset the editor to its initial state.
function resetEditor() {
    // We want to hide the editor options by default, until they're ready to be
    // used.
    hideEditorOptions();
}

// Function to unhide the editor part of the page.
function hideEditor() {
    const box = util.editorBox();
    box.style.display = "none";
}

// Function to show the editor part of the page.
function unhideEditor() {
    const box = util.editorBox();
    box.style.display = "block";
}

// Function to hide the editor options.
function hideEditorOptions() {
    const optionsBox = util.editorOptions();
    optionsBox.style.display = "none";
}

// Function to show the editor options.
function unhideEditorOptions() {
    const optionsBox = util.editorOptions();
    optionsBox.style.display = "block";
}

// Unhide the editor part of the page and load the given image data URLS.
function loadEditor(originalURL: string, newURL: string) {
    // Hide the upload form.
    hideUpload();
    // Show the editor.
    unhideEditor();
    // Load the images onto the screen.
    loadImages(originalURL, newURL);
}

// This function is called when we load the editor.
//
// We want to actually display the images on the page and save them as initial
// versions.
function loadImages(originalURL: string, newURL: string) {
    // Save the image data URLs into the browser storage.
    storage.saveImageData(originalURL, newURL);

    // Display the images on the page by getting the <img> elements and setting
    // their `src` attributes.
    const imageOriginal = util.editorImageOriginal();
    imageOriginal.src = originalURL;
    const imageNew = util.editorImageNew();
    imageNew.src = newURL;

    // Load the image data into image-js for transformation.
    //
    // Image.load() returns an Image object. However, it's asynchronous, so it
    // actually returns a Promise<Image>.
    //
    // We use Promise.then() to access the Image object when it finishes.
    Image.load(newURL).then((image) => {
        // We'll save the image as an initial version.
        im.setOriginal(originalURL);
        im.pushVersion(image);

        // Now that the image is ready to be manipulated, we can unhide the
        // options on the page.
        unhideEditorOptions();

        // We'll also update the URL of the download button to the current
        // version of the image.
        const downloadAnchor = util.editorDownloadAnchor();
        downloadAnchor.href = im.currentImage().toDataURL();
    });
}

// This function discards the current images, clears the browser storage, and
// resets the UI.
//
// We call it when the user presses the garbage can icon button.
function discardImages() {
    // Clear the saved image versions.
    im.clear();

    // Clear the image data from the storage.
    storage.clearImageData();

    // Hide the editor and unhide the upload form.
    resetEditor();
    hideEditor();
    unhideUpload();
}

// This function gets the current image version and displays it on the screen.
// It also resets the download button URL.
function reloadImage() {
    // Get the current image version.
    const image = im.currentImage();
    const url = image.toDataURL();

    // Show it on the screen.
    const imageNew = util.editorImageNew();
    imageNew.src = url;

    // Update download URL.
    const downloadAnchor = util.editorDownloadAnchor();
    downloadAnchor.href = url;

    // Save the image URLs into the storage again.
    storage.saveNewImage(url);
}

// Initialization function.
function init() {
    // Initialize the upload forms.
    initUpload();
    // Initialize the editor part of the page.
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

// Initialize the image upload part of the page.
function initUpload() {
    // We need to get the file upload <input> element and add a listener for
    // "change" events.
    // When the user uploads a file, we'll set the global `image` variable.
    const uploadForm = util.uploadForm();
    uploadForm.addEventListener("change", (event) => handleFileUpload(event));
}

// Initialize the editor part of the page.
function initEditor() {
    // We need to add event listeners to editor functions, so when the user
    // clicks them, they actually do something.

    // Add a listener for click events on the discard button.
    // We do this by listening for "click" and then calling our above `discardImages()`.
    const discardButton = util.editorDiscardButton();
    discardButton.addEventListener("click", (_event: MouseEvent) => discardImages());

    // Add a listener for click events on the undo button.
    const undoButton = util.editorUndoButton();
    undoButton.addEventListener("click", (_event: MouseEvent) => {
        im.undoLast();
        reloadImage();
    });

    // Add a listener for click events on the reset button.
    const resetButton = util.editorResetButton();
    resetButton.addEventListener("click", (_event: MouseEvent) => {
        im.reset().then(() => {
            reloadImage();
        });
    });

    // Add a listener for click events on the button that applies a greyscale effect.
    const greyscaleButton = util.editorGreyscaleButton();
    greyscaleButton.addEventListener("click", (_event: MouseEvent) => {
        im.setGreyscale();
        reloadImage();
    });

    // Add a listener for click events on the form that applies a blur effect.
    const blurForm = util.editorBlurForm();
    blurForm.addEventListener("submit", (event) => {
        // By default, browsers, will do their own stuff when a form submits.
        // We don't want that here.
        event.preventDefault();

        // We need to get the form itself.
        const form = event.target as HTMLFormElement;

        // By creating a FormData object, we can access the actual fields of
        // the form.
        const formData = new FormData(form);

        // The "name" attribute of our <input> element was "radius", so we can
        // use that to get the value.
        const radiusStr = formData.get("radius") as string;

        // The form data gives us a string. We want an integer.
        const radius = parseInt(radiusStr);

        if (radius > 0) {
            // Call the image manager to actually apply the blur effect and
            // push a new version of the image..
            im.applyBlur(radius);

            // Finally, we reload the <img> src attribute to display the new image.
            reloadImage();
        }
    });

    // Add a listener for click events on the form that applies a rotate effect.
    const rotateForm = util.editorRotateForm();
    rotateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const degreesStr = formData.get("degrees") as string;
        const degrees = parseInt(degreesStr);
        if (degrees > 0) {
            im.rotate(degrees);
            reloadImage();
        }
    });
}

// Entry point: we'll call out init function.
(function () {
    init();
})();
