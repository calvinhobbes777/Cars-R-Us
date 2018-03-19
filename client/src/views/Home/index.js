import React, { Component } from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Card } from "antd";
import styled from "styled-components";

class Home extends Component {
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <Container>
        {data.posts &&
          data.posts.map(post => {
            const { year, make, model, images, price, id } = post;
            return (
              <MainCard
                key={id}
                title={`${year} ${make} ${model}`}
                extra={<a href={`/details/${id}`}>More</a>}
              >
                {post.images &&
                  post.images.map(image => {
                    return <CardImage src={image} alt="Car Pic" />;
                  })}
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
  flex-wrap: wrap;
`;
const MainCard = styled(Card)`
  max-width: 300px;
  min-width: 300px;
  flex: 1;
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
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
