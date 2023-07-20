import React from "react";
import styled from "styled-components";
import nopagefoundimage from "../../assets/images/nopagefound.webp";
const NotFoundPage = () => {
  return (
    <NotFoundPageWrapper>
      <div className="absolute">
        <img src={nopagefoundimage} alt="no page found" />
      </div>
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;

export const NotFoundPageWrapper = styled.section`
  display: flex;
  justify-content: center;
  img {
    margin-top: 100px;
    width: 300px;
    max-width: 100%;
  }
`;
