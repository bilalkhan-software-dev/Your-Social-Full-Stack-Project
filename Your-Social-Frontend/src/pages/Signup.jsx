import { useState } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
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
import { loginUserAction, registerUserAction } from "../Redux/Auth/authAction";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const theme = useTheme();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      // .matches(/[a-z]/, "Must contain at least one lowercase letter")
      // .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      // .matches(/[0-9]/, "Must contain at least one number")
      .required("Password is required"),
    gender: Yup.string().required("Please select gender"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { confirmPassword, ...registrationData } = values;
      await dispatch(registerUserAction(registrationData));
      const { email, password } = values;
      await dispatch(loginUserAction({ email, password }));
      navigate("/");
      resetForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Registration failed. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
              <Box sx={{ display: "flex", gap: 2 }}>
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  type="text"
                  autoComplete="given-name"
                  variant="outlined"
                  fullWidth
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />

                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  type="text"
                  autoComplete="family-name"
                  variant="outlined"
                  fullWidth
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Box>

              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                autoComplete="email"
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
                autoComplete="new-password"
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
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {!showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Field
                as={TextField}
                name="gender"
                label="Gender"
                select
                autoComplete="sex"
                variant="outlined"
                fullWidth
                error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
              </Field>

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
                {isSubmitting || auth.loading ? "Signing Up..." : "Sign Up"}
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
          Already have an account?
        </Typography>
        <Button
          onClick={() => navigate("/signin")}
          color="primary"
          size="small"
        >
          Sign In
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

export default Signup;
