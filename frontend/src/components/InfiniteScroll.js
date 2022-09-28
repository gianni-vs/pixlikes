import React, { useEffect } from "react";
import ImageGrid from "./ImageGrid";
import { Loader } from "semantic-ui-react";

const InfiniteScroll = ({
  images,
  isImageLiked,
  onLikeToggle,
  showLikeButton,
  loading,
  moreToLoad,
  onScrollLimit,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.offsetHeight &&
        moreToLoad
      ) {
        onScrollLimit();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [moreToLoad]);

  return (
    <>
      <>
        {images && images.length ? (
          <>
            <ImageGrid
              images={images}
              isLiked={isImageLiked}
              onLike={onLikeToggle}
              showLikeButton={showLikeButton}
            />
          </>
        ) : null}
      </>
      {loading && (
        <div className={"loading-new-images-container"}>
          <Loader active inverted inline="centered" />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
