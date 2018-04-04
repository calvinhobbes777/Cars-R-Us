import React, { Component } from "react";

import jwt from "jsonwebtoken";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Icon, Button, Badge } from "antd";

import styled from "styled-components";

class Messages extends Component {
  state = {
    notifications: []
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const { userId } = jwt.decode(token);
      this.unsubscribe = this.props.data.subscribeToMore({
        document: post,
        variables: { userId },
        updateQuery: (prev, { subscriptionData }) => {
          console.log("prev");
          console.log(prev);
          console.log("subscriptionData");
          console.log(subscriptionData);

          const newPost = subscriptionData.data.post.node;

          return prev;
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { notifications } = nextProps.data;

    if (notifications) {
      this.setState(state => ({
        ...state,
        notifications
      }));
    }
  }

  removeFromDropdown = id => () => {
    let { notifications } = this.state;

    notifications = notifications.filter(message => id !== message.id);

    this.setState(state => ({
      ...state,
      notifications
    }));
  };

  render() {
    const { loading, error } = this.props.data;
    const { notifications } = this.state;

    if (loading) {
      return null;
    }

    const menu = (
      <Menu>
        {notifications.map(({ id, year, make, model }) => (
          <Menu.Item key={id}>
            <Link onClick={this.removeFromDropdown(id)} to={`/details/${id}`}>
              {year} {make} {model}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown placement={"bottomCenter"} trigger={["click"]} overlay={menu}>
        <Badge dot={notifications.length > 0} offset={[18, -35]}>
          <StyledButton ghost>
            Messages <Icon type="down" />
          </StyledButton>
        </Badge>
      </Dropdown>
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

const postSubscriptions = gql`
  subscription postSubscriptions($userId: ID!) {
    post(
      where: {
        OR: [
          { node: { author: { id: $userId } } }
          { node: { thread_some: { author: { id: $userId } } } }
        ]
      }
    ) {
      updatedFields
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
  query posts($userId: ID!) {
    posts(
      where: {
        OR: [
          { author: { id: $userId } }
          { thread_some: { author: { id: $userId } } }
        ]
      }
    ) {
      id
      year
      make
      model
    }
  }
`;

export default graphql(posts, {
  options: props => {
    const token = localStorage.getItem("token");

    if (token) {
      const { userId } = jwt.decode(token);
      return { variables: { userId: userId } };
    }
    return { variables: "" };
  }
})(Messages);
