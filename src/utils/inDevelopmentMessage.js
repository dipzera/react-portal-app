import React, { useEffect, useLayoutEffect } from "react";
import TranslateText from "./translate";
import "./in_development.scss";
import IntlMessage from "../components/util-components/IntlMessage";
import $ from "jquery";
import { useSelector } from "react-redux";
import { fakeAPI } from "../api/index";
import { message } from "antd";

const InDevelopmentMessage = () => {
  const locale = useSelector((state) => state["auth"].locale);
  useLayoutEffect(() => {
    $("div.header").append("<div class='glitch-window'></div>");
    //fill div with clone of real header
    $("h1.glitched").clone().appendTo(".glitch-window");
    return () => {
      $("div.header").empty();
      $("div.glitch-window").empty();
    };
  }, [locale]);
  return (
    <div className="header">
      <h1 className="glitched">
        <IntlMessage id="InDevelopment" />
      </h1>
    </div>
  );
};

export default InDevelopmentMessage;
