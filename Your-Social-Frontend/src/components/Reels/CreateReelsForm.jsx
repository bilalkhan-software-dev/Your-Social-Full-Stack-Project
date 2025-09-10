import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  LinearProgress,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useDispatch, useSelector } from "react-redux";
import { createReelAction } from "../../Redux/Reel/reelAction";
import { grey } from "@mui/material/colors";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must be at most 100 characters"),
  video: Yup.mixed()
    .required("Video is required")
    .test(
      "fileSize",
      "File too large (max 50MB)",
      (value) => value && value.size <= 50 * 1024 * 1024
    )
    .test(
      "fileType",
      "Unsupported file format (use MP4 or MOV)",
      (value) => value && ["video/mp4", "video/quicktime"].includes(value.type)
    ),
});

const CreateReelsForm = () => {
  const videoInputRef = useRef(null);
  const dispatch = useDispatch();
  const { auth, reel } = useSelector((store) => store);
  const user = auth?.user;

  const formik = useFormik({
    initialValues: {
      title: "My Awesome Reel",
      video: null,
      videoPreview: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        const videoUrl = await uploadToCloudinary(
          values.video,
          "video",
          (progress) => {
            formik.setFieldValue("uploadProgress", progress);
          }
        );

        const reelData = {
          title: values.title,
          video: videoUrl,
        };

        await dispatch(createReelAction(reelData));

        resetForm();
        alert("Reel created successfully!");
      } catch (err) {
        console.error("Error submitting reel:", err);
        setFieldError(
          "form",
          reel?.message || reel.error || "Failed to create reel"
        );
      } finally {
        setSubmitting(false);
        formik.setFieldValue("uploadProgress", 0);
      }
    },
  });

  const handleVideoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("video", file);
      formik.setFieldValue("videoPreview", URL.createObjectURL(file));
      formik.setFieldError("video", undefined);
    }
  };

  const removeVideo = () => {
    formik.setFieldValue("video", null);
    formik.setFieldValue("videoPreview", null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const theme = useTheme();
  const isMid = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        p: 3,
        width: 600,
        mx: "auto",
        borderRadius: 8,
        marginLeft: `${isMid ? 20 : 0}`,
        backgroundColor: grey[900],
        my: 4,
      }}
      className="border-4 border-gray-900/100 shadow-2xl/90 "
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <Avatar
          src={user?.image}
          sx={{
            bgcolor: "grey.800",
            width: 40,
            height: 40,
          }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            @{user?.firstName?.toLowerCase()}_{user?.lastName?.toLowerCase()}
          </Typography>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          name="title"
          label="Reel Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          disabled={formik.isSubmitting}
          sx={{ mb: 3 }}
        />

        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
          }}
        >
          {formik.values.videoPreview ? (
            <Box sx={{ width: "100%", position: "relative" }}>
              <video
                src={formik.values.videoPreview}
                controls
                style={{
                  width: "100%",
                  maxHeight: 300,
                  borderRadius: 4,
                }}
              />
              <IconButton
                onClick={removeVideo}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                disabled={formik.isSubmitting}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <input
                type="file"
                accept="video/*"
                id="video-input"
                onChange={handleVideoChange}
                ref={videoInputRef}
                style={{ display: "none" }}
                disabled={formik.isSubmitting}
              />
              <label htmlFor="video-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<VideoCallIcon />}
                  disabled={formik.isSubmitting}
                  sx={{ mb: 2 }}
                >
                  Upload Video
                </Button>
              </label>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                MP4 or MOV, max 50MB
              </Typography>
              {formik.touched.video && formik.errors.video && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {formik.errors.video}
                </Typography>
              )}
            </>
          )}
        </Box>

        {formik.errors.form && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {formik.errors.form}
          </Typography>
        )}

        {formik.isSubmitting && formik.values.uploadProgress > 0 && (
          <Box sx={{ width: "100%", mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={formik.values.uploadProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "right" }}
            >
              Uploading: {formik.values.uploadProgress}%
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          sx={{ py: 1.5 }}
        >
          {formik.isSubmitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Creating Reel...
            </>
          ) : (
            "Create Reel"
          )}
        </Button>
      </form>
    </Box>
  );
};

export default CreateReelsForm;
