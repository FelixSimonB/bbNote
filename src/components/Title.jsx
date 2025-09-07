import React from "react";
import "../styles/title.css";

const Title = () => {
  return (
    <div id="title">
      <span className="icon">
        <img className="icon" src="./bbNote.ico"></img>
      </span>
      bbNote
      <img
        src="https://64.media.tumblr.com/26fd871878ac34750c7b228e5bf69cf0/0cc3599b3ded92c1-11/s250x400/0ee72523398ad39499bd823d808b2f2c8b84fc0e.gif"
        className="sticker-2"
        alt="Decorative sticker"
      />
    </div>
  );
};

export default Title;

