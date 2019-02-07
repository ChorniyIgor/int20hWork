import React from "react";
import "./Menu.css";
import logo from "../../image/logo.png";
import MenuItem from "./MenuItem/MenuItem";

const Menu = props => {
  const menuItem = [`anger`, `disgust`, `fear`, `happiness`, `neutral`, `sadness`, `surprise`];
  return (
    <React.Fragment>
      <img alt={"logo"} className={"Logo"} src={logo} />
      <h2 className={`Header`}>choose emotion:</h2>
      <ul className={"Menu"}>
        <div className={`container`}>
          {menuItem.map((item, index) => {
            return (
              <MenuItem
                key={index}
                activeEmotionName={props.activeEmotionName}
                emotionName={item}
                showPhotoEmotions={props.showPhotoEmotions}
              />
            );
          })}
        </div>
      </ul>
    </React.Fragment>
  );
};

export default Menu;
