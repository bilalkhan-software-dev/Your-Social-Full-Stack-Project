import React from 'react'
import { Avatar } from "@mui/material";

const StoryCircle = () => {
  return (
    <div>
        <div className="flex flex-col items-center mr-4 cursor-pointer">
        <Avatar
        src='https://img.freepik.com/free-photo/portrait-boy-with-backpack_23-2151835181.jpg?ga=GA1.1.GA1.1.620845134.1742264155&semt=ais_hybrid&w=740'
          sx={{
            width: "4rem",
            height: "4rem",
          }}
        >
        </Avatar>
        <p>Bilal Khan</p>
      </div>
    </div>
  )
}

export default StoryCircle