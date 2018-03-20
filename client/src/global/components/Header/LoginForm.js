import React from "react";
import { Modal, Form, Input } from "antd";

export default props => {
  const { inputChange, loginFormSubmit, showLoginForm, showModal } = props;
  return (
    <Modal
      title="Login"
      visible={showLoginForm}
      onOk={loginFormSubmit}
      onCancel={showModal("login")}
    >
      <Form>
        <Input
          type="text"
          name={"email"}
          placeholder={"Email"}
          onChange={inputChange}
          style={{ marginBottom: "10px" }}
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
