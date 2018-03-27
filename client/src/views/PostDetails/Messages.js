import React, { Component } from "react";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { graphql } from "react-apollo";

import { Input, Button } from "antd";

class Messages extends Component {
  state = {
    sortedThread: [],
    showMessages: false
  };

  renderMessages = () => {
    this.setState(state => ({
      ...state,
      showMessages: !state.showMessages
    }));
  };

  componentWillMount() {
    return this.props.data.subscribeToMore({
      document: messagesSubscription,
      variables: { postId: this.props.postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          subscriptionData.data.message.node.post.id !== this.props.postId
        )
          return prev;

        let newMessage = subscriptionData.data.message.node;

        return Object.assign({}, prev, {
          messages: [...prev.messages, newMessage]
        });
      }
    });
  }

  render() {
    const { showMessages } = this.state;
    const {
      userId,
      formSubmit,
      inputChange,
      inputControl,
      data: { messages = [] }
    } = this.props;
    const sortedThread = messages.slice().reverse();

    return (
      <Container>
        <MessagesButton onClick={this.renderMessages}>Messages</MessagesButton>
        <MessagesContainer showMessages={showMessages}>
          <Form onSubmit={formSubmit}>
            <Input
              type={"text"}
              name={"body"}
              autoFocus={true}
              value={inputControl}
              onChange={inputChange}
              placeholder={"Enter Message"}
            />
            <Button htmlType={"submit"}>Submit</Button>
          </Form>
          <MessagesWrapper>
            {sortedThread &&
              sortedThread.map(message => {
                const { author, body } = message;
                return (
                  <MessageWrapper key={message.id}>
                    <b>
                      {author && author.id === userId ? "Me" : author.name}:
                    </b>{" "}
                    {body}
                  </MessageWrapper>
                );
              })}
          </MessagesWrapper>
        </MessagesContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  z-index: 5;
  bottom: 0px;
  display: flex;
  position: fixed;
  align-items: center;
  flex-direction: column;
  width: calc(100% - 200px);
`;

const MessagesButton = styled(Button)`
  width: 100px;
  background-color: white !important;
  &:hover {
  }
`;

const MessagesContainer = styled.div`
  width: 100%;
  background-color: white;
  transition: all 0.25s ease-in-out;
  height: ${props => (!props.showMessages ? "0px" : "500px")};
`;

const Form = styled.form`
  display: flex;
  padding: 10px;
`;

const MessagesWrapper = styled.div`
  padding: 10px;
  margin-top: 10px;
  overflow-y: scroll;
  word-wrap: break-word;
  border-top: 1px solid black;
  max-height: calc(100% - 70px);
`;
const MessageWrapper = styled.div``;

const messagesSubscription = gql`
  subscription newMessage($postId: ID!) {
    message(where: { mutation_in: CREATED, node: { post: { id: $postId } } }) {
      node {
        id
        body
        author {
          id
          name
        }
        post {
          id
        }
      }
    }
  }
`;

const messagesQuery = gql`
  query messages($postId: ID!) {
    messages(where: { post: { id: $postId } }) {
      id
      body
      author {
        id
        name
      }
    }
  }
`;

export default graphql(messagesQuery, {
  options: props => ({
    variables: { postId: props.postId }
  })
})(Messages);
