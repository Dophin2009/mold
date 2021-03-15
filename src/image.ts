import { Image } from "image-js";

let original: string;
let versions: Image[] = [];

export function setOriginal(url: string): void {
    original = url;
}

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

export async function reset(): Promise<void> {
    return Image.load(original).then((image) => {
        versions = [image];
    });
}

export function clear(): void {
    original = "";
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
