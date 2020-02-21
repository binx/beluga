import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

const Table = styled.table `
  width: 100%;
  border-collapse: collapse;

  thead > tr > th {
    font-weight: normal;
    font-size: 12px;
    color: #888;
    text-align: left;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
  tbody > tr > td {
    padding: 10px 4px;
    border-bottom: 1px solid #ddd;
  }
`;
const Flex = styled.div `
  display: flex;
  align-items: center;
`;
const Image = styled.div `
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 125px;
  height: 125px;
  background-size: cover;
  background-position: 50%;
  @media (max-width: 650px) {
    width: 62px;
    height: 62px;
  }
`;
const Remove = styled.span `
  cursor: pointer;
  opacity: .5;
  transition: opacity .5s;
  &:hover { opacity: 1; }
`;
const Title = styled.div `
  margin-left: 30px;
  @media (max-width: 650px) {
    margin-left: 10px;
  }
`;
const Name = styled.div `
  margin-bottom: 10px;
  font-size: 16px;
  > a {
    color: black;
    text-decoration-color: ${props => props.underline};
  }
`;
const Attrs = styled.div `
  color: #888;
  font-size: 12px;
  text-transform: capitalize;
`;

const CartTable = ({ items, theme, updateCount, removeItem }) => (
  <Table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Total</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      { items.map((d,i) => {
        let attrs = [];
        for (let key in d.attr) {
          attrs.push(`${key.replace("_", " ")}: ${d.attr[key]}`)
        }
        attrs = attrs.join(", ");

        return (<tr key={`cart${i}`}>
          <td>
            <Flex>
              <Image img={d.img} />
              <Title>
                <Name underline={theme.palette.primary.main}>
                  <Link to={d.url ? d.url : "/"}>{d.name}</Link>
                </Name>
                <Attrs>{attrs}</Attrs>
              </Title>
            </Flex>
          </td>
          <td>
            <TextField
              value={d.quantity}
              onChange={(e) => {
                if (e.target.value < 0) e.target.value = 0;
                updateCount(i, e.target.value)
              }}
              type="number"
              inputProps={{ min: "1", step: "1" }}
              margin="none"
              style={{ width: "40px" }}
            />
          </td>
          <td>
            ${(d.quantity*d.price).toFixed(2)}
          </td>
          <td>
            <Remove onClick={() => removeItem(i)}>✕</Remove>
          </td>
        </tr>);
      })}
    </tbody>
  </Table>
);

export default withTheme(CartTable);