import React from 'react';
import { withRouter } from "react-router-dom";

import { Button } from "@material-ui/core";

function CreateEditButtons(props) {
  const { activeStep, steps } = props;

  const handleBack = () => {
    props.setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <Button
        onClick={() => {
          if (activeStep === 0) props.history.push("/config?tab=1")
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
            props.history.push("/config?tab=1")
          else props.handleNext()
        }}
      >
        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
};
export default withRouter(CreateEditButtons);