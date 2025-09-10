import Signin from "./Signin";
import Signup from "./Signup";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import myBgImage from "../assets/login logo.jpg";
import { Box, Typography, useTheme } from "@mui/material";
import OtpVerification from "./OtpVerification";
import ResetPassword from "./ResetPassword";
import Forgot from "./ForgotPassword/Forgot";

const Authentication = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Image Section - Hidden on mobile */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "50%",
          position: "relative",
          backgroundImage: `url(${myBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "common.white",
            maxWidth: "80%",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Connect With Your World
          </Typography>
          <Typography variant="h5">
            Join millions sharing their stories
          </Typography>
        </Box>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[9],
            p: 4,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Your Social
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mx: "auto", maxWidth: "70%" }}
            >
              Connecting people through shared posts
            </Typography>
          </Box>
          <Routes>
            <Route index element={<Signin />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Authentication;
