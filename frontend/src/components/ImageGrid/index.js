import React from "react";
import "./ImageGrid.css";
import ImageThumb from "../ImageThumb/";
import { List, Transition } from "semantic-ui-react";

function ImageGrid({ images, isLiked, onLike, showLikeButton }) {
  return (
    <Transition.Group as={List} className={"image-grid"}>
      {images.map((image) => (
        <List.Item key={image.id} className={"item-container"}>
          <ImageThumb
            key={image.id}
            image={image}
            isLiked={isLiked}
            onLike={onLike}
            showLikeButton={showLikeButton}
          />
        </List.Item>
      ))}
    </Transition.Group>
  );
}

export default ImageGrid;
