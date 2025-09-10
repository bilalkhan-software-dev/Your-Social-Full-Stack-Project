import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import GroupsSharpIcon from '@mui/icons-material/GroupsSharp';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreSharpIcon from '@mui/icons-material/ExploreSharp';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import NotificationsActiveSharpIcon from '@mui/icons-material/NotificationsActiveSharp';
import MessageSharpIcon from '@mui/icons-material/MessageSharp';
import FormatListBulletedSharpIcon from '@mui/icons-material/FormatListBulletedSharp';
export const navigationMenu=[
    {
        title: "Home",
        icon : <HomeRoundedIcon /> ,
        path: "/"
    } ,{
        title: "Reels",
        icon : <ExploreSharpIcon/> ,
        path: "/reel"
    } ,{
        title: "Create Reels",
        icon : <AddCircleOutlineSharpIcon/>,
        path: "/create-reels"
    } ,{
        title: "Notification",
        icon : <NotificationsActiveSharpIcon/>,
        path: "/notificatons"
    } ,{
        title: "Message",
        icon :<MessageSharpIcon/>,
        path: "/message"
    } ,{
        title: "Lists",
        icon :<FormatListBulletedSharpIcon/>,
        path: "/lists"
    } ,{
        title: "Communities",
        icon : <GroupsSharpIcon/>,
        path: "/communities"
    } ,{
        title: "Profile",
        icon : <AccountCircleSharpIcon/>,
        path: "/profile"
    }
]