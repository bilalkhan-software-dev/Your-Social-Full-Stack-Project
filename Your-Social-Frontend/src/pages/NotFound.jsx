import { Button, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Box sx={{ mb: 4 }}>
        <SentimentVeryDissatisfiedIcon
          sx={{ fontSize: 80, color: "error.main" }}
        />
      </Box>

      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{ px: 4, py: 2 }}
      >
        Return Home
      </Button>
    </Container>
  );
};

export default NotFound;
