import { Avatar, Card, IconButton, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../Post/CreatePostModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../Redux/Post/postAction";

const MiddlePart = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { post, auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllPostAction());
  }, [post.newComment]); // adding this dependency if user add comment then fetch all post again

  useEffect(() => {
    dispatch(getAllPostAction());
  }, [post.commentLikeMessage]);

  const handleOpenPostCreateModel = () => {
    setOpen(true);
  };

  const handleClosePostCreateModal = () => {
    setOpen(false);
  };

  return (
    // <div className="px-20">
    <div className="space-y-5">
      <section className="hidden md:block">
        <h1 className="py-2 text-xl font-bold opacity-90 text-gray-100">
          Home
        </h1>
      </section>

      {/* Create post */}
      <Card className="p-5 mt-5 ">
        <div className="flex justify-between">
          <Avatar src={auth.user?.image} />
          <input
            readOnly
            className="outline-none w-[90%] cursor-pointer rounded-full px-5 bg-transparent border border-gray-700 shadow-2xl/95 "
            type="text"
            placeholder="Click to create a post ..."
            onClick={handleOpenPostCreateModel}
          />
        </div>
        <div className="flex justify-center space-x-9 mt-3">
          <div className="flex items-center">
            <IconButton color="primary" onClick={handleOpenPostCreateModel}>
              <ImageIcon />
            </IconButton>
            <span onClick={handleOpenPostCreateModel}>media</span>
          </div>
          <div className="flex items-center">
            <IconButton color="primary" onClick={handleOpenPostCreateModel}>
              <VideocamIcon />
            </IconButton>
            <span onClick={handleOpenPostCreateModel}>video</span>
          </div>
          <div className="flex items-center">
            <IconButton color="primary" onClick={handleOpenPostCreateModel}>
              <ArticleIcon />
            </IconButton>
            <span onClick={handleOpenPostCreateModel}>Write Article</span>
          </div>
        </div>
      </Card>
      {/* Post */}
      <div className="mt-4 space-y-5">
        {post.allPosts.map((item, index) => (
          <PostCard key={index} postDetails={item} />
        ))}
      </div>
      <CreatePostModal
        open={open}
        handleClose={handleClosePostCreateModal}
        user={auth.user}
      />
    </div>
  );
};

export default MiddlePart;
