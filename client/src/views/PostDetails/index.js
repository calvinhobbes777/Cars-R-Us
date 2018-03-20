import React, { Component } from "react";
import styled from "styled-components";
import { compose, graphql } from "react-apollo";
import { gql } from "apollo-boost";
import NewMessageForm from "./NewMessageForm";
import { Carousel, Popover, Button, Popconfirm } from "antd";
import jwt from "jsonwebtoken";

class PostDetails extends Component {
  state = {
    newMessage: {},
    renderMessageForm: false,
    userId: ""
  };

  formSubmit = submitEvent => {
    submitEvent.preventDefault();

    this.props
      .newMessage({
        variables: {
          newMessage: this.state.newMessage,
          postId: this.props.match.params.postId
        }
      })
      .then(() => {
        this.renderMessageForm();

        this.props.data.refetch();
      });
  };

  renderMessageForm = () => {
    this.setState(state => ({
      ...state,
      renderMessageForm: !state.renderMessageForm
    }));
  };

  inputChange = changeEvent => {
    changeEvent.persist();
    const { name, value } = changeEvent.target;

    this.setState(state => {
      return {
        ...state,
        newMessage: {
          ...state.newMessage,
          [name]: value
        }
      };
    });
  };

  deletePost = () => {
    this.props.deletePost().then(() => this.props.history.push("/"));
  };

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      const { userId } = jwt.decode(token);

      return this.setState(state => ({
        ...state,
        userId
      }));
    }

    return;
  }

  componentWillReceiveProps(nextProps) {
    const token = localStorage.getItem("token");

    if (token) {
      const { userId } = jwt.decode(token);

      return this.setState(state => ({
        ...state,
        userId
      }));
    }

    return this.setState({
      userId: ""
    });
  }

  render() {
    const { push } = this.props.history;
    const { postId } = this.props.match.params;
    const { post, loading } = this.props.data;
    const { userId } = this.state;

    if (loading) {
      return <div>Loading....</div>;
    }

    return (
      <Container>
        {userId === post.author.id && (
          <div>
            <Popconfirm
              onConfirm={this.deletePost}
              title={"Are you sure you want to delete this post?"}
            >
              <Button ghost type={"danger"}>
                Delete
              </Button>
            </Popconfirm>
            <Button
              onClick={() => push(`/update-post/${postId}`)}
              ghost
              type={"primary"}
            >
              Edit
            </Button>
          </div>
        )}
        <h1>
          {post.year} {post.make} {post.model} {`$${post.price}`}
        </h1>
        <PostDetailsContainer>
          <CarouselWrapper>
            <Carousel effect={"fade"}>
              {post.images.map(image => (
                <img width={"100%"} key={image} src={image} alt="car" />
              ))}
            </Carousel>
          </CarouselWrapper>
          <PostDetailsWrapper>
            <p>Mileage: {post.mileage} </p>
            <p>Title Status: {post.titleStatus} </p>
            <p>Condition: {post.condition} </p>
            <p>{post.body}</p>
          </PostDetailsWrapper>
        </PostDetailsContainer>
        {userId && (
          <Popover
            placement={"bottom"}
            title={"New Message"}
            trigger={"click"}
            visible={this.state.renderMessageForm}
            onVisibleChange={this.renderMessageForm}
            content={
              <NewMessageForm
                inputChange={this.inputChange}
                formSubmit={this.formSubmit}
              />
            }
          >
            <Button> Message </Button>
          </Popover>
        )}
        {post.thread.map(message => {
          const { id, title, body, author: { name } } = message;

          return (
            <MessageContainer key={id}>
              <p>User: {name} </p>
              <p>Title: {title} </p>
              <p>Body: {body} </p>
            </MessageContainer>
          );
        })}
      </Container>
    );
  }
}

const CarouselWrapper = styled.div`
  flex: 1;
`;

const PostDetailsWrapper = styled.div`
  flex: 1;
`;

const PostDetailsContainer = styled.div`
  display: flex;
  padding: 60px;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageContainer = styled.div`
  background-color: grey;
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid white;
`;

const deletePost = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const newMessage = gql`
  mutation newMessage($newMessage: newMessageInput!, $postId: ID!) {
    createMessage(newMessage: $newMessage, postId: $postId) {
      id
    }
  }
`;

const post = gql`
  query post($id: ID!) {
    post(id: $id) {
      year
      make
      model
      images
      price
      body
      mileage
      titleStatus
      condition
      author {
        id
      }
      thread {
        id
        title
        body
        author {
          id
          name
        }
      }
    }
  }
`;
export default compose(
  graphql(newMessage, {
    name: "newMessage"
  }),
  graphql(deletePost, {
    name: "deletePost",
    options: props => ({
      variables: { id: props.match.params.postId }
    })
  }),
  graphql(post, {
    options: props => ({
      variables: { id: props.match.params.postId }
    })
  })
)(PostDetails);
