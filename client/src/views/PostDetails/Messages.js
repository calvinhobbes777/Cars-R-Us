import React, { Component } from "react";
import jwt from "jsonwebtoken";

import { Input, Button } from "antd";

import styled from "styled-components";

class Messages extends Component {
  state = {
    showMessages: false
  };

  renderMessages = () => {
    this.setState(state => ({
      ...state,
      showMessages: !state.showMessages
    }));
  };

  render() {
    const { showMessages } = this.state;
    const {
      thread,
      inputChange,
      formSubmit,
      inputControl,
      userId
    } = this.props;
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
            {thread &&
              thread.map(message => {
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

export default Messages;
