import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import { SnackbarHandlerContext } from "./contexts/SnackbarHandlerContext";
import { SnackbarContext } from "./contexts/SnackbarContext";
import { Header } from "./cmps/Header";
import { LoginSignup } from "./pages/LoginSignup";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [snack, setSnack] = useState({});
  useEffect(() => {
    if (loggedUser) return;
    if (Cookies.get("loggedUser")) {
      const jsonStr = Cookies.get("loggedUser").slice(2);
      setLoggedUser(JSON.parse(jsonStr));
    }
  }, [loggedUser]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnack((prevSnack) => {
      return { ...prevSnack, open: false };
    });
  };

  const notificationHandler = {
    success: (message) => showNotification("success", message),
    error: (message) => showNotification("error", message),
    info: (message) => showNotification("info", message),
    warning: (message) => showNotification("warning", message),
  };

  const showNotification = (severity, message) => {
    const snackObj = { severity, message, open: true };
    if (snack.open) {
      setSnack((prevSnack) => {
        return { ...prevSnack, open: false };
      });
      return setTimeout(() => {
        setSnack(snackObj);
      }, 100);
    } else setSnack(snackObj);
  };

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
          <SnackbarHandlerContext.Provider value={notificationHandler}>
            <SnackbarContext.Provider value={{ snack, setSnack }}>
              {
                <Snackbar
                  TransitionComponent={Slide}
                  onClose={handleClose}
                  autoHideDuration={3000}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  open={snack.open}
                >
                  <Alert
                    onClose={handleClose}
                    severity={snack.severity}
                    sx={{ width: "100%" }}
                  >
                    {snack.message}
                    {/* <Button onClick={handleClose}>Share</Button> */}
                  </Alert>
                </Snackbar>
              }
              <Header />
              <button onClick={() => notificationHandler.success("Snackbar")}>
                Test Snack
              </button>
              <div className="content">
                <Switch>
                  {/* <Route path="/" component={Home} exact /> */}
                  <Route path="/login" component={LoginSignup} />
                  {/* <Route path="/board" component={Board} />
                                    <Route
                                        path="/company"
                                        component={CompanyProfile}
                                    /> */}
                </Switch>
              </div>
            </SnackbarContext.Provider>
          </SnackbarHandlerContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
