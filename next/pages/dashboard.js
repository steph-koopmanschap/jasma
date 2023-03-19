import React, { useState, useEffect } from "react";
import CreatePost from "../components/CreatePost";
import HeaderMain from "../components/HeaderMain";
import UserBox from "../components/UserBox";
import NewsFeed from "../components/NewsFeed";
import GlobalNewsFeed from "../components/GlobalNewsFeed";
import { checkAuth } from "../session";

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

export default function Dashboard(props) {
    console.log("Dashboard props", props);

    const [userID, setuserID] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {
        setuserID(window.localStorage.getItem('loggedInUserID'));
        setIsLoggedIn(userID ? true : false);

    }, [isLoggedIn]);

    return (
        <div className="flex flex-col justify-center mx-auto">
            <HeaderMain />

            <UserBox />

            {isLoggedIn ? (
                <React.Fragment>
                <CreatePost /> 
                <NewsFeed />
                </React.Fragment>)
            : <GlobalNewsFeed />
            }
        </div>
    );
}
