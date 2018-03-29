import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import { gql } from "apollo-boost";
import styled from "styled-components";
import UpdatePostImages from "./UpdatePostImages";
import { Input, Button, InputNumber, Select } from "antd";

const Option = Select.Option;

class UpdatePost extends Component {
  state = {};

  formSubmit = submitEvent => {
    submitEvent.preventDefault();
    this.props
      .mutate({
        variables: {
          updatePost: this.state,
          postId: this.props.match.params.postId
        }
      })
      .then(res => {
        const { postId } = this.props.match.params;
        this.props.history.push(`/details/${postId}`);
      });
  };

  inputChange = changeEvent => {
    changeEvent.persist();
    const { name, value } = changeEvent.target;

    this.setState(state => {
      return {
        ...state,
        [name]: value
      };
    });
  };

  numberChange = name => value => {
    this.setState(state => {
      return {
        ...state,
        [name]: value
      };
    });
  };

  pushImages = imageURL => {
    this.setState(state => ({
      ...state,
      images: [...state.images, imageURL]
    }));
  };

  removeImage = imageURL => {
    const { images } = this.state;
    const filteredImages = images.filter(image => {
      return image !== imageURL;
    });

    this.setState(state => ({
      ...state,
      images: filteredImages
    }));
  };

  componentWillReceiveProps({ data }) {
    const { post: _post = {} } = data || {};
    const { __typename, ...post } = _post;

    if (post) {
      return this.setState(state => ({ ...post }));
    }

    return;
  }

  render() {
    const {
      year,
      make,
      model,
      price,
      body,
      images,
      mileage,
      titleStatus,
      condition
    } = this.state;

    return (
      <FormContainer>
        <h2>Edit Post</h2>
        <Form onSubmit={this.formSubmit}>
          <Row>
            <Label>Make:</Label>
            <InputWrapper>
              <Input
                type="text"
                name={"make"}
                value={make}
                onChange={this.inputChange}
              />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Model:</Label>
            <InputWrapper>
              <Input
                value={model}
                type="text"
                name={"model"}
                onChange={this.inputChange}
              />
            </InputWrapper>
          </Row>

          <Row>
            <Label>Year:</Label>
            <InputWrapper>
              <InputNumber
                style={{ width: "100%" }}
                type="number"
                onChange={this.numberChange("year")}
                value={year}
              />
            </InputWrapper>

            <Label>Miles:</Label>
            <InputWrapper>
              <InputNumber
                style={{ width: "100%" }}
                formatter={value =>
                  ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                onChange={this.numberChange("mileage")}
                value={mileage}
              />
            </InputWrapper>
            <Label>Price:</Label>
            <InputWrapper>
              <InputNumber
                style={{ width: "100%" }}
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                onChange={this.numberChange("price")}
                value={price}
              />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Condition:</Label>
            <InputWrapper>
              <Select
                value={condition}
                placeholder={"Condition"}
                onChange={this.numberChange("condition")}
              >
                <Option value={"Excellent"}>Excellent</Option>
                <Option value={"LikeNew"}>Like New</Option>
                <Option value={"Fair"}>Fair</Option>
                <Option value={"NeedsWork"}>Needs Work</Option>
              </Select>
            </InputWrapper>
          </Row>
          <Row>
            <Label>Title Status:</Label>
            <InputWrapper>
              <Select
                placeholder={"Title Status"}
                onChange={this.numberChange("titleStatus")}
                value={titleStatus}
              >
                <Option value={"Clean"}>Clean</Option>
                <Option value={"Rebuilt"}>Rebuilt</Option>
                <Option value={"Other"}>Other</Option>
              </Select>
            </InputWrapper>
          </Row>
          <Row>
            <Label>Description:</Label>
            <InputWrapper>
              <Input.TextArea
                type="text"
                name={"body"}
                value={body}
                onChange={this.inputChange}
              />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Upload Images:</Label>
            <InputWrapper>
              <UpdatePostImages
                images={images}
                pushImages={this.pushImages}
                removeImage={this.removeImage}
              />
            </InputWrapper>
          </Row>
          <Row>
            <SubmitButton ghost htmlType={"submit"}>
              Submit
            </SubmitButton>
            <SubmitButton ghost onClick={() => this.props.history.goBack()}>
              Cancel
            </SubmitButton>
          </Row>
        </Form>
      </FormContainer>
    );
  }
}

const Form = styled.form`
  width: 100%;
  max-width: 560px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FormContainer = styled.div`
  padding: 60px;
  display: flex;
  overflow-y: scroll;
  align-items: center;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 7px !important;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Label = styled.label`
  margin: 0px 6px;
  width: 14%;
`;

const SubmitButton = styled(Button)`
  border-color: #86cb92 !important;
  color: #86cb92 !important;
  margin: 30px;
  @media (max-width: 768px) {
    width: 100%;
    margin: 5px 0px;
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
    }
  }
`;

const updatePost = gql`
  mutation updatePost($updatePost: updatePostInput!, $postId: ID!) {
    updatePost(updatePost: $updatePost, postId: $postId) {
      id
    }
  }
`;

export default compose(
  graphql(post, {
    options: props => ({
      variables: { id: props.match.params.postId }
    })
  }),
  graphql(updatePost)
)(UpdatePost);
