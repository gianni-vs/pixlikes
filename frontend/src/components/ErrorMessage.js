import { Container, Message } from "semantic-ui-react";
import React from "react";

const ErrorMessage = ({ color, icon, header, content }) => (
  <Container text>
    <Message
      color={color || "red"}
      icon={icon || "bug"}
      header={header || "This is embarassing!"}
      content={content || "An unexpected error occurred, sorry!"}
    />
  </Container>
);

export default ErrorMessage;
