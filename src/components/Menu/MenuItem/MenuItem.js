import React from "react";

const MenuItem = props => {
  const click = evt => {
    /*document
      .querySelector(".Menu")
      .querySelectorAll("button")
      .forEach(item => (item.disabled = false));*/
    //evt.target.disabled = true;
    const emotion = evt.target.dataset.emotion;
    props.showPhotoEmotions(emotion);
  };
  return (
    <li>
      {props.activeEmotionName === props.emotionName ? (
        <button onClick={click} data-emotion={props.emotionName} disabled>
          {props.emotionName}
        </button>
      ) : (
        <button onClick={click} data-emotion={props.emotionName}>
          {props.emotionName}
        </button>
      )}
    </li>
  );
};

export default MenuItem;
