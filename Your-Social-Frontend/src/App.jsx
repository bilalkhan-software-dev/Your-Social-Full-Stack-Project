import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Authentication from "./pages/Authentication";
import HomePage from "./pages/HomePage/HomePage";
import Message from "./pages/Message/Message";
import { getProfileAction } from "./Redux/Auth/authAction";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "./theme/DarkTheme";

const App = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwtToken = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwtToken) {
      dispatch(getProfileAction());
    }
  }, [auth.token]);
  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route
          path="/*"
          element={auth.user ? <HomePage /> : <Authentication />}
        />
        <Route path="/message" element={<Message />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
