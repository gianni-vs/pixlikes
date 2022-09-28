import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Message,
  Transition,
  Segment,
} from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import HeaderWithIcon from "../../components/HeaderWithIcon";
import useAuth from "./useAuth";

const LoginForm = (props) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { login, error } = useAuth();

  const loginHandler = () => {
    login(userEmail, userPassword);
  };

  return (
    <Segment
      textAlign="center"
      style={{ borderRadius: 0, backgroundColor: "#222222" }}
    >
      <HeaderWithIcon
        title="Login to Pixlikes to continue!"
        icon="paper plane"
      />
      <Grid textAlign="center" style={props.style} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
                value={userEmail}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  setUserPassword(e.target.value);
                }}
                value={userPassword}
              />
              <Button color="black" fluid size="large" onClick={loginHandler}>
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            Not yet a user? <NavLink to="/signup">Signup now</NavLink>
          </Message>
          <Transition animation="shake" duration={500} visible={error}>
            <Message color="red" size="small">
              {error?.message || ""}
            </Message>
          </Transition>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default LoginForm;
