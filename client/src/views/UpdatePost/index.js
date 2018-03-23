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

  componentWillReceiveProps(nextProps) {
    const { post } = nextProps.data;

    if (post) {
      const {
        year,
        make,
        model,
        images,
        price,
        body,
        mileage,
        titleStatus,
        condition
      } = post;

      return this.setState({
        year,
        make,
        model,
        images,
        price,
        body,
        mileage,
        titleStatus,
        condition
      });
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
      mileage,
      titleStatus,
      condition
    } = this.state;
    return (
      <FormContainer>
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
              <UpdatePostImages pushImages={this.pushImages} />
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
