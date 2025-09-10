import { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Avatar,
  Button,
  Card,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import PostCard from "../Post/PostCard";
import UserReelCard from "../Reels/UserReelCard";
import EditProfileModal from "./EditProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { grey } from "@mui/material/colors";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate, useParams } from "react-router-dom";
import {
  getFindUserByIdAction,
  getFollowUserAction,
} from "../../Redux/Auth/authAction";
import {
  getAllUserPostAction,
  getUserSavedPostAction,
} from "../../Redux/Post/postAction";
import {
  getAllReelAction,
  getAllUserReelAction,
} from "../../Redux/Reel/reelAction";

const Profile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { post, auth, reel } = useSelector((store) => store);
  const navigate = useNavigate();
  const { id } = useParams();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { value: "post", label: "Post" },
    { value: "reels", label: "Reels" },
    { value: "saved", label: "Saved" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        await dispatch(getFindUserByIdAction(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, dispatch]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (auth.user?.id) {
          await Promise.all([
            dispatch(getUserSavedPostAction()),
            dispatch(getAllUserPostAction()),
            dispatch(getAllUserReelAction()),
          ]);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPostData();
  }, [post.newComment, auth.user?.id, dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => navigate(-1);

  const handleFollowUser = async () => {
    try {
      await dispatch(getFollowUserAction(auth.findUser?.id));
      setSnackbar({
        open: true,
        message: auth.findUser?.isFollowed
          ? `Successfully unfollowed ${auth.findUser?.firstName}`
          : `Successfully followed ${auth.findUser?.firstName}`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to follow/unfollow user",
        severity: "error",
      });
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading || auth.loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography color="error">Error: {error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Box>
    );
  }

  const user = auth.findUser;
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;
  const username = user
    ? `${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}`
    : "";
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        mx: "auto",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          backdropFilter: "blur(10px)",
        }}
      >
        <Tooltip title="Back to home" arrow>
          <Button
            startIcon={<KeyboardBackspaceRoundedIcon />}
            onClick={handleBack}
            aria-label="Go back"
            sx={{ color: theme.palette.text.primary }}
          >
            Back
          </Button>
        </Tooltip>
      </Box>

      {/* Profile Card */}
      <Card
        sx={{
          mt: 2,
          width: "80%",
          mx: "auto",
          [theme.breakpoints.down("md")]: {
            width: "90%",
          },
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            height: 200,
            backgroundColor: grey[200],
            position: "relative",
            overflow: "hidden",
          }}
        >
          {user?.banner && (
            <Box
              component="img"
              src={user.banner}
              alt={`${fullName}'s banner`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </Box>

        {/* Profile Header */}
        <Box
          sx={{
            px: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <Avatar
            src={user?.image}
            sx={{
              width: 150,
              height: 150,
              position: "absolute",
              top: -75,
              border: `4px solid ${theme.palette.background.paper}`,
              backgroundColor: grey[800],
              fontSize: "3rem",
              boxShadow: theme.shadows[4],
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ mt: 2, ml: "auto" }}>
            {auth.user?.id === user?.id ? (
              <Button
                onClick={handleOpenModal}
                variant="outlined"
                sx={{ borderRadius: "20px" }}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleFollowUser}
                sx={{ borderRadius: "20px" }}
              >
                {user?.isFollowed ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Box>
        </Box>

        {/* Profile Info */}
        <Box sx={{ p: 5, pt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {fullName}
          </Typography>
          <Typography color="text.secondary">@{username}</Typography>

          <Box sx={{ display: "flex", gap: 3, my: 2 }}>
            {auth.user.id === user?.id && (
              <Typography>
                <strong>{post.userPosts?.length || 0}</strong> Posts
              </Typography>
            )}
            <Typography>
              <strong>{user?.followers?.length || 0}</strong> Followers
            </Typography>
            <Typography>
              <strong>{user?.following?.length || 0}</strong> Following
            </Typography>
          </Box>

          <Typography paragraph sx={{ mb: 3 }}>
            {user?.bio || "No bio yet"}
          </Typography>
          <div className="dark:border dark:border-b-gray-50"></div>

          {/* Tabs */}
          {auth.user?.id === user?.id && (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>
            </Box>
          )}

          {/* Tab Content */}
          {auth.user?.id === user?.id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 3,
              }}
            >
              {activeTab === "post" && (
                <Box
                  sx={{
                    width: "70%",
                    [theme.breakpoints.down("md")]: { width: "100%" },
                  }}
                >
                  {post.userPosts?.length > 0 ? (
                    post.userPosts.map((post) => (
                      <Box key={post.id} sx={{ mb: 3 }}>
                        <PostCard postDetails={post} />
                      </Box>
                    ))
                  ) : (
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        color: theme.palette.text.primary,
                      }}
                    >
                      No posts yet
                    </Typography>
                  )}
                </Box>
              )}

              {activeTab === "reels" && (
                <Box
                  sx={{
                    width: "70%",
                    display: "grid",
                    gap: 2,
                    [theme.breakpoints.down("md")]: { width: "100%" },
                  }}
                >
                  {reel?.userReels?.length > 0 ? (
                    reel?.userReels?.map((reel) => (
                      <UserReelCard key={reel._id} reel={reel} />
                    ))
                  ) : (
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        color: theme.palette.text.primary,
                      }}
                    >
                      No reels yet
                    </Typography>
                  )}
                </Box>
              )}

              {activeTab === "saved" && (
                <Box
                  sx={{
                    width: "70%",
                    [theme.breakpoints.down("md")]: { width: "100%" },
                  }}
                >
                  {post.savedPosts?.length > 0 ? (
                    post.savedPosts.map((post) => (
                      <Box key={post.id} sx={{ mb: 3 }}>
                        <PostCard postDetails={post} />
                      </Box>
                    ))
                  ) : (
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        color: theme.palette.text.primary,
                      }}
                    >
                      No saved posts yet
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>

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

        {/* Edit Profile Modal */}
        <EditProfileModal
          open={openModal}
          handleClose={handleCloseModal}
          user={user}
        />
      </Card>
    </Box>
  );
};

export default Profile;
