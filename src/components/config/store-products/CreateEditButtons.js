import React from 'react';
import { withRouter } from "react-router-dom";

import { Button } from "@material-ui/core";

const CreateEditButtons = (props) => {
  const { activeStep, product, steps } = props;

  const handleBack = () => {
    props.setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const isDisabledNext = () => {
    // prevent people from going to the next step without enough info
    switch (activeStep) {
      case 0:
        if (product.name.length) return false;
        return true;
      case 1:
      case 2:
      case 3:
        return false;
      default:
        return true;
    }
  }

  return (
    <div>
      <Button
        onClick={() => {
          if (activeStep === 0) props.history.push("/config")
          else handleBack()
        }}
        variant="outlined"
        style={{ marginRight: "10px" }}
      >
        {activeStep === 0 ? 'Cancel Changes' : 'Back'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (activeStep === steps.length - 1)
            props.history.push("/config")
          else props.handleNext()
        }}
        disabled={isDisabledNext(activeStep)}
      >
        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
};
export default withRouter(CreateEditButtons);