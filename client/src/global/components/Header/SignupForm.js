import React from "react";

import { Modal, Form, Input } from "antd";

export default props => {
  const { showSignupForm, signUpFormSubmit, showModal, inputChange } = props;

  return (
    <Modal
      title="Sign Up"
      visible={showSignupForm}
      onOk={signUpFormSubmit}
      onCancel={showModal("signup")}
    >
      <Form>
        <Input
          type="text"
          name={"name"}
          placeholder={"Name"}
          onChange={inputChange}
        />
        <Input
          type="text"
          name={"email"}
          placeholder={"Email"}
          onChange={inputChange}
        />
        <Input
          type="password"
          name={"password"}
          placeholder={"Password"}
          onChange={inputChange}
        />
      </Form>
    </Modal>
  );
};
