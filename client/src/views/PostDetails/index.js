import React, { Component } from "react";

import jwt from "jsonwebtoken";
import { gql } from "apollo-boost";
import { compose, graphql } from "react-apollo";
import { firebase } from "../../firebase";

import Messages from "./Messages";
import ImageGallery from "react-image-gallery";
import { Button, Popconfirm } from "antd";

import styled from "styled-components";

class PostDetails extends Component {
  state = {
    newMessage: { body: "" },
    userId: ""
  };

  formSubmit = submitEvent => {
    submitEvent.preventDefault();

    this.props.newMessage({
      variables: {
        newMessage: this.state.newMessage,
        postId: this.props.match.params.postId
      }
    });

    this.setState(state => ({
      ...state,
      newMessage: { body: "" }
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
    const { images } = this.props.data.post;

    images.map(image => {
      return firebase
        .storage()
        .refFromURL(image)
        .delete()
        .catch(error => console.error(error));
    });

    this.props.deletePost().then(() => this.props.history.push("/"));
  };

  subscribeToPost = postId =>
    this.props.data.subscribeToMore({
      document: postSubscription,
      variables: { postId },
      updateQuery: (prev, { subscriptionData }) => {
        const { mutation } = subscriptionData.data.post;

        if (mutation === "DELETED") {
          return this.props.history.push("/");
        }

        if (
          !subscriptionData.data ||
          subscriptionData.data.post.id !== this.props.match.params.postId
        ) {
          return prev;
        }

        if (mutation === "UPDATED") {
          const updatedPost = subscriptionData.data.post.node;

          return Object.assign({}, prev, { post: updatedPost });
        }
      }
    });

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

  componentWillMount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    const { postId } = this.props.match.params;
    return (this.unsubscribe = this.subscribeToPost(postId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signedIn) {
      const token = localStorage.getItem("token");

      if (token) {
        const { userId } = jwt.decode(token);

        this.setState(state => ({
          ...state,
          userId
        }));
      }
    }

    if (!nextProps.signedIn) {
      this.setState(state => ({
        ...state,
        userId: ""
      }));
    }

    if (this.unsubscribe) {
      this.unsubscribe();
    }

    const { postId } = nextProps.match.params;
    return (this.unsubscribe = this.subscribeToPost(postId));
  }

  render() {
    const { collapsed } = this.props;
    const { push } = this.props.history;
    const { post, loading } = this.props.data;
    const { userId, newMessage } = this.state;
    const { postId } = this.props.match.params;

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
          <PostContentCol>
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
              <PostDetailsHeader>
                <p>
                  <b>Mileage:</b> {post.mileage}{" "}
                </p>
                <p>
                  <b>Title Status:</b> {post.titleStatus}{" "}
                </p>
                <p>
                  <b>Condition:</b> {post.condition}{" "}
                </p>
              </PostDetailsHeader>
              <p style={{ wordBreak: "break-all" }}>{post.body}</p>
            </PostDetailsWrapper>
          </PostContentCol>
        </PostDetailsContainer>
        <Messages
          userId={userId}
          postId={postId}
          collapsed={collapsed}
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
  @media (max-width: 590px) {
    align-items: center;
    flex-direction: column-reverse;
  }
`;

const PostDetailsHeader = Row.extend`
  justify-content: space-evenly;
`;

const ActionsContainer = Row.extend`
  width: 170px;
  justify-content: space-between;
`;

const HeaderButton = styled(Button)`
  width: 80px;
`;

const PostContentCol = Column.extend`
  display: flex;
  align-items: center;
`;

const CarouselWrapper = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 700px;
  margin-bottom: 60px;
`;

const StyledImageGallery = styled(ImageGallery)``;

const PostDetailsWrapper = styled.div``;

const postSubscription = gql`
  subscription post($postId: ID!) {
    post(where: { mutation_in: [UPDATED, DELETED], node: { id: $postId } }) {
      mutation
      node {
        id
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
      id
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
