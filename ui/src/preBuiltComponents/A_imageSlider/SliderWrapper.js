import styled from 'styled-components';

const SliderWrapper = styled.div`
  display: flex;
  justify-content: center;
  .img-comp-container {
    position: relative;
    height: 350px; /*should be the same height as the images*/
    width: 350px;
    overflow: hidden;
  }
  .image-for-compare {
    height: 350px;
    width: 350px;
  }
  .img-comp-img {
    position: absolute;
    width: auto;
    height: auto;
    overflow: hidden;
  }

  .img-comp-img img {
    display: block;
    /* vertical-align: middle; */
  }

  .img-comp-slider {
    position: absolute;
    z-index: 9;
    cursor: ew-resize;
    /*set the appearance of the slider:*/
    width: 5px;
    height: 100%;
    opacity: 0.7;
    background-color: #6898e3;
    /* border-radius: 50%; */
  }
  .img-comp-slider img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .sliderclassimage {
    width: 50px;
    height: 50px;
  }
`;
export default SliderWrapper;
