import React from "react";

import { Form, Input, Button } from "antd";

export default props => {
  const { inputChange, formSubmit } = props;
  return (
    <Form onSubmit={formSubmit}>
      <Input
        type="text"
        name={"title"}
        placeholder={"Title"}
        onChange={inputChange}
      />
      <Input.TextArea
        type="text"
        name={"body"}
        placeholder={"Body"}
        onChange={inputChange}
      />
      <Button htmlType={"submit"}>Submit</Button>
    </Form>
  );
};
