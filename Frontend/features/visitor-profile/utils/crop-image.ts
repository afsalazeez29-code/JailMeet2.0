import type { Area } from 'react-easy-crop';

const OUTPUT_SIZE = 512;

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to prepare the selected image'));
    image.src = source;
  });

const rotatedSize = (width: number, height: number, rotation: number) => {
  const radians = (rotation * Math.PI) / 180;

  return {
    width:
      Math.abs(Math.cos(radians) * width) +
      Math.abs(Math.sin(radians) * height),
    height:
      Math.abs(Math.sin(radians) * width) +
      Math.abs(Math.cos(radians) * height),
  };
};

export const createCroppedProfileImage = async (
  source: string,
  crop: Area,
  rotation: number,
): Promise<File> => {
  const image = await loadImage(source);
  const bounds = rotatedSize(image.naturalWidth, image.naturalHeight, rotation);
  const sourceCanvas = document.createElement('canvas');
  const sourceContext = sourceCanvas.getContext('2d');

  if (!sourceContext) {
    throw new Error('Unable to prepare the selected image');
  }

  sourceCanvas.width = Math.ceil(bounds.width);
  sourceCanvas.height = Math.ceil(bounds.height);
  sourceContext.translate(sourceCanvas.width / 2, sourceCanvas.height / 2);
  sourceContext.rotate((rotation * Math.PI) / 180);
  sourceContext.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
  sourceContext.drawImage(image, 0, 0);

  const outputCanvas = document.createElement('canvas');
  const outputContext = outputCanvas.getContext('2d');

  if (!outputContext) {
    throw new Error('Unable to prepare the selected image');
  }

  outputCanvas.width = OUTPUT_SIZE;
  outputCanvas.height = OUTPUT_SIZE;
  outputContext.drawImage(
    sourceCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    outputCanvas.toBlob(resolve, 'image/jpeg', 0.88),
  );

  if (!blob) {
    throw new Error('Unable to prepare the selected image');
  }

  return new File([blob], 'visitor-profile.jpg', { type: 'image/jpeg' });
};
