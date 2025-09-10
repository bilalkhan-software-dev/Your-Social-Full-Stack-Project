import {
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
  Typography,
} from "@mui/material";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import MiddlePart from "../../components/Middle/MiddlePart";
import Reels from "../../components/Reels/Reels";
import CreateReelsForm from "../../components/Reels/CreateReelsForm";
import Profile from "../../components/Profile/Profile";
import HomeRight from "../../components/HomeRight/HomeRight";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Open by default on desktop

  // Auto-close sidebar when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen">
      <Grid container spacing={0}>
        {/* Sidebar */}
        <Grid
          item
          xs={false}
          sm={false}
          md={sidebarOpen ? 3 : 0}
          lg={sidebarOpen ? 3 : 0}
          sx={{
            display: {
              xs: sidebarOpen ? "block" : "none",
              sm: sidebarOpen ? "block" : "none",
              md: "block",
            },
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 1200,
            height: "100vh",
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Sidebar
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        </Grid>

        {/* Main Content Area */}
        <Grid
          item
          xs={12}
          sm={12}
          lg={
            location.pathname === "/"
              ? sidebarOpen
                ? 6
                : 9
              : sidebarOpen
              ? 9
              : 12
          }
        >
          {/* Mobile Header */}
          {isMobile && (
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                width: "100%",
                padding: "1rem",
                backgroundColor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2 }}>
                {location.pathname === "/" && "Home"}
                {location.pathname === "/reel" && "Reels"}
                {location.pathname.includes("/profile") && "Profile"}
              </Typography>
            </div>
          )}

          <div
            className={`justify-center items-center mx-auto${
              location.pathname === "/" ? "px-2 md:px-5" : " md:ml-40 px-5"
            } flex justify-center`}
          >
            <Routes>
              <Route path="/" element={<MiddlePart />} />
              <Route path="/reel" element={<Reels />} />
              <Route path="/create-reels" element={<CreateReelsForm />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </div>
        </Grid>

        {/* Right Sidebar - Only on Home page */}
        {location.pathname === "/" && !isMobile && (
          <Grid item md={sidebarOpen ? 3 : 0} lg={sidebarOpen ? 3 : 0}>
            <div className="sticky top-0 h-screen overflow-y-auto hide-scrollbar pr-2">
              <HomeRight />
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default HomePage;
