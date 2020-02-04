import React from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Flex = styled.div `
  display: flex;
`;
const BigNum = styled.div `
  border: 1px solid #888;
  border-width: ${props => (props.active || props.complete) ? 0 : "1px"};
  background-color: ${props => {
    if (props.active) return props.color;
    else if (props.complete) return "#888";
    else return "white";
  }};
  color: ${props => {
    if (props.active) return "black";
    else if (props.complete) return "white";
    return "#888";
  }};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  font-size: 18px;
  line-height: 30px;
`;
const Title = styled.div `
  flex: 1;
  margin-left: 10px;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  color: ${props => {
    if (props.active) return "black";
    else if (props.complete) return "#555";
    return "#888";
  }};
`;

const CheckoutHeader = ({ pane, text, currentPane, changePane, theme }) => {
  return (
    <Flex>
      <BigNum color={theme.palette.secondary.main}
        active={pane === currentPane} complete={pane < currentPane}>
        {pane+1}
      </BigNum>
      <Title active={pane === currentPane} complete={pane < currentPane}>
        {text}
        { pane < currentPane &&
          <Typography variant="button" style={{ cursor: "pointer" }}
            onClick={changePane}>edit</Typography>
        }
      </Title>
    </Flex>
  );
}
export default withTheme(CheckoutHeader);