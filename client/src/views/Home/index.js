import React from "react";

import { Card } from "antd";
import { Link } from "react-router-dom";
import ImageGallery from "react-image-gallery";

import styled from "styled-components";

const Home = props => {
  const { data } = props;

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
};

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

export default Home;
