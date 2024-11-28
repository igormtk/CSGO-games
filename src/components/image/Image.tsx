import Image, { StaticImageData } from 'next/image'

type ImageProps = {
  src: StaticImageData
  width: number
  height: number
  alt: string
}
 
export default function ImageComponent({ src, width, height, alt }: ImageProps) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
    />
  )
}