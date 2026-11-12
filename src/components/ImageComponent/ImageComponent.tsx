type ImageComponentProps = {
  width: string;
  height: string;
  isRound?: boolean;
  src: string;
  alt: string;
};

// A plain grey tile shown when an image cannot load (nothing is requested from another site)
const EMPTY_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='%23e8e8e8'/></svg>";

const ImageComponent = ({
  width,
  height,
  isRound,
  src,
  alt,
}: ImageComponentProps) => {
  const getClassName = () => {
    let className = "relative overflow-hidden ";
    if (isRound) {
      className += "rounded-full";
    } else {
      className += "rounded-[8px]";
    }
    return className;
  };

  return (
    <div>
      <div
        className={getClassName()}
        style={{ aspectRatio: `${width}/${height}`, width, height }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="top-0 left-0 object-cover w-full h-full object-fit"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = EMPTY_IMAGE;
          }}
        />
      </div>
    </div>
  );
};
export default ImageComponent;
