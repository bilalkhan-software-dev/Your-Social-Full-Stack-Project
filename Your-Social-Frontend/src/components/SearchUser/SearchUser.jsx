import { Avatar, Card, CardHeader } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchedUserAction } from "../../Redux/Auth/authAction";
import { createChatAction } from "../../Redux/Message/messageAction";
import { debounce } from "lodash";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim()) {
        dispatch(searchedUserAction(searchTerm));
      }
      setIsSearching(false);
    }, 500),
    [dispatch]
  );

  const handleSearchUser = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (value.trim()) {
      setIsSearching(true);
      debouncedSearch(value);
    } else {
      // Clear results if search is empty
      debouncedSearch.cancel();
      setIsSearching(false);
    }
  };

  const handleUserClick = (id, user) => {
    dispatch(
      createChatAction({
        createdChatWithId: id,
        chatName: `${user.firstName} ${user.lastName}`,
        chatImage: user.image,
      })
    );
    setUsername("");
    debouncedSearch.cancel();
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="w-full relative">
      <div className="py-2 relative">
        <input
          type="text"
          value={username}
          className="bg-gray-100 text-gray-950/100 border border-gray-300 outline-none w-full px-5 py-2 rounded-full"
          placeholder="Search or start a new chat"
          onChange={handleSearchUser}
        />
      </div>

      {username && (
        <Card className="absolute w-full z-10 top-16 shadow-lg max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="text-md text-center font-medium p-4">
              Searching...
            </div>
          ) : auth.searchedUser?.length > 0 ? (
            auth.searchedUser.map((user) => (
              <CardHeader
                key={user.id}
                onClick={() => handleUserClick(user.id, user)}
                avatar={<Avatar src={user.image} />}
                title={`${user.firstName} ${user.lastName}`}
                subheader={`@${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`}
                className="hover:bg-gray-600 cursor-pointer"
              />
            ))
          ) : (
            <div className="text-md text-center font-medium p-4">
              {username.trim() ? "No user found" : "Type to search users"}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchUser;
