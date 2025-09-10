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
import { loginUserAction } from "../Redux/Auth/authAction";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const theme = useTheme();
  const initialValues = { email: "", password: "" };
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUserAction(values));
      setSnackbar({
        open: true,
        message: "Login Successfully",
        severity: "success",
      });
      navigate("/");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Login failed!",
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
            <Box sx={{ display: "grid", gap: 2.5 }}>
              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
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
              <div
                className="flex justify-end m-0 p-0 hover:text-blue-800 cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </div>

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
                {isSubmitting || auth.loading ? "Signing In..." : "Sign In"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography variant="body2" sx={{ mr: 1 }}>
          Don't have an account?
        </Typography>
        <Button
          onClick={() => navigate("/signup")}
          color="primary"
          size="small"
        >
          Sign Up
        </Button>
      </Box>

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

export default Signin;
