import { useState } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../Redux/Auth/authAction";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const userRequestEmail = localStorage.getItem("email");
  const initialValues = { email: userRequestEmail, newPassword: "" };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(resetPassword(values));

      setSnackbar({
        open: true,
        message: "Password Reset Successfully",
        severity: "success",
      });
      
      setTimeout(() => navigate("/"), 4000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Password Reset Failed!",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box sx={{ display: "grid", gap: 3 }}>
              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="newPassword"
                label="Enter new password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting || auth.loading}
                startIcon={
                  isSubmitting || auth.loading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                sx={{ py: 1.5 }}
              >
                {isSubmitting || auth.loading
                  ? "Reseting password ..."
                  : "Reset Password"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

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

export default ResetPassword;
