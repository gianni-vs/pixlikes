import React from "react";
import { Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import useAuth from "../features/auth/useAuth";

const NavMenu = () => {
  const { user } = useAuth();

  const authBasedItem = (
    <>
      {user && user.id !== 0 ? (
        <Menu.Item as={NavLink} to="/logout">
          <i className="sign out icon" /> Logout
        </Menu.Item>
      ) : (
        <Menu.Item as={NavLink} to="/login">
          <i className="sign in icon" /> Login
        </Menu.Item>
      )}
    </>
  );

  return (
    <Menu
      inverted
      widths={3}
      borderless
      style={{
        borderRadius: 0,
        margin: 0,
      }}
    >
      >
      <Container>
        <Menu.Item as={NavLink} to="/" end={true}>
          <i className="search icon" /> Discover
        </Menu.Item>
        <Menu.Item as={NavLink} to="/profile">
          <i className="user icon" /> Profile
        </Menu.Item>
        {authBasedItem}
      </Container>
    </Menu>
  );
};

export default NavMenu;
