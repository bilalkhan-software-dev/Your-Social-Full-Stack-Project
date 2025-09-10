import {
  Avatar,
  Card,
  Divider,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  IconButton,
} from "@mui/material";
import { navigationMenu } from "./SidebarNavigations";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../Redux/Auth/authAction";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const Sidebar = ({ isMobile, toggleSidebar, sidebarOpen }) => {
  const theme = useTheme();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (item) => {
    if (item.title === "Profile") {
      navigate(`/profile/${auth.user?.id}`);
    } else {
      navigate(item.path);
    }
    if (isMobile) toggleSidebar();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Card
      sx={{
        height: "100vh",
        display: "flex",
        width: sidebarOpen ? 240 : 56, // Show collapsed version on desktop
        flexDirection: "column",
        p: 2,
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: "hidden",
      }}
    >
      {/* Header with collapse button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pl: sidebarOpen ? 2 : 0.5,
          pr: 1,
        }}
      >
        {sidebarOpen && (
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Your Social
          </Typography>
        )}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            display: { xs: "flex", md: "none" }, // Show on mobile, hide on desktop
            p: 1,
            backgroundColor: theme.palette.action.hover,
            "&:hover": {
              backgroundColor: theme.palette.action.selected,
            },
          }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {navigationMenu.map((item, index) => (
            <Tooltip
              key={index}
              title={!sidebarOpen ? item.title : ""}
              placement="right"
              arrow
            >
              <ListItem
                button
                onClick={() => handleNavigation(item)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 2 : 0,
                    cursor: "pointer",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.title}
                    sx={{
                      cursor: "pointer",
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ px: sidebarOpen ? 2 : 0.5 }}>
        <Divider sx={{ my: 1 }} />
        <Tooltip
          title={
            !sidebarOpen ? `${auth.user?.firstName} ${auth.user?.lastName}` : ""
          }
          placement="right"
          arrow
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              justifyContent: sidebarOpen ? "space-between" : "center",
            }}
          >
            <Avatar
              src={auth.user?.image}
              alt="User profile"
              sx={{
                width: 40,
                height: 40,
                mr: sidebarOpen ? 2 : 0,
                bgcolor: theme.palette.grey[800],
              }}
            >
              {auth.user?.firstName.charAt(0)}
              {auth.user?.lastName.charAt(0)}
            </Avatar>
            {sidebarOpen && (
              <>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="medium"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%", // or a specific pixel value
                    }}
                  >
                    {auth.user?.firstName} {auth.user?.lastName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%", // or a specific pixel value
                    }}
                  >
                    @{auth.user?.firstName.toLowerCase()}_
                    {auth.user?.lastName.toLowerCase()}
                  </Typography>
                </Box>
                <IconButton onClick={handleLogout} size="small">
                  <LogoutRoundedIcon size="small" />
                </IconButton>
              </>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default Sidebar;
