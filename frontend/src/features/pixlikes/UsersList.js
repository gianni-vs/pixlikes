import React from "react";
import { Container, List, Placeholder } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

const UsersList = ({ users }) => {
  return (
    <Container text>
      <List inverted size="medium" celled horizontal>
        {users.length > 0 ? (
          users.map((user) => (
            <List.Item key={user.id}>
              <List.Content>
                <List.Header style={{ textAlign: "left" }}>
                  <List.Icon inverted name="user circle outline" />
                  <NavLink to={"/profile/" + user.id}>{user.name}</NavLink>
                </List.Header>
              </List.Content>
            </List.Item>
          ))
        ) : (
          <Container text>
            <Placeholder inverted fluid>
              <Placeholder.Line style={{ backgroundColor: "transparent" }} />
            </Placeholder>
          </Container>
        )}
      </List>
    </Container>
  );
};

export default UsersList;
