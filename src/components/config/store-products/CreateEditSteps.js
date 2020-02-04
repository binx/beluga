import React from 'react';
import styled from "styled-components";

import CreateEditButtons from "./CreateEditButtons";

import { Stepper, Step, StepLabel, StepContent } from "@material-ui/core";

import ProductStep1 from "../product/ProductStep1";
import ProductStep2 from "../product/ProductStep2";
import ProductStep3 from "../product/ProductStep3";
import ProductStep4 from "../product/ProductStep4";

const ExampleWrapper = styled.div `
  border-bottom: 1px dashed #888;
  padding-bottom: 40px;
  margin-bottom: 20px;
`;
const ExampleProductImage = styled.div `
  background-image: url(${`${process.env.PUBLIC_URL}/assets/example-product.png`});
  height: 450px;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
`;

const CreateEditSteps = (props) => {
  const { product, handleChange, activeStep } = props;

  const steps = [
    "Name and Description",
    "Product Variations",
    "Price",
    "Photos"
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ProductStep1 product={product} handleChange={handleChange} />;
      case 1:
        return <ProductStep2 product={product} handleChange={handleChange} />;
      case 2:
        return <ProductStep3
            product={product}
            skus={props.skus}
            setSkus={props.setSkus}
          />;
      case 3:
        return <ProductStep4
            product={product}
            handleChange={handleChange}
            saveConfig={props.saveConfig}
          />;
      default:
        return 'ya done goofed';
    }
  }

  return (
    <div>
      <ExampleWrapper>
        <ExampleProductImage />
      </ExampleWrapper>

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
                product={product}
                steps={steps}
              />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
export default CreateEditSteps;