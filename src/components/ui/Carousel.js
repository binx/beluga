import React, { useState } from 'react';
import styled from 'styled-components';
import { getAspect } from "../../util";

const Wrapper = styled.div `
  grid-column: span ${props => props.needsNav ? 3 : 2};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;
const NavIMGWrapper = styled.div `
  width: 75%;
`;
const IMG = styled.div `
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  margin-bottom: 10px;
  background-position: 50%;
  cursor: pointer;
`;
const LargeIMG = styled.div `
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 100%;
  padding-bottom: 133%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
`;

function Carousel({ photos, stripe_id }) {
  const [img, setImg] = useState(photos[0]);
  const needsNav = photos.length > 1;

  const getPadding = aspect => {
    if (aspect === "vertical") return "133%";
    else if (aspect === "horizontal") return "75%";
    else return "100%";
  }

  return (
    <Wrapper needsNav={needsNav}>
      {needsNav && (
        <div>
          {photos.map((p,i) => {
            return (
              <NavIMGWrapper key={i}>
                <IMG
                  style={{ paddingBottom: getPadding(getAspect(p)) }}
                  onClick={() => setImg(p)}
                  img={`${process.env.PUBLIC_URL}/assets/${stripe_id}/${p.name}`}
                />
              </NavIMGWrapper>
            )
          })}
        </div>
      )}
      <div style={{ gridColumn: `span ${needsNav ? 3 : 4}` }}>
        <LargeIMG
          style={{ paddingBottom: getPadding(getAspect(img)) }}
          needsNav={needsNav}
          img={`${process.env.PUBLIC_URL}/assets/${stripe_id}/${img.name}`}
        />
      </div>
    </Wrapper>
  );
};

export default Carousel;