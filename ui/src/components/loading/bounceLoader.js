import React from "react";
import styled from "styled-components";

function BounceLoader() {
  return (
    <BounceLoaderWrapper>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </BounceLoaderWrapper>
  );
}

export default BounceLoader;

const BounceLoaderWrapper = styled.section`
  ul {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 5px;
    background: transparent;
  }
  li {
    list-style: none;
    display: inline-block;
    margin: 0 28px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #262626;
    position: relative;
    transform: translateY(-20px);
    animation: animate 1s infinite linear;
  }
  @keyframes animate {
    0% {
      transform: translateY(-20px);
    }
    50% {
      transform: translateY(-120px);
    }
    100% {
      transform: translateY(-20px);
    }
  }
  ul li:nth-of-type(1) {
    animation-delay: 0s;
  }
  ul li:nth-of-type(2) {
    animation-delay: 0.3s;
  }
  ul li:nth-of-type(3) {
    animation-delay: 0.7s;
  }
  ul li:nth-of-type(4) {
    animation-delay: 0.4s;
  }
  ul li:nth-of-type(5) {
    animation-delay: 0.6s;
  }
`;
