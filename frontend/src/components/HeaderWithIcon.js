import React from "react";
import { Container, Header, Icon, Placeholder } from "semantic-ui-react";

const HeaderWithIcon = ({ title, icon }) => (
  <div>
    <Header as="h2" icon inverted textAlign="center">
      <Icon inverted name={icon} circular />
      <Header.Content>
        {title ? (
          title
        ) : (
          <Container text>
            <Placeholder inverted fluid>
              <Placeholder.Line style={{ backgroundColor: "transparent" }} />
            </Placeholder>
          </Container>
        )}
      </Header.Content>
    </Header>
  </div>
);

export default HeaderWithIcon;
