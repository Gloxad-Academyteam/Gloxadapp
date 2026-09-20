type ImageComponentProps = {
  width: string;
  height: string;
  isRound?: boolean;
  src: string;
  alt: string;
};

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
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt || "?")}&background=e8e8e8&color=999&size=200`;
          }}
        />
      </div>
    </div>
  );
};
export default ImageComponent;
