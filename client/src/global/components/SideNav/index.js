import React, { Component } from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";

import { Layout, Button } from "antd";

import styled from "styled-components";

class SideNav extends Component {
  render() {
    const { signedIn, data } = this.props;
    const { push } = this.props.history;
    const { posts } = data;
    return (
      <Sider>
        <h1>Cars-R-Us</h1>
        <hr />
        {signedIn && (
          <Button ghost type={"primary"} onClick={() => push("/new-post")}>
            Create Post
          </Button>
        )}
        <br />
        <PostLinkContainer>
          {posts &&
            posts.map(post => {
              const { id, year, make, model } = post;
              return (
                <PostLinkWrapper key={id}>
                  <a href={`/details/${id}`}>
                    {year} {make} {model}
                  </a>
                </PostLinkWrapper>
              );
            })}
        </PostLinkContainer>
      </Sider>
    );
  }
}

const Sider = styled(Layout.Sider)`
  display: flex;
  background-color: #e0e0e0;
  padding: 5px;
`;

const PostLinkContainer = styled.div`
  margin-top: 10px;
`;

const PostLinkWrapper = styled.div`
  margin: 5px 0px;
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
