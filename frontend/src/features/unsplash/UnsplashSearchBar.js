import { Input } from "semantic-ui-react";
import React from "react";

const UnsplashSearchBar = (props) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (props.onEnter) {
        props.onEnter(event.target.value);
      }
    }
  };
  return (
    <Input
      icon={{ name: "search", circular: true, link: true }}
      fluid
      size={props.size}
      placeholder="Search for pictures..."
      onKeyDown={handleKeyDown}
      defaultValue={props.value}
      style={{
        animation:
          "2.4s ease-in-out 0s infinite normal none running back-to-docs",
      }}
    />
  );
};

export default UnsplashSearchBar;
