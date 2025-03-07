import Image, { ImageProps } from "next/image";

interface ImageUploaderPreviewProps extends ImageProps {
  useNextTag?: boolean;
  src: string;
}

export const ImageUploaderPreview: React.FC<ImageUploaderPreviewProps> = ({
  useNextTag = false,
  src,
  priority,
  ...props
}) => {
  if (useNextTag) {
    return <Image src={src} priority={priority} {...props} />;
  }

  return <img src={src} {...props} />;
};
