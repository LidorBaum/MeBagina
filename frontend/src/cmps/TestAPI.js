import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SnackbarHandlerContext } from "../contexts/SnackbarHandlerContext";

const notificationHandler = useContext(SnackbarHandlerContext);

export function Header(props) {
  const testSnack = () => {
    notificationHandler.success("test snack");
  };

  const createDog = async () => {
    const dogObj = {
      name: "tester testi",
      password: "12323443erfddfdfdfs",
    };
  };

  return <div>Loading</div>;
}
