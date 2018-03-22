import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import { gql } from "apollo-boost";

import UpdatePostImages from "./UpdatePostImages";
import { Input, Form, Button, InputNumber, Select } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

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
    console.log(this.state);
    return (
      <div>
        <Form onSubmit={this.formSubmit}>
          <FormItem label={"Year"} {...formItemLayout}>
            <InputNumber
              defaultValue={1980}
              type="number"
              onChange={this.numberChange("year")}
              value={year}
            />
          </FormItem>
          <FormItem label={"Make"} {...formItemLayout}>
            <Input
              type="text"
              name={"make"}
              onChange={this.inputChange}
              value={make}
            />
          </FormItem>
          <FormItem label={"Model"} {...formItemLayout}>
            <Input
              type="text"
              name={"model"}
              onChange={this.inputChange}
              value={model}
            />
          </FormItem>

          <FormItem label={"Mileage"} {...formItemLayout}>
            <InputNumber
              formatter={value =>
                ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onChange={this.numberChange("mileage")}
              value={mileage}
            />
          </FormItem>
          <FormItem label={"Price"} {...formItemLayout}>
            <InputNumber
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onChange={this.numberChange("price")}
              value={price}
            />
          </FormItem>
          <FormItem label={"Condition"} {...formItemLayout}>
            <Select
              placeholder={"Condition"}
              onChange={this.numberChange("condition")}
              value={condition}
            >
              <Option value={"Excellent"}>Excellent</Option>
              <Option value={"LikeNew"}>Like New</Option>
              <Option value={"Fair"}>Fair</Option>
              <Option value={"NeedsWork"}>Needs Work</Option>
            </Select>
          </FormItem>
          <FormItem label={"Title Status"} {...formItemLayout}>
            <Select
              placeholder={"Title Status"}
              onChange={this.numberChange("titleStatus")}
              value={titleStatus}
            >
              <Option value={"Clean"}>Clean</Option>
              <Option value={"Rebuilt"}>Rebuilt</Option>
              <Option value={"Other"}>Other</Option>
            </Select>
          </FormItem>
          <FormItem label={"Description"} {...formItemLayout}>
            <Input.TextArea
              type="text"
              name={"body"}
              onChange={this.inputChange}
              value={body}
            />
          </FormItem>
          <FormItem label={"Image Url"} {...formItemLayout}>
            <UpdatePostImages />
          </FormItem>

          <Button htmlType={"submit"}>Submit</Button>
        </Form>
      </div>
    );
  }
}

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
