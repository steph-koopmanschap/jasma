import { CreatePost } from "@/features/post";
import SubscribeHashtags from "@/widgets/hashtags";
import NewsFeed from "@/widgets/news-feed";
import UserWidgets from "@/widgets/user";
import React, { useEffect, useState } from "react";

export default function Dashboard(props) {
    console.log("Dashboard props", props);

    const [userID, setuserID] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {
        setuserID(window.localStorage.getItem("loggedInUserID"));
        setIsLoggedIn(userID ? true : false);
    }, [isLoggedIn]);

    return (
        <div className="flex flex-col justify-center mx-auto">
            <UserWidgets.UserBox />

            {isLoggedIn ? (
                <React.Fragment>
                    <CreatePost />
                    <SubscribeHashtags />
                    <NewsFeed />
                </React.Fragment>
            ) : (
                <NewsFeed isGlobal={true} />
            )}
        </div>
    );
}

//import { checkAuth } from "../session";

// export async function getServerSideProps({ req, res }) {
//     const isAuth = await checkAuth(req);
//     console.log("hi from dashboard page");
//     if (!isAuth) {
//         console.log("Not logged in!");
//         return {
//             redirect: {
//                 destination: "/login",
//                 permanent: false
//             }
//         };
//     }
//     return { props: { isAuth } };
// }
