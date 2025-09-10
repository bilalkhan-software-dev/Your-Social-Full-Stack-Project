import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Typography,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { useDispatch, useSelector } from "react-redux";
import { searchedUserAction } from "../../Redux/Auth/authAction";
import { useNavigate } from "react-router";

const HomeRight = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Sample suggestions data
  const [suggestions] = useState([
    { id: 1, name: "Bilal Khan", username: "bilalkhan", avatar: "" },
    { id: 2, name: "Ubaid Khan", username: "ubaidkhan", avatar: "" },
    { id: 3, name: "BK_QA Coders", username: "bk_qa", avatar: "" },
  ]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setLoading(true);
        dispatch(searchedUserAction(searchQuery)).finally(() =>
          setLoading(false)
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handleChangeTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    // You might want to trigger a global theme change here
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box
      sx={{
        py: 2,
        width: "20rem",
        position: "sticky",
        top: 0,
        [theme.breakpoints.down("md")]: {
          display: "none", // Hide on mobile if needed
        },
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search user..."
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "50px",
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
        {/* <IconButton
          onClick={handleChangeTheme}
          color="primary"
          sx={{
            ml: 1,
            backgroundColor: theme.palette.action.hover,
            "&:hover": {
              backgroundColor: theme.palette.action.selected,
            },
          }}
        >
          {darkMode ? <WbSunnyIcon /> : <Brightness3Icon />}
        </IconButton> */}
      </Box>

      {/* Search Results */}
      {searchQuery && auth.searchedUser && (
        <Card
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Search Results
          </Typography>
          {auth.searchedUser?.length > 0 ? (
            <Box sx={{ display: "grid", gap: 2 }}>
              {auth?.searchedUser?.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={user?.image}
                      alt={user?.firstName}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user?.firstName.charAt(0).toUpperCase() +
                        user?.lastName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {user?.firstName + " " + user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @
                        {user?.firstName.toLowerCase() +
                          "_" +
                          user?.lastName.toLowerCase()}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                      px: 2,
                    }}
                    onClick={() => navigate(`/profile/${user?.id}`)}
                  >
                    View
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No users found
            </Typography>
          )}
        </Card>
      )}

      {/* Suggestions Card */}
      <Card
        sx={{
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="text.secondary"
          >
            Suggestions For You
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            View All
          </Button>
        </Box>

        {/* Suggestions List */}
        <Box sx={{ display: "grid", gap: 2 }}>
          {suggestions.map((user) => (
            <Box
              key={user.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user.username}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  px: 2,
                }}
              >
                Follow
              </Button>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default HomeRight;
