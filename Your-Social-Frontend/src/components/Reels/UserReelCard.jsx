import React, { useState, useRef, useEffect } from "react";
import {
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Tooltip,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { useLocation, useNavigate } from "react-router";

const UserReelCard = ({ reel }) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    isPlaying: false,
    isMuted: true,
    isLoading: true,
    isFullscreen: false,
    showControls: false,
  });

  const { isPlaying, isMuted, isLoading, isFullscreen, showControls } = state;

  const isReel = location.pathname === "/reel";

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    updateState({ isPlaying: !isPlaying });
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    updateState({ isMuted: !isMuted });
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await videoRef.current.requestFullscreen();
      updateState({ isFullscreen: true });
    } else {
      await document.exitFullscreen();
      updateState({ isFullscreen: false });
    }
  };

  const handleVideoLoaded = () => updateState({ isLoading: false });
  const handleVideoError = () => updateState({ isLoading: false });
  const handleMouseEnter = () => updateState({ showControls: true });
  const handleMouseLeave = () => updateState({ showControls: false });
  const handleVideoClick = togglePlay;

  const formattedDate = reel?.createdAt
    ? format(parseISO(reel.createdAt), "MMM dd, yyyy")
    : "";

  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement) {
        videoElement.pause();
        if (document.fullscreenElement === videoElement) {
          document.exitFullscreen();
        }
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: theme.palette.common.black,
        "&:hover": { boxShadow: theme.shadows[4] },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`w-[15rem] h-[25rem] ${
        isReel ? "md:w-[35rem] md:h-[30rem] mt-4" : "w-[15rem] h-[25rem]"
      } `}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      )}

      <video
        ref={videoRef}
        onClick={handleVideoClick}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: "pointer",
        }}
        src={reel?.video || ""}
        loading="lazy"
        aria-label={`Reel: ${reel?.title || "Untitled"}`}
        loop
        muted={isMuted}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        onPlay={() => updateState({ isPlaying: true })}
        onPause={() => updateState({ isPlaying: false })}
      />

      {/* Top overlay with title */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          p: 1.5,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "common.white",
            fontWeight: 600,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {reel?.title || "Untitled Reel"}
        </Typography>
        <Typography variant="caption" sx={{ color: "grey.300" }}>
          {formattedDate}
        </Typography>
      </Box>

      {/* Bottom left user info */}
      <Box
        sx={{
          position: "absolute",
          left: 8,
          bottom: 80,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Tooltip title='Go to profile' placement="bottom" arrow>
          <Avatar
            src={reel?.userInfo?.image || ""}
            alt={reel?.userInfo?.fullName}
            sx={{ width: 32, height: 32 }}
            onClick={() => navigate(`/profile/${reel?.userInfo?.authorId}`)}
          >
            {reel?.userInfo?.fullName?.charAt(0).toUpperCase()}
          </Avatar>
        </Tooltip>
        <Typography
          variant="subtitle2"
          sx={{
            color: "common.white",
            fontWeight: 600,
            textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {reel?.userInfo?.fullName}
        </Typography>
      </Box>

      {/* Bottom center video controls */}
      {(showControls || isFullscreen) && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            p: 1,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          <ControlButton
            onClick={togglePlay}
            label={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          />

          <ControlButton
            onClick={toggleMute}
            label={isMuted ? "Unmute" : "Mute"}
            icon={isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          />

          <ControlButton
            onClick={toggleFullscreen}
            label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            icon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          />
        </Box>
      )}
    </Box>
  );
};

const ControlButton = ({ onClick, label, icon }) => {
  const theme = useTheme();
  return (
    <Tooltip title={label}>
      <IconButton
        onClick={onClick}
        aria-label={label}
        sx={{
          color: "common.white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default UserReelCard;
