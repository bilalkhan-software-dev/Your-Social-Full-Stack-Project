import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Avatar,
  IconButton,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import ImageIcon from "@mui/icons-material/Image";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useDispatch } from "react-redux";
import { updatePostAction } from "../../Redux/Post/postAction";

const getModalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 600, md: 700 },
  maxHeight: "90vh",
  bgcolor: theme.palette.background.paper,
  overflow: "auto",
  outline: "none",
  borderRadius: 3,
  boxShadow: theme.shadows[5],
  p: 3,
  display: "flex",
  flexDirection: "column",
});

export default function EditPostModal({ open, handleClose, post, user }) {
  const theme = useTheme();
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const dispatch = useDispatch();

  const resetForm = () => {
    formik.resetForm();
    setImagePreview(null);
    setVideoFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  useEffect(() => {
    if (post) {
      formik.setValues({
        caption: post.caption || "",
        image: post.image || "",
        video: post.video || "",
      });
      if (post.image) setImagePreview(post.image);
      if (post.video) setVideoFile(post.video);
    }
  }, [post]);

  const modalStyle = getModalStyle(theme);
  const formik = useFormik({
    initialValues: {
      caption: "",
      image:"",
      video:"",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let imageUrl = values.image;
        let videoUrl = values.video;

        // Only upload new files if they're different from the original
        if (imagePreview && imagePreview !== post.image) {
          imageUrl = await uploadToCloudinary(
            imagePreview,
            "image",
            (progress) => setUploadProgress(progress)
          );
        }

        if (videoFile && videoFile !== post.video) {
          videoUrl = await uploadToCloudinary(videoFile, "video", (progress) =>
            setUploadProgress(progress)
          );
        }

        const postData = {
          ...values,
          image: imageUrl,
          video: videoUrl,
        };

        await dispatch(updatePostAction(post.postId, postData));
        setSnackbarMessage("Post updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleClose();
      } catch (error) {
        console.error("Error updating post:", error);
        setSnackbarMessage(error.message || "Failed to update post");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        formik.setFieldValue("image", file);
      };
      reader.readAsDataURL(file);
      setVideoFile(null);
      formik.setFieldValue("video", "");
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleVideoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setVideoFile(file);
      formik.setFieldValue("video", file);
      setImagePreview(null);
      formik.setFieldValue("image", "");
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const removeMedia = () => {
    setImagePreview(null);
    setVideoFile(null);
    formik.setFieldValue("image", null);
    formik.setFieldValue("video", null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={!isLoading ? handleModalClose : undefined}
        aria-labelledby="edit-post-modal"
        aria-describedby="edit-user-post"
      >
        <Box sx={modalStyle} className="hide-scrollbar">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Edit Post
            </Typography>
            <IconButton
              onClick={handleModalClose}
              disabled={isLoading}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                src={user?.image}
                sx={{
                  bgcolor: theme.palette.grey[800],
                  width: 40,
                  height: 40,
                }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "medium",
                    color: theme.palette.text.primary,
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  @{user?.firstName?.toLowerCase()}_
                  {user?.lastName?.toLowerCase()}
                </Typography>
              </Box>
            </Box>

            <TextField
              multiline
              rows={4}
              placeholder="Write caption..."
              name="caption"
              value={formik.values.caption}
              onChange={formik.handleChange}
              disabled={isLoading}
              sx={{
                mt: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              inputProps={{
                style: {
                  color: theme.palette.text.primary,
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 3, alignItems: "center", mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  id="image-input"
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  style={{ display: "none" }}
                  disabled={isLoading}
                />
                <label htmlFor="image-input">
                  <IconButton
                    color="primary"
                    component="span"
                    disabled={isLoading}
                    sx={{
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ImageIcon />
                  </IconButton>
                </label>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Image
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="file"
                  accept="video/*"
                  id="video-input"
                  onChange={handleVideoChange}
                  ref={videoInputRef}
                  style={{ display: "none" }}
                  disabled={isLoading}
                />
                <label htmlFor="video-input">
                  <IconButton
                    color="primary"
                    component="span"
                    disabled={isLoading}
                    sx={{
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <VideoCallIcon />
                  </IconButton>
                </label>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Video
                </Typography>
              </Box>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2, position: "relative" }}>
                <Box
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    overflow: "hidden",
                    borderRadius: 1,
                    backgroundColor: theme.palette.grey[900],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      typeof imagePreview === "string"
                        ? imagePreview
                        : imagePreview
                    }
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                    }}
                  />
                  <IconButton
                    onClick={removeMedia}
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
                    disabled={isLoading}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            {videoFile && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: theme.palette.grey[900],
                  borderRadius: 1,
                }}
              >
                {typeof videoFile === "string" ? (
                  <video controls style={{ width: "100%", maxHeight: 200 }}>
                    <source src={videoFile} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      New video selected: {videoFile.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {isLoading && uploadProgress > 0 && (
              <Box sx={{ mt: 3, width: "100%" }}>
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: theme.palette.grey[300],
                    borderRadius: "9999px",
                    height: 8,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      height: 8,
                      borderRadius: "9999px",
                      width: `${uploadProgress}%`,
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    mt: 1,
                  }}
                >
                  Uploading: {uploadProgress}%
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                pt: 2,
                pb: 2,
                position: "sticky",
                bottom: 0,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                  borderRadius: "20px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "medium",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {isLoading ? "Updating..." : "Update Post"}
              </Button>
            </Box>
          </form>

          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            open={isLoading && uploadProgress === 0}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[3],
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}