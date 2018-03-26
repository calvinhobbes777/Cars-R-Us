import React, { Component } from "react";
import jwt from "jsonwebtoken";
import { gql } from "apollo-boost";
import { compose, graphql } from "react-apollo";

import Messages from "./Messages";
import ImageGallery from "react-image-gallery";
import { Button, Popconfirm } from "antd";

import styled from "styled-components";

class PostDetails extends Component {
  state = {
    newMessage: { body: "" },
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
        this.setState(state => ({
          ...state,
          newMessage: { body: "" }
        }));
      });
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

      this.setState(state => ({
        ...state,
        userId
      }));
    }

    return;
  }

  componentWillReceiveProps(nextProps) {
    return this.props.data.subscribeToMore({
      document: postSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        if (subscriptionData.data.post.mutation === "UPDATED") {
          const updatedPost = subscriptionData.data.post.node;

          return Object.assign({}, prev, { post: updatedPost });
        }

        if (subscriptionData.data.post.mutation === "DELETED") {
          return this.props.history.push("/");
        }
      }
    });
  }

  render() {
    const { push } = this.props.history;
    const { postId } = this.props.match.params;
    const { post, loading } = this.props.data;
    const { userId, newMessage } = this.state;

    if (loading) {
      return <div>Loading....</div>;
    }

    return (
      <Container>
        <PostDetailsContainer>
          <PostHeaderRow>
            <h1>
              {post.year} {post.make} {post.model} {`$${post.price}`}
            </h1>
            {userId === post.author.id && (
              <ActionsContainer>
                <Popconfirm
                  onConfirm={this.deletePost}
                  title={"Are you sure you want to delete this post?"}
                >
                  <HeaderButton ghost type={"danger"}>
                    Delete
                  </HeaderButton>
                </Popconfirm>
                <HeaderButton
                  ghost
                  type={"primary"}
                  onClick={() => push(`/update-post/${postId}`)}
                >
                  Edit
                </HeaderButton>
              </ActionsContainer>
            )}
          </PostHeaderRow>
          <PostContentRow>
            <CarouselWrapper>
              <StyledImageGallery
                items={post.images.map(image => ({
                  original: image,
                  thumbnail: image
                }))}
                showNav={true}
                showPlayButton={false}
              />
            </CarouselWrapper>
            <PostDetailsWrapper>
              <p>Mileage: {post.mileage} </p>
              <p>Title Status: {post.titleStatus} </p>
              <p>Condition: {post.condition} </p>
              <p>{post.body}</p>
            </PostDetailsWrapper>
          </PostContentRow>
        </PostDetailsContainer>
        <Messages
          userId={userId}
          thread={post.thread}
          formSubmit={this.formSubmit}
          inputChange={this.inputChange}
          inputControl={newMessage.body}
        />
      </Container>
    );
  }
}

const Row = styled.div`
  display: flex;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = Column.extend``;

const PostDetailsContainer = Column.extend`
  padding: 60px;
`;

const PostHeaderRow = Row.extend`
  justify-content: space-between;
`;

const ActionsContainer = Row.extend`
  width: 170px;
  justify-content: space-between;
`;

const HeaderButton = styled(Button)`
  width: 80px;
`;

const PostContentRow = Row.extend``;

const CarouselWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  margin-right: 30px;
`;

const StyledImageGallery = styled(ImageGallery)``;

const PostDetailsWrapper = styled.div`
  flex: 1;
  margin-left: 30px;
`;

const postSubscription = gql`
  subscription {
    post(where: { mutation_in: [UPDATED, DELETED] }) {
      mutation
      node {
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
          body
          author {
            id
            name
          }
        }
      }
    }
  }
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
