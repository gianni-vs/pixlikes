import React, { useState } from "react";
import "./Image.css";
import { Grid } from "semantic-ui-react";
import { Blurhash } from "react-blurhash";

const Heart = ({ isClick, onClick, styles }) => {
  return (
    <div style={{ position: "relative" }}>
      <div
        className={isClick ? "heart heart-active" : "heart"}
        onClick={onClick}
        style={styles}
      ></div>
    </div>
  );
};

const ImageThumb = ({ image, isLiked, onLike, showLikeButton }) => {
  const [hashVisible, setHashVisible] = useState(true);
  const textDescription = image.description || image.alt_description || "";
  const thumbWidth = 250;
  const thumbHeight = Math.ceil((image.height * 250) / image.width);
  return (
    <div className={"image-container"}>
      <div className="image">
        <div style={{ position: "relative" }}>
          {hashVisible ? (
            <Blurhash
              hash={image.blur_hash}
              width={thumbWidth}
              height={thumbHeight}
            />
          ) : null}
          <img
            src={image.urls.small_s3}
            alt={image.alt_description}
            onLoad={() => setHashVisible(false)}
            style={hashVisible ? { position: "absolute", top: 0, left: 0 } : {}}
          />
        </div>
      </div>
      <Grid columns={2} style={{ maxWidth: "250px" }}>
        <Grid.Column style={{ flex: 1 }}>
          <div className="image-details">
            {image.user.name ? (
              <div className={"image-author"}>{image.user.name}</div>
            ) : null}
          </div>
        </Grid.Column>
        {showLikeButton ? (
          <Grid.Column style={{ flex: "0 0 20px", padding: "16px 0 0 0" }}>
            <Heart
              isClick={isLiked(image.id)}
              onClick={(e) => {
                e.preventDefault();
                onLike(image);
              }}
            />
          </Grid.Column>
        ) : null}
      </Grid>
      <div
        className="image-desc"
        style={{ maxWidth: "250px", paddingTop: "20px" }}
      >
        <p>{textDescription.substring(0, 150)}</p>
      </div>
    </div>
  );
};

export default ImageThumb;
