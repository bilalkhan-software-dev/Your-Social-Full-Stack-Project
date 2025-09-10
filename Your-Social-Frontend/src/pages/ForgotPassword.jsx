import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpToEmail } from "../Redux/Auth/authAction";
import WestIcon from "@mui/icons-material/West";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(sendOtpToEmail(values.email));
        formik.resetForm();
        // }
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "An error occurred. Please try again.",
          severity: "error",
        });
        setServerError(error.message || "An error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

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
      <Tooltip title="Back to signin" arrow placement="right">
        <IconButton onClick={() => navigate("/signin")}>
          <WestIcon />
        </IconButton>
      </Tooltip>

      <Typography variant="h5" component="h1" align="center" sx={{ mb: 1 }}>
        Forgot Password
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Enter your email address and we'll send you a OTP to reset your
        password.
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="email"
          label="Email address"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(
            (formik.touched.email && formik.errors.email) || serverError
          )}
          helperText={
            (formik.touched.email && formik.errors.email) ||
            (formik.touched.email && serverError)
          }
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
          disabled={formik.isSubmitting || !formik.dirty}
        >
          {formik.isSubmitting ? "Sending..." : "Send Reset OTP"}
        </Button>
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

export default ForgotPassword;
