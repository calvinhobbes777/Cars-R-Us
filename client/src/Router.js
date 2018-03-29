import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

import { Layout } from "antd";
import { SideNav, Header } from "./global";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home, PostDetails, NewPost, UpdatePost } from "./views";

import styled from "styled-components";

class Router extends Component {
  state = {
    userName: "",
    signedIn: false,
    collapsed: false
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

  toggle = () => {
    if (window.innerWidth <= 768) {
      console.log("toggle");
      this.setState(state => ({
        ...state,
        collapsed: !this.state.collapsed
      }));
    }
  };

  componentDidMount() {
    this.toggle();

    window.addEventListener("resize", event => {
      const { innerWidth } = event.target;

      if (innerWidth <= 768) {
        this.setState(state => ({
          ...state,
          collapsed: true
        }));
      }

      if (innerWidth > 768) {
        this.setState(state => ({
          ...state,
          collapsed: false
        }));
      }
    });

    const user = localStorage.getItem("user");
    if (user) {
      return this.setState({
        userName: user,
        signedIn: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { collapsed } = this.state;

    if (!collapsed) {
      return this.toggle();
    }
  }

  componentWillMount() {
    this.props.data.subscribeToMore({
      document: postSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        if (subscriptionData.data.post.mutation === "CREATED") {
          const createdPost = subscriptionData.data.post.node;

          return Object.assign({}, { posts: [...prev.posts, createdPost] });
        }

        if (subscriptionData.data.post.mutation === "UPDATED") {
          const updatedPost = subscriptionData.data.post.node;
          const prevPosts = [...prev.posts];
          const idx = prevPosts.findIndex(post => {
            return post.id === updatedPost.id;
          });
          prevPosts.splice(idx, 1, updatedPost);
          return Object.assign({}, { posts: prevPosts });
        }

        if (subscriptionData.data.post.mutation === "DELETED") {
          const postId = subscriptionData.data.post.previousValues.id;
          const prevPosts = [...prev.posts];
          const updatedPosts = prevPosts.filter(post => post.id !== postId);

          return Object.assign({}, { posts: updatedPosts });
        }
        return prev;
      }
    });
  }

  render() {
    const { userName, signedIn, collapsed } = this.state;
    const { data } = this.props;

    if (data.loading) {
      return <div>loading</div>;
    }

    return (
      <BrowserRouter>
        <NavLayout>
          <Route
            path={"/"}
            render={props => (
              <Header
                userLogin={this.userLogin}
                logout={this.logout}
                userName={userName}
                signedIn={signedIn}
                {...props}
                toggle={this.toggle}
                collapsed={collapsed}
              />
            )}
          />

          <Layout>
            <Route
              path={"/"}
              render={props => (
                <SideNav
                  {...props}
                  data={data}
                  userName={userName}
                  signedIn={signedIn}
                  toggle={this.toggle}
                  collapsed={collapsed}
                />
              )}
            />
            <Content>
              <Switch>
                <Route
                  exact
                  path={"/"}
                  render={props => <Home data={data} {...props} />}
                />
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
                    <PostDetails
                      {...props}
                      signedIn={signedIn}
                      collapsed={collapsed}
                    />
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

const postSubscription = gql`
  subscription {
    post(where: { mutation_in: [UPDATED, CREATED, DELETED] }) {
      mutation
      previousValues {
        id
      }
      node {
        id
        year
        make
        model
        images
        price
      }
    }
  }
`;

const posts = gql`
  query {
    posts {
      id
      year
      make
      model
      images
      price
    }
  }
`;

export default graphql(posts)(Router);
