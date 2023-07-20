import React, { Component } from 'react';
import SliderWrapper from './SliderWrapper';

export class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triggered: false,
      position: '25',
      imagewidth: '',
      imageheight: '',
    };
  }

  positionsetter = pos => {
    this.setState({
      position: `${pos}`,
    });
  };
  istriggered = () => {
    this.setState({
      triggered: true,
    });
  };
  setimagesize = () => {
    this.setState({
      imagewidth: '',
      imageheight: '',
    });
  };
  initComparisons = () => {
    var x, i;
    x = document.getElementsByClassName('img-comp-overlay');
    for (i = 0; i < x.length; i++) {
      compareImages(x[i], this);
    }
    function compareImages(img, setposi) {
      var slider,
        img,
        clicked = 0,
        w,
        h;
      w = img.offsetWidth;
      h = img.offsetHeight;
      img.style.width = setposi.state.position + 'px';
      slider = document.getElementsByClassName('img-comp-slider')[0];
      slider.style.left = setposi.state.position + 'px';
      slider.addEventListener('mousedown', slideReady);
      window.addEventListener('mouseup', slideFinish);
      slider.addEventListener('touchstart', slideReady);
      window.addEventListener('touchend', slideFinish);
      function slideReady(e) {
        e.preventDefault();
        clicked = 1;
        window.addEventListener('mousemove', slideMove);
        window.addEventListener('touchmove', slideMove);
      }
      function slideFinish() {
        clicked = 0;
      }
      function slideMove(e) {
        var pos;
        if (clicked == 0) return false;
        pos = getCursorPos();
        console.log(pos);
        if (pos < 0) {
          slide(0);
        } else if (pos > w) {
          slide(w);
        } else {
          slide(pos);
        }
      }
      function getCursorPos(e) {
        var a,
          x = 0;
        e = e || window.event;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        x = x - window.pageXOffset;
        return x;
      }
      function slide(x) {
        img.style.width = x + 'px';
        console.log(x + 'px');
        slider.style.left = x + 'px';
      }
    }
  };
  componentDidMount() {
    window.addEventListener('resize', this.setimagesize);
    let pospsetter = this.positionsetter;
    let triggersetter = this.istriggered;
    this.initComparisons();
    let toobserve = document.getElementsByClassName('img-comp-container')[0];
    let observer = new IntersectionObserver(triggerfunction, {
      threshold: 0.5,
    });
    observer.observe(toobserve);
    function triggerfunction(entry) {
      // if(entries[0].)
      if (entry[0].intersectionRatio > 0.25) {
        observer.unobserve(toobserve);
        triggersetter();
        var px = 0;
        const slide_end = 350;
        const slide_start = 350 / 2;
        let reached_right = false;
        const clear_slide_increase = setTimeout(() => {
          clearInterval(increaseslider);
        }, 3000);
        const increaseslider = setInterval(() => {
          if (reached_right == false) {
            if (px < slide_end) {
              pospsetter(px + 3);
              px = px + 3;
              if (slide_end - px <= 0) {
                reached_right = true;
              }
            }
          }
          if (reached_right == true) {
            if (px > slide_start) {
              pospsetter(px + -3);
              px = px + -3;
              if (px <= 0) {
                reached_right = false;
              }
            }
          }
        }, 0.1);
        console.log('observerd');
      }
    }
  }
  componentDidUpdate() {
    if (this.state.triggered == true) {
      // this.observer.unobserve(this.toobserve);
    }
    const image = document.getElementsByClassName('img-comp-overlay')[0];
    const slider = document.getElementsByClassName('img-comp-slider')[0];
    image.style.width = this.state.position + 'px';
    slider.style.left = this.state.position + 'px';
  }
  componentWillUnmount() {}
  render() {
    return (
      <SliderWrapper>
        <div className="img-comp-container">
          <div className="img-comp-img">
            <img src={this.props.image1} className="image-for-compare" alt="left image" />
          </div>
          <div className="img-comp-slider">
            <img
              src={this.props.sliderimage}
              // style={{ width: '50px', height: '50px' }}
              alt="slider"
              className="sliderclassimage"
            ></img>
          </div>
          <div className="img-comp-img img-comp-overlay">
            <img src={this.props.image2} className="image-for-compare" alt="right image" />
          </div>
        </div>
      </SliderWrapper>
    );
  }
}

export default Slider;
