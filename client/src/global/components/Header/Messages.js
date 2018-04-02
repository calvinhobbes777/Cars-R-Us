import React, { Component } from "react";
import styled from "styled-components";
import { Menu, Dropdown, Icon, Button } from "antd";

class Messages extends Component {
  render() {
    const menu = <Menu />;

    return (
      <div>
        <Dropdown overlay={menu}>
          <StyledButton ghost>
            Messages <Icon type="down" />
          </StyledButton>
        </Dropdown>
      </div>
    );
  }
}

const StyledButton = styled(Button)`
  color: #86cb92 !important;
  border-color: #86cb92 !important;
  @media (max-width: 375px) {
    margin-bottom: 12px;
  }
`;

export default Messages;
