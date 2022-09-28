import React, { useState } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import HeaderWithIcon from "../../components/HeaderWithIcon";
import useAuth from "./useAuth";

const SignupForm = (props) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { signup, error } = useAuth();

  const signupHandler = () => {
    signup(userName, userEmail, userPassword);
  };

  return (
    <Segment
      textAlign="center"
      style={{ borderRadius: 0, backgroundColor: "#222222" }}
    >
      <HeaderWithIcon title="Join Pixlikes community!" icon="signup" />
      <Grid textAlign="center" style={props.style} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Name"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                value={userName}
              />
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
              <Button color="black" fluid size="large" onClick={signupHandler}>
                Sign up
              </Button>
            </Segment>
          </Form>
          <Message>
            Existing user? <NavLink to="/login">Login</NavLink>
          </Message>
          {error ? (
            <Message color="red" size="small">
              {error.message}
            </Message>
          ) : null}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default SignupForm;
