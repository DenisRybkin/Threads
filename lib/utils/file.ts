import { ChangeEvent } from 'react';

export const event2file = (
  event: ChangeEvent<HTMLInputElement>
): { file: File; fileReader: FileReader } | undefined => {
  if (!event.target.files || !(event.target.files.length > 0)) return;

  const fileReader = new FileReader();
  const file = event.target.files[0];

  if (!file.type.includes('image')) return;

  fileReader.readAsDataURL(file);
  return { file, fileReader };
};

export const isBase64Image = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
};
