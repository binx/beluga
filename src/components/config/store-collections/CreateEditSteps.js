import React from 'react';

import CreateEditButtons from "./CreateEditButtons";

import { Stepper, Step, StepLabel, StepContent } from "@material-ui/core";

import CollectionStep1 from "../collection/CollectionStep1";
import CollectionStep2 from "../collection/CollectionStep2";

const CreateEditSteps = (props) => {
  const { collection, handleChange, activeStep, storeConfig } = props;

  const steps = [
    "Title and Products",
    "Cover Image"
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <CollectionStep1
            collection={collection}
            handleChange={handleChange}
            storeConfig={storeConfig}
          />;
      case 1:
        return <CollectionStep2
            collection={collection}
            handleChange={handleChange}
            saveConfig={props.saveConfig}
          />;
      default:
        return 'ya done goofed';
    }
  }

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
          <StepContent>
            <div>{getStepContent(index)}</div>
            <CreateEditButtons
              activeStep={activeStep}
              setActiveStep={props.setActiveStep}
              handleNext={props.handleNext}
              steps={steps}
            />
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
};
export default CreateEditSteps;