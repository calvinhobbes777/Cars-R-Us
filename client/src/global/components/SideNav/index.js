import React from "react";

import { Link } from "react-router-dom";

import { Layout, Button, Icon } from "antd";

import styled from "styled-components";

const SideNav = props => {
  const { signedIn, data } = props;
  const { push } = props.history;
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
};

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

export default SideNav;
