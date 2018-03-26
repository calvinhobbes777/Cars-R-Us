import React, { Component } from "react";

import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

import PostImages from "./PostImages";
import { Input, Button, InputNumber, Select } from "antd";

import styled from "styled-components";

const Option = Select.Option;

class NewPost extends Component {
  state = {
    images: []
  };

  formSubmit = submitEvent => {
    submitEvent.preventDefault();
    this.props
      .mutate({
        variables: {
          newPost: this.state
        }
      })
      .then(res => {
        this.props.history.push("/");
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

  render() {
    return (
      <FormContainer>
        <Form onSubmit={this.formSubmit}>
          <Row>
            <Label>Make:</Label>
            <InputWrapper>
              <Input type="text" name={"make"} onChange={this.inputChange} />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Model:</Label>
            <InputWrapper>
              <Input type="text" name={"model"} onChange={this.inputChange} />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Year:</Label>
            <InputWrapper>
              <InputNumber
                style={{ width: "100%" }}
                type="number"
                onChange={this.numberChange("year")}
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
              />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Condition:</Label>
            <InputWrapper>
              <Select
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
                onChange={this.inputChange}
              />
            </InputWrapper>
          </Row>
          <Row>
            <Label>Upload Images:</Label>
            <InputWrapper>
              <PostImages
                pushImages={this.pushImages}
                removeImage={this.removeImage}
              />
            </InputWrapper>
          </Row>
          <Row>
            <SubmitButton ghost htmlType={"submit"}>
              Submit
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
`;

const FormContainer = styled.div`
  padding: 60px;
  display: flex;
  justify-content: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 7px !important;
`;

const Label = styled.label`
  margin: 0px 6px;
  width: 14%;
`;

const SubmitButton = styled(Button)`
  border-color: #86cb92 !important;
  color: #86cb92 !important;
  margin: 30px;
`;

const createPost = gql`
  mutation createPost($newPost: newPostInput!) {
    createPost(newPost: $newPost) {
      id
    }
  }
`;

export default graphql(createPost)(NewPost);
