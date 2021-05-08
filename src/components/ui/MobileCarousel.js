import React, { useState } from 'react';
import styled from 'styled-components';
import { getAspect } from "../../util";

import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';

const Wrapper = styled.div `
  position: relative;
`;
const Flex = styled.div `
  display: flex;
  align-items: center;
  height: 100%;
`;
const LargeIMG = styled.div `
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
  grid-column: span 3;
  margin: auto;
`;

function MobileCarousel({ photos, stripe_id }) {
  const [activeStep, setActiveStep] = useState(0)

  const getPadding = aspect => {
    if (aspect === "vertical") return "133%";
    else if (aspect === "horizontal") return "75%";
    else return "100%";
  }

  const maxSteps = photos.length;

  return (
    <Wrapper>
      <SwipeableViews
        axis='x'
        index={activeStep}
        onChangeIndex={setActiveStep}
        enableMouseEvents
      >
        {photos.map((p,i) => (
          <Flex key={`photos${i}`}>
            <LargeIMG
              style={{ paddingBottom: getPadding(getAspect(p)) }}
              img={`${process.env.PUBLIC_URL}/assets/${stripe_id}/${p.name}`}
            />
          </Flex>
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        
        nextButton={
          <Button
            size="small"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={activeStep === maxSteps - 1}
          >
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={activeStep === 0}
          >
            <KeyboardArrowLeft />
          </Button>
        }
      />
    </Wrapper>
  );
};
export default MobileCarousel;