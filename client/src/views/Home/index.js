import React, { Component } from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";

import { Card } from "antd";
import ImageGallery from "react-image-gallery";

import styled from "styled-components";

class Home extends Component {
  componentDidMount() {
    this.props.data.subscribeToMore({
      document: postSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);

        if (!subscriptionData.data) {
          return prev;
        }
        if (subscriptionData.data.post.mutation === "CREATED") {
          const createdPost = subscriptionData.data.post.node;
          console.log(subscriptionData);
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
    const { data } = this.props;
    console.log(data);
    return (
      <Container>
        {data.posts &&
          data.posts.map(post => {
            const { year, make, model, price, id } = post;
            return (
              <MainCard
                key={id}
                title={`${year} ${make} ${model}`}
                extra={<Link to={`/details/${id}`}>More</Link>}
              >
                <ImageGallery
                  items={post.images.map(image => ({
                    original: image
                  }))}
                  showNav={true}
                  showBullets={true}
                  showPlayButton={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                />
                <CardPrice>${price}</CardPrice>
              </MainCard>
            );
          })}
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  padding: 12px;
  flex-wrap: wrap;
  overflow-y: scroll;
`;
const MainCard = styled(Card)`
  flex: 1;
  min-width: 300px;
  margin: 12px !important;
  max-width: calc(33% - 24px);
`;

const CardPrice = styled.p`
  margin: 0;
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
        images
        price
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
      images
      price
    }
  }
`;
export default graphql(posts)(Home);
