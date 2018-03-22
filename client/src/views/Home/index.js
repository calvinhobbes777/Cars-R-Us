import React, { Component } from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";

import { Card } from "antd";
import ImageGallery from "react-image-gallery";

import styled from "styled-components";

class Home extends Component {
  render() {
    const { data } = this.props;
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
