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
  margin: 12px !important;
  min-width: calc((100% / 3) - 24px);
  max-width: calc((100% / 3) - 24px);
  @media (max-width: 768px) {
    min-width: calc((100% / 2) - 24px);
    max-width: calc((100% / 2) - 24px);
  }
  @media (max-width: 425px) {
    max-width: 100%;
    min-width: 100%;
  }
`;

const CardPrice = styled.p`
  margin: 0;
`;

export default Home;
