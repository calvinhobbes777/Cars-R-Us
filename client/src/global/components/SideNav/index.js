import React, { Component } from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";

import { Layout, Button, Icon } from "antd";

import styled from "styled-components";

class SideNav extends Component {
  componentDidMount() {
    this.props.data.subscribeToMore({
      document: postSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        if (subscriptionData.data.post.mutation === "CREATED") {
          const createdPost = subscriptionData.data.post.node;

          return Object.assign({}, prev, {
            posts: [...prev.posts, createdPost]
          });
        }
        if (subscriptionData.data.post.mutation === "UPDATED") {
          const updatedPost = subscriptionData.data.post.node;
          const prevPosts = [...prev.posts];
          const idx = prevPosts.findIndex(post => {
            return post.id === updatedPost.id;
          });
          prevPosts.splice(idx, 1, updatedPost);
          return Object.assign({}, prev, {
            posts: prevPosts
          });
        }
        if (subscriptionData.data.post.mutation === "DELETED") {
          const postId = subscriptionData.data.post.previousValues.id;
          const prevPosts = [...prev.posts];

          return Object.assign({}, prev, {
            posts: prevPosts.filter(post => post.id !== postId)
          });
        }
      }
    });
    return;
  }

  render() {
    const { signedIn, data } = this.props;
    const { push } = this.props.history;
    const { posts } = data;
    return (
      <Sider>
        <Link to="/">
          <Header1>Cars-R-Us</Header1>
        </Link>
        <HR />
        {signedIn && (
          <SideButton ghost type={"primary"} onClick={() => push("/new-post")}>
            Create Post
          </SideButton>
        )}
        <br />
        <Header2>
          Posts<Icon type={"arrow-down"} />
        </Header2>
        <PostLinkContainer>
          {posts &&
            posts.map(post => {
              const { id, year, make, model } = post;
              return (
                <PostLinkWrapper key={id}>
                  <A to={`/details/${id}`}>
                    {year} {make} {model}
                  </A>
                </PostLinkWrapper>
              );
            })}
        </PostLinkContainer>
      </Sider>
    );
  }
}

const Header1 = styled.h1`
  color: #fffffa;
  margin: 8px;
  &:hover {
    color: #86cb92;
  }
`;

const HR = styled.hr`
  width: 195px;
  border: 1px solid #86cb92;
`;

const SideButton = styled(Button)`
  border-color: #86cb92 !important;
  color: #86cb92 !important;
  margin: 30px;
`;

const Header2 = styled.h2`
  color: #fffffa;
  margin: 8px;
`;

const A = styled(Link)`
  color: #fffffa;
  padding-left: 15px;
  &:hover {
    color: #86cb92;
  }
`;
const Sider = styled(Layout.Sider)`
  display: flex;
  background-color: #5b6057;
  padding: 5px;
`;

const PostLinkContainer = styled.div`
  margin-top: 10px;
`;

const PostLinkWrapper = styled.div`
  margin: 5px 0px;
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
    }
  }
`;
export default graphql(posts)(SideNav);
