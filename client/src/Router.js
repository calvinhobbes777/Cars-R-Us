import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { SideNav, Header } from "./global";
import { Layout } from "antd";
import { Home, PostDetails, NewPost, UpdatePost } from "./views";

import styled from "styled-components";

export default class Router extends Component {
  state = {
    userName: "",
    signedIn: false
  };

  logout = () => {
    localStorage.clear();
    this.setState({
      userName: "",
      signedIn: false
    });
  };

  userLogin = (name, token) => {
    localStorage.setItem("user", name);
    localStorage.setItem("token", token);
    this.setState({
      userName: name,
      signedIn: true
    });
  };

  componentDidMount = () => {
    const user = localStorage.getItem("user");
    if (user) {
      return this.setState({
        userName: user,
        signedIn: true
      });
    }

    return;
  };

  render() {
    const { userName, signedIn } = this.state;
    return (
      <BrowserRouter>
        <NavLayout>
          <Route
            path={"/"}
            render={props => (
              <SideNav userName={userName} signedIn={signedIn} {...props} />
            )}
          />
          <Layout>
            <Route
              path={"/"}
              render={props => (
                <Header
                  userLogin={this.userLogin}
                  logout={this.logout}
                  userName={userName}
                  signedIn={signedIn}
                  {...props}
                />
              )}
            />
            <Content>
              <Switch>
                <Route exact path={"/"} component={Home} />
                <Route exact path={"/new-post"} component={NewPost} />
                <Route
                  exact
                  path={"/update-post/:postId"}
                  component={UpdatePost}
                />

                <Route
                  exact
                  path={"/details/:postId"}
                  render={props => (
                    <PostDetails signedIn={signedIn} {...props} />
                  )}
                />
              </Switch>
            </Content>
          </Layout>
        </NavLayout>
      </BrowserRouter>
    );
  }
}

const NavLayout = styled(Layout)`
  height: 100vh;
`;

const Content = styled(Layout.Content)`
  overflow: scroll;
`;
