import { Image } from "image-js";

// Save the data of the original image so the user can reset.
let original: string;

// Maintain a list of image versions so the user can undo their changes.
let versions: Image[] = [];

// Set the data URL of the original image.
export function setOriginal(url: string): void {
    original = url;
}

// Return the list of saved image versions.
export function getVersions(): Image[] {
    return versions;
}

// Get the current version (the topmost on the stack).
export function currentImage(): Image {
    return versions[versions.length - 1];
}

// Push a new version of the image to the stack.
export function pushVersion(image: Image): void {
    versions.push(image);
}

// Undo the last edit by popping off the stack.
export function undoLast(): void {
    versions.pop();
}

// Clear all versions and restore the original image.
export async function reset(): Promise<void> {
    const image = await Image.load(original);
    versions = [image];
}

// Clear all versions and the original image data.
export function clear(): void {
    original = "";
    versions = [];
}

// Push a new version with greyscale filter applied.
export function setGreyscale(): void {
    const image = currentImage();
    // Use the `grey()` method on the `Image` object.
    // Remember, this is functionality provided by image-js.
    const newImage = image.grey();
    pushVersion(newImage);
}

// Push a new version with a blur effect applied.
export function applyBlur(radius: number): void {
    const image = currentImage();
    const newImage = image.blurFilter({ radius: radius });
    pushVersion(newImage);
}

// Push a new version with a rotation effect applied.
export function rotate(degrees: number): void {
    const image = currentImage();
    const newImage = image.rotate(degrees);
    pushVersion(newImage);
}
