import React from 'react';
import styled from "styled-components";
import ColorPicker from 'material-ui-color-picker';

import { Button, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';

const Flex = styled.div `
  display: flex;
  margin: 20px 0;
  > div {
    margin-right: 20px;
  }
`;

const Theme = ({ storeConfig, handleChange, updateStoreConfig }) => {
  return (
    <div>
      <Flex>
        <div>
          <div>Banner Color:</div>
          <ColorPicker
            value={storeConfig.colors.secondary.main}
            onChange={color => handleChange("colors.secondary.main", color)}
          />
        </div>
        <div>
          <div>Banner Text</div>
          <RadioGroup row
            value={storeConfig.colors.secondary.contrastText}
            onChange={e => handleChange("colors.secondary.contrastText", e.target.value)}
          >
            <FormControlLabel value="#FFF" control={<Radio />} label="White" />
            <FormControlLabel value="#000" control={<Radio />} label="Black" />
          </RadioGroup>
        </div>
      </Flex>

      <Flex>
        <div>
          <div>Button Color</div>
          <ColorPicker
            value={storeConfig.colors.primary.main}
            onChange={color => handleChange("colors.primary.main", color)}
          />
        </div>
        <div>
          <div>Button Hover</div>
          <ColorPicker
            value={storeConfig.colors.primary.dark}
            onChange={color => handleChange("colors.primary.dark", color)}
          />
        </div>
        <div>
          <div>Button Text</div>
          <RadioGroup row
            value={storeConfig.colors.primary.contrastText}
            onChange={e => handleChange("colors.primary.contrastText", e.target.value)}
          >
            <FormControlLabel value="#FFF" control={<Radio />} label="White" />
            <FormControlLabel value="#000" control={<Radio />} label="Black" />
          </RadioGroup>
        </div>
      </Flex>

      <Button variant="contained" color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => updateStoreConfig(null, true)}
      >
        Save
      </Button>
    </div>
  );
};
export default Theme;