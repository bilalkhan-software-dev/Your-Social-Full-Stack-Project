import { use, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { sendOtpToEmail, verifyOtp } from "../Redux/Auth/authAction";

const OtpVerification = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isResending, setIsResending] = useState(false);

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be 6 digits"),
  });
  const email = localStorage.getItem("email");

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(verifyOtp(values.otp, email));
        setSnackbar({
          open: true,
          message: auth.message || "OTP verified successfully!",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);

        navigate("/reset-password");
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Verification failed. Please try again.",
          severity: "error",
        });
      }
    },
  });

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      dispatch(sendOtpToEmail(email));
      setSnackbar({
        open: true,
        message: `New OTP sent to your email: ${email}`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to resend OTP",
        severity: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        width: "100%",
        p: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h5" component="h1" align="center" sx={{ mb: 2 }}>
        Verify OTP
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        We've sent a 6-digit code to {email}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="otp"
          label="Enter OTP"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: 6,
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          value={formik.values.otp}
          onChange={(e) => {
            // Allow only numbers
            const value = e.target.value.replace(/\D/g, "");
            formik.setFieldValue("otp", value);
          }}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.otp && formik.errors.otp)}
          helperText={formik.touched.otp && formik.errors.otp}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            onClick={handleResendOtp}
            disabled={isResending}
            sx={{ textTransform: "none" }}
          >
            {isResending ? "Sending..." : "Didn't receive code? Resend"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OtpVerification;
