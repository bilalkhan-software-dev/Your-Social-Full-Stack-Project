import { useState, useRef, useContext } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { Alert, Snackbar } from "@mui/material";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import EditPostModal from "./EditPostModal";
import {
  createCommentAction,
  likePostAction,
  deletePostAction,
  savePostAction,
  likeCommentPostAction,
} from "../../Redux/Post/postAction";

const PostCard = ({ postDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, post } = useSelector((store) => store);

  // State management
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const contentRef = useRef(null);
  const openMenu = Boolean(anchorEl);

  // Form handling
  const formik = useFormik({
    initialValues: { content: "" },
    onSubmit: (values) => {
      const requestData = {
        postId: postDetails?.postId,
        data: { content: values.content },
      };
      dispatch(createCommentAction(requestData))
        .then(() => {
          showSnackbar("Comment added successfully!", "success");
          formik.resetForm();
        })
        .catch(() => {
          showSnackbar("Failed to add comment", "error");
        });
    },
  });

  // Helper functions
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentLike = async (commentId) => {
    console.log("Comment id: ", commentId);
    await dispatch(likeCommentPostAction(commentId));

    if (post.commentLikeMessage) {
      showSnackbar(post.commentLikeMessage, "success");
      return;
    }
    if (post.error) {
      showSnackbar(post.error || "Failed to update like status", "error");
      return;
    }

    // .then(() => {
    //   showSnackbar(postDetails.comments.isLiked ? "Comment Like!" : "Comment disLike!", "success");
    // })
    // .catch(() => {
    //   showSnackbar("Failed to update like status", "error");
    // });
  };

  const handlePostLike = () => {
    dispatch(likePostAction(postDetails?.postId))
      .then(() => {
        showSnackbar(
          postDetails.isLiked ? "Post unliked!" : "Post liked!",
          "success"
        );
      })
      .catch(() => {
        showSnackbar("Failed to update like status", "error");
      });
  };

  const handleSavePost = () => {
    dispatch(savePostAction(postDetails?.postId))
      .then(() => {
        showSnackbar(
          postDetails?.isSaved ? "Removed from saved" : "Post saved!",
          "success"
        );
      })
      .catch(() => {
        showSnackbar("Failed to update save status", "error");
      });
  };

  const handleEditPost = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeletePost = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    dispatch(deletePostAction(postDetails.postId))
      .then(() => {
        showSnackbar("Post deleted successfully!", "success");
      })
      .catch(() => {
        showSnackbar("Failed to delete post", "error");
      });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showSnackbar("Link copied to clipboard!", "info");
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Derived values
  const authorName = `${postDetails?.authorFirstName || ""} ${
    postDetails?.authorLastName || ""
  }`;
  const authorUsername = `@${postDetails?.authorFirstName?.toLowerCase()}_${postDetails?.authorLastName?.toLowerCase()}`;
  const authorInitials = `${postDetails?.authorFirstName?.charAt(0) || ""}${
    postDetails?.authorLastName?.charAt(0) || ""
  }`;
  const userInitials = `${auth.user?.firstName?.charAt(0) || ""}${
    auth.user?.lastName?.charAt(0) || ""
  }`;

  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
          margin: "auto",
          mb: 2,
          borderRadius: 3,
          border: "2px solid",
          borderColor: theme.palette.grey[900],
          // boxShadow: 3,
          boxShadow: theme.shadows[9],
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Card Header */}
        <Divider />
        <CardHeader
          avatar={
            <Tooltip title="Go to profile" arrow>
              <Avatar
                src={postDetails?.authorProfilePic}
                sx={{
                  bgcolor: theme.palette.grey[800],
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease",
                  },
                }}
                onClick={() => navigate(`/profile/${postDetails.authorId}`)}
                aria-label="author avatar"
              >
                {authorInitials}
              </Avatar>
            </Tooltip>
          }
          action={
            <>
              <IconButton
                aria-label="post options"
                onClick={handleMenuClick}
                aria-controls={openMenu ? "post-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="post-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "post-menu-button",
                }}
              >
                {auth.user?.id === postDetails?.authorId && (
                  <>
                    <MenuItem onClick={handleEditPost}>
                      <EditIcon sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleDeletePost}>
                      <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={handleMenuClose}>Report</MenuItem>
              </Menu>
            </>
          }
          title={authorName}
          subheader={authorUsername}
          titleTypographyProps={{ fontWeight: "medium" }}
          subheaderTypographyProps={{ variant: "caption" }}
        />
        <Divider />

        {/* Card Content */}
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 4,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
            ref={contentRef}
          >
            {postDetails?.caption}
          </Typography>

          {contentRef.current?.scrollHeight >
            contentRef.current?.clientHeight && (
            <Button
              size="small"
              onClick={toggleExpand}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mt: 1 }}
            >
              {expanded ? "Show less" : "Read more"}
            </Button>
          )}
        </CardContent>

        {/* Media */}
        {postDetails?.image && (
          <CardMedia
            component="img"
            sx={{
              width: "15rem",
              maxHeight: "25rem",
              objectFit: "cover",
              mx: "auto",
              bgcolor: theme.palette.grey[100],
              borderRadius: 2, // This adds rounded corners (8px by default in Material-UI)
              border: "2px solid", //  adds a border
              borderColor: theme.palette.grey[700],
              boxShadow: 3,
              // [theme.breakpoints.down("sm")]: { maxHeight: 300 },
            }}
            image={postDetails?.image}
            alt="Post content"
            loading="lazy"
          />
        )}

        {postDetails?.video && (
          <CardMedia
            component="video"
            sx={{
              width: "35rem",
              maxHeight: "35rem",
              mx: "auto",
              objectFit: "contain",
              bgcolor: theme.palette.grey[900],
              borderRadius: 2, // This adds rounded corners (8px by default in Material-UI)
              border: "2px solid", //  adds a border
              borderColor: theme.palette.grey[700],
              boxShadow: 3,
              // For more custom shadow:
              // boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
              // [theme.breakpoints.down("sm")]: { maxHeight: 300 },
            }}
            src={postDetails?.video}
            alt="Post video"
            controls
          />
        )}

        {/* Card Actions */}
        <CardActions disableSpacing sx={{ px: 2 }}>
          {/* Like Button */}
          <Tooltip title={postDetails?.isLiked ? "Unlike" : "Like"} arrow>
            <IconButton
              aria-label={postDetails?.isLiked ? "Unlike post" : "Like post"}
              onClick={handlePostLike}
            >
              {postDetails?.isLiked ? (
                <ThumbUpIcon color="primary" />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {postDetails?.postLikesCount}
          </Typography>

          {/* Comment Button */}
          <Tooltip title="Comments" arrow>
            <IconButton
              aria-label="Toggle comments"
              onClick={() => setShowComments(!showComments)}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {postDetails?.commentsCount}
          </Typography>

          {/* Share Button */}
          <Tooltip title="Share" arrow>
            <IconButton aria-label="Share post" onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>

          {/* Save Button */}
          <Tooltip title={postDetails?.isSaved ? "Unsave" : "Save"} arrow>
            <IconButton
              aria-label={postDetails?.isSaved ? "Unsave post" : "Save post"}
              onClick={handleSavePost}
              sx={{ marginLeft: "auto" }}
            >
              {postDetails?.isSaved ? (
                <BookmarkIcon color="secondary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </Tooltip>
        </CardActions>

        {/* Comment Section */}
        {showComments && (
          <CardContent sx={{ pt: 0 }}>
            <Divider sx={{ mb: 2 }} />

            {/* Comment Form */}
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: "flex", gap: 1, mb: 2 }}
            >
              <Avatar
                src={auth.user?.image}
                sx={{ width: 32, height: 32, bgcolor: theme.palette.grey[800] }}
              >
                {userInitials}
              </Avatar>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Add a comment..."
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
                inputProps={{ "aria-label": "Comment input" }}
              />
              <Button
                type="submit"
                variant="text"
                color="primary"
                disabled={!formik.values.content.trim()}
                aria-label="Post comment"
              >
                Post
              </Button>
            </Box>

            {/* Comments List */}
            <List>
              {postDetails.comments?.length > 0 ? (
                postDetails.comments.map((comment) => {
                  const commenterName = `${comment.commentUserDetails?.firstName} ${comment.commentUserDetails?.lastName}`;
                  const commenterInitials = `${comment.commentUserDetails?.firstName?.charAt(
                    0
                  )}${comment.commentUserDetails?.lastName?.charAt(0)}`;

                  return (
                    <div key={comment.commentId}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            src={comment.commentUserDetails?.profilePic}
                            onClick={() =>
                              navigate(
                                `/profile/${comment.commentUserDetails.id}`
                              )
                            }
                          >
                            {commenterInitials}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={commenterName}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {comment.content}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 0.5,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  aria-label={
                                    comment.isLiked
                                      ? "Unlike comment"
                                      : "Like comment"
                                  }
                                  sx={{ mr: 0.5 }}
                                  onClick={() =>
                                    handleCommentLike(comment.commentId)
                                  }
                                >
                                  {comment.isLiked ? (
                                    <ThumbUpIcon
                                      fontSize="small"
                                      color="primary"
                                    />
                                  ) : (
                                    <ThumbUpOutlinedIcon fontSize="small" />
                                  )}
                                </IconButton>
                                <Typography variant="caption" sx={{ mr: 1 }}>
                                  {comment.commentLikes?.length || 0}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  •{" "}
                                  {format(
                                    parseISO(comment.createAt),
                                    "MMM dd, h:mm a"
                                  )}
                                </Typography>
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </div>
                  );
                })
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No comments yet
                </Typography>
              )}
            </List>
          </CardContent>
        )}
      </Card>

      {/* Edit Post Modal */}
      <EditPostModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        post={postDetails}
        user={auth?.user}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostCard;
