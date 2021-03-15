import { Image } from "image-js";

let versions: Image[] = [];

export function getVersions(): Image[] {
    return versions;
}

export function currentImage(): Image {
    return versions[versions.length - 1];
}

export function pushVersion(image: Image): void {
    versions.push(image);
}

export function undoLast(): void {
    versions.pop();
}

export function clear(): void {
    versions = [];
}

export function setGreyscale(): void {
    const image = currentImage();
    const newImage = image.grey();
    pushVersion(newImage);
}

export function applyBlur(radius: number): void {
    const image = currentImage();
    const newImage = image.blurFilter({ radius: radius });
    pushVersion(newImage);
}

export function rotate(degrees: number): void {
    const image = currentImage();
    const newImage = image.rotate(degrees);
    pushVersion(newImage);
}
