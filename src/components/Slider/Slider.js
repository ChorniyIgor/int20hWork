import React from "react";
import SlickSlider from "react-slick";
import Image from "../Image/Image";
import "./Slider.css";

const Slider = props => {
  const settings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <SlickSlider {...settings} className={`Slider`}>
      {[...props.photoUrls].length > 0 ? (
        [...props.photoUrls].map((item, index) => {
          return <Image key={index} src={item} id={index} />;
        })
      ) : (
        <h3>This album is empty</h3>
      )}
    </SlickSlider>
  );
};

export default Slider;
