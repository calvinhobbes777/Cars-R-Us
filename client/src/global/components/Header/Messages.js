import React, { Component } from "react";

import jwt from "jsonwebtoken";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Icon, Button } from "antd";

import styled from "styled-components";

class Messages extends Component {
  render() {
    const { messageNotifications, loading, error } = this.props.data;

    if (loading) {
      return null;
    }

    const menu = (
      <Menu>
        {messageNotifications.map(({ id, year, make, model }) => (
          <Menu.Item key={id}>
            <Link to={`/details/${id}`}>
              {year} {make} {model}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <Dropdown placement={"bottomCenter"} overlay={menu}>
          <StyledButton ghost>
            Messages <Icon type="down" />
          </StyledButton>
        </Dropdown>
      </div>
    );
  }
}

const StyledButton = styled(Button)`
  color: #86cb92 !important;
  border-color: #86cb92 !important;
  @media (max-width: 375px) {
    margin-bottom: 12px;
  }
`;

const messageNotifications = gql`
  query messageNotifications($userId: ID!) {
    messageNotifications(userId: $userId) {
      id
      year
      make
      model
      thread {
        id
      }
    }
  }
`;

export default graphql(messageNotifications, {
  options: props => {
    const token = localStorage.getItem("token");

    if (token) {
      const { userId } = jwt.decode(token);
      return { variables: { userId: userId } };
    }
    return { variables: "" };
  }
})(Messages);
