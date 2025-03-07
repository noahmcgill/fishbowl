import Image, { type ImageProps } from "next/image";

interface ImageUploaderPreviewProps extends ImageProps {
  useNextTag?: boolean;
  src: string;
}

export const ImageUploaderPreview: React.FC<ImageUploaderPreviewProps> = ({
  useNextTag = false,
  src,
  alt,
  priority,
  ...props
}) => {
  if (useNextTag) {
    return <Image alt={alt} src={src} priority={priority} {...props} />;
  }

  return <img src={src} alt={alt} {...props} />;
};
