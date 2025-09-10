import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReelAction } from "../../Redux/Reel/reelAction";
import UserReelCard from "./UserReelCard";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const Reels = () => {
  const dispatch = useDispatch();
  const { reel } = useSelector((store) => store);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isScrolling, setIsScrolling] = useState(false);

  // Fetch reels data
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        await dispatch(getAllReelAction());
      } catch (err) {
        setError(err.message || "Failed to load reels");
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, [dispatch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling) return;

      if (e.key === "ArrowDown") {
        handleNext();
      } else if (e.key === "ArrowUp") {
        handlePrevious();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reel?.allReels?.length, isScrolling]);

  // Handle scroll events for snap behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = container.scrollTop;
      const reelHeight = container.children[0]?.clientHeight || 0;
      const newIndex = Math.round(scrollPosition / reelHeight);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, isScrolling]);

  // Touch/swipe handling
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (deltaY > 50) {
      // Swipe up
      handleNext();
    } else if (deltaY < -50) {
      // Swipe down
      handlePrevious();
    }
  };

  // Navigation functions with smooth scrolling
  const handleNext = () => {
    if (currentIndex < (reel?.allReels?.length || 0) - 1 && !isScrolling) {
      setIsScrolling(true);
      setCurrentIndex(currentIndex + 1);
      scrollToIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isScrolling) {
      setIsScrolling(true);
      setCurrentIndex(currentIndex - 1);
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      const reelElement = containerRef.current.children[index];
      if (reelElement) {
        reelElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });

        // Reset scrolling flag after animation completes
        setTimeout(() => {
          setIsScrolling(false);
        }, 500); // Matches CSS transition duration
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  // Empty state
  if (!reel?.allReels?.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          No reels found
        </Typography>
        <Typography color="text.secondary">
          Be the first to create a reel!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        marginY: 5,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows - Right Side */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {currentIndex > 0 && (
            <IconButton
              onClick={handlePrevious}
              disabled={isScrolling}
              sx={{
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                "&:disabled": { opacity: 0.5 },
                transition: "opacity 0.3s ease",
              }}
            >
              <KeyboardArrowUp fontSize="large" />
            </IconButton>
          )}
          {currentIndex < reel.allReels.length - 1 && (
            <IconButton
              onClick={handleNext}
              disabled={isScrolling}
              sx={{
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                "&:disabled": { opacity: 0.5 },
                transition: "opacity 0.3s ease",
              }}
            >
              <KeyboardArrowDown fontSize="large" />
            </IconButton>
          )}
        </Box>
      )}

      {/* Mobile Navigation Indicators */}
      {isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: 1,
          }}
        >
          {reel.allReels.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor:
                  index === currentIndex ? "white" : "rgba(255,255,255,0.5)",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </Box>
      )}

      {/* Reels Container */}
      <Box
        ref={containerRef}
        sx={{
          height: "100vh",
          scrollSnapType: "y mandatory",
          overflowY: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          "& > *": {
            scrollSnapAlign: "start",
            height: "100vh",
            transition: "transform 0.5s ease, opacity 0.5s ease",
          },
        }}
      >
        {reel.allReels.map((reelItem, index) => (
          <Box
            key={reelItem._id}
            sx={{
              position: "relative",
              transform: index === currentIndex ? "scale(1)" : "scale(0.98)",
              opacity: index === currentIndex ? 1 : 0.8,
            }}
          >
            <UserReelCard
              reel={reelItem}
              isActive={index === currentIndex}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isMobile={isMobile}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Reels;
