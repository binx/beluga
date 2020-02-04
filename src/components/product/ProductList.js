import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';

const Wrapper = styled.div `
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 40px;
  > a {
    text-decoration: none;
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px;
  }
`;
const LargeIMG = styled.div `
  background-image: url(${props => props.img});
  background-color: #ddd;
  width: 100%;
  padding-bottom: 133%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
  @media (min-width: 650px) {
    filter: grayscale(100%);
    transition: filter .5s;
    &:hover {
      filter: grayscale(0);
    }
  }
`;
const ImgWrapper = styled.div `
  border-bottom: 3px solid ${props => props.borderColor};
  display: flex;
`;
const Title = styled.div `
  color: black;
  text-decoration-color: #FF7400;
  margin-top: 10px;
  @media (max-width: 650px) {
    font-size: 14px;
  }
`;
const Price = styled.span `
  display: block;
  color: #888;
  font-size: 14px;
  margin-top: 5px;
`;

function ProductList(props) {
  const [products, setProducts] = useState(props.products);

  useEffect(() => {
    fetch('/product-info/')
      .then(res => res.json())
      .then(skus => {
        let newProducts = [...products]
        newProducts.forEach(product => {
          let skuList = [...skus]
          skuList = skuList.filter(s => s.product === product.stripe_id)
            .map(s => s.price / 100)
          if (skuList.length === 1) {
            product["price"] = skuList[0].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
          } else {
            let min = Math.min(...skuList),
              max = Math.max(...skuList);
            if (min === max) product["price"] = skuList[0].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            else product["price"] = `${min.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} - ${max.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
          }
        })
        setProducts(newProducts)
      }).catch(error => console.error('Error:', error))
  }, [props.products]);

  const displayProducts = [...products].filter(p => p.is_live);

  return (
    <Wrapper>
      { displayProducts.map((product,i) => {
        const url = (product.photos && !!product.photos.length) 
          ? `${process.env.PUBLIC_URL}/assets/${product.stripe_id}/${product.photos[0].name}`
          : null;

        let linkProps = { pathname: `/product/${product.url}` };
        if (props.collection)
          linkProps["state"] = { collection: props.collection };
          
        return (
          <Link key={i} to={linkProps}>
            <ImgWrapper borderColor={props.theme.palette.secondary.main}>
              <LargeIMG img={url}/>
            </ImgWrapper>
            <Title>
              {product.name}
              <Price>{product.price}</Price>
            </Title>
          </Link>
        );
      })}
    </Wrapper>
  );
};
export default withTheme(ProductList);