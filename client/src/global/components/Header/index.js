import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Icon } from "antd";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import { compose, graphql } from "react-apollo";
import { gql } from "apollo-boost";

import styled from "styled-components";

class Header extends Component {
  state = { showSignupForm: false, showLoginForm: false };

  showModal = form => () => {
    if (form === "signup") {
      return this.setState(state => ({
        ...state,
        showSignupForm: !state.showSignupForm
      }));
    }
    return this.setState(state => ({
      ...state,
      showLoginForm: !state.showLoginForm
    }));
  };

  signUpFormSubmit = submitEvent => {
    submitEvent.preventDefault();

    const { name, email, password } = this.state;
    this.props
      .signUp({
        variables: {
          newUser: {
            name,
            email,
            password
          }
        }
      })
      .then(res => {
        const { user, token } = res.data.signup;
        this.props.userLogin(user.name, token);

        this.setState({
          showSignupForm: false,
          showLoginForm: false
        });
      })
      .catch(error => console.log(error));
  };

  loginFormSubmit = submitEvent => {
    submitEvent.preventDefault();

    const { email, password } = this.state;
    this.props
      .login({
        variables: { email, password }
      })
      .then(res => {
        const { user, token } = res.data.login;
        this.props.userLogin(user.name, token);

        this.setState({
          showSignupForm: false,
          showLoginForm: false
        });
      })

      .catch(error => console.log(error));
  };

  inputChange = changeEvent => {
    changeEvent.persist();
    const { name, value } = changeEvent.target;

    this.setState(state => {
      return {
        ...state,
        [name]: value
      };
    });
  };

  componentWillMount = () => {
    const user = localStorage.getItem("user");
    if (user) {
      return this.setState(state => ({
        ...state,
        userName: user,
        signedIn: true
      }));
    }

    return;
  };

  render() {
    const { userName, signedIn, logout, toggle, collapsed } = this.props;
    const { showLoginForm, showSignupForm } = this.state;
    return (
      <HeaderComponent>
        <Head>
          <IconTrigger
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={toggle}
          />
          <Link style={{ textDecoration: "none" }} to="/">
            <Header1>Cars-R-Us</Header1>
          </Link>
        </Head>
        {!signedIn ? (
          <div>
            <StyledButton ghost onClick={this.showModal("signup")}>
              Sign Up
            </StyledButton>
            <SignupForm
              inputChange={this.inputChange}
              signUpFormSubmit={this.signUpFormSubmit}
              showSignupForm={showSignupForm}
              showModal={this.showModal}
            />
            <StyledButton ghost onClick={this.showModal("login")}>
              Login
            </StyledButton>
            <LoginForm
              inputChange={this.inputChange}
              loginFormSubmit={this.loginFormSubmit}
              showLoginForm={showLoginForm}
              showModal={this.showModal}
            />
          </div>
        ) : (
          <LoggedInContainer>
            <div>Welcome, {userName}</div>
            <StyledButton ghost onClick={logout}>
              Logout
            </StyledButton>
          </LoggedInContainer>
        )}
      </HeaderComponent>
    );
  }
}

const Header1 = styled.h1`
  color: #fffffa;
  &:hover {
    color: #86cb92;
  }
  @media (max-width: 500px) {
    margin-bottom: -25px;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  margin-right: 60px;
  max-width: fit-content;
  min-width: fit-content;
  @media (max-width: 500px) {
    margin-right: 0px;
  }
`;

const IconTrigger = styled(Icon)`
  display: none;
  @media (max-width: 768px) {
    display: block;
    font-size: 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: #fffffa;
    margin: 0px 5px 12px
    &:hover {
      color: #86cb92;
    }
  }
`;
const HeaderComponent = styled(Layout.Header)`
  min-height: fit-content;
  background-color: #5b6057;
  border-bottom: 1px solid #86cb92;
  display: flex;
  @media (max-width: 500px) {
    align-items: center;
    flex-direction: column;
  }
`;

const LoggedInContainer = styled.div`
  color: white;
  display: flex;
  text-align: center;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 325px) {
    flex-direction: column;
    margin-bottom: 10px;
  }
`;

const StyledButton = styled(Button)`
  margin: 0px 4px;
  color: #86cb92 !important;
  border-color: #86cb92 !important;
`;

const signUp = gql`
  mutation signUp($newUser: newUserInput!) {
    signup(newUser: $newUser) {
      token
      user {
        name
      }
    }
  }
`;

const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
      }
    }
  }
`;

export default compose(
  graphql(signUp, { name: "signUp" }),
  graphql(login, { name: "login" })
)(Header);
