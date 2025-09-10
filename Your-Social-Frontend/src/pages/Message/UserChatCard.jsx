import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHorizRounded";
import { useState } from "react";
import { useSelector } from "react-redux";

const UserChatCard = ({ chat }) => {
  const { auth } = useSelector((store) => store);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (action) => {
    console.log(`You clicked: ${action}`);
    handleMenuClose();
  };

  return (
    <div className="mb-2 flex items-center p-3 hover:bg-gray-500 hover:text-gray-950 rounded-lg cursor-pointer">
      {/* User avatar */}
      <Avatar
        className="mr-3"
        src={
          auth.user?.id === chat.users[0].userId
            ? chat.users[1].image
            : chat.users[0].image || ""
        }
        sx={{
          width: "3.5rem",
          height: "3.5rem",
        }}
      >
        {auth.user?.id === chat.users[0].userId
          ? chat.users[1].fullName.charAt(0).toUpperCase()
          : chat.users[0].fullName.charAt(0).toUpperCase() || "Unknwon user"}
      </Avatar>
      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">
            {auth.user?.id === chat.users[0].userId
              ? chat.users[1].fullName
              : chat.users[0].fullName || "Unknwon user"}
          </h3>
        </div>
      </div>
      {/* <IconButton onClick={handleMenuOpen} size="small">
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("delete")}>
          Delete Chat
        </MenuItem>
      </Menu> */}
    </div>
  );
};

export default UserChatCard;
