import React, { Component } from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";

import { Input, Form, Button, InputNumber, Select } from "antd";
import PostImages from "./PostImages";

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
    console.log(this.state);
    return (
      <div>
        <Form onSubmit={this.formSubmit}>
          <FormItem label={"Year"} {...formItemLayout}>
            <InputNumber
              defaultValue={1980}
              type="number"
              onChange={this.numberChange("year")}
            />
          </FormItem>
          <FormItem label={"Make"} {...formItemLayout}>
            <Input type="text" name={"make"} onChange={this.inputChange} />
          </FormItem>
          <FormItem label={"Model"} {...formItemLayout}>
            <Input type="text" name={"model"} onChange={this.inputChange} />
          </FormItem>

          <FormItem label={"Mileage"} {...formItemLayout}>
            <InputNumber
              formatter={value =>
                ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onChange={this.numberChange("mileage")}
            />
          </FormItem>
          <FormItem label={"Price"} {...formItemLayout}>
            <InputNumber
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onChange={this.numberChange("price")}
            />
          </FormItem>
          <FormItem label={"Condition"} {...formItemLayout}>
            <Select
              placeholder={"Condition"}
              onChange={this.numberChange("condition")}
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
            />
          </FormItem>
          <FormItem label={"Images"}>
            <PostImages
              pushImages={this.pushImages}
              removeImage={this.removeImage}
            />
          </FormItem>

          <Button htmlType={"submit"}>Submit</Button>
        </Form>
      </div>
    );
  }
}

const createPost = gql`
  mutation createPost($newPost: newPostInput!) {
    createPost(newPost: $newPost) {
      id
    }
  }
`;

export default graphql(createPost)(NewPost);
