import { useState, useEffect } from "react";
import CreatePost from "../components/CreatePost";
import SearchBar from "../components/SearchBar";
import HeaderMain from "../components/HeaderMain";
import UserBox from "../components/UserBox";
import NewsFeed from "../components/NewsFeed";
import { checkAuth } from "../session";

export async function getServerSideProps({ req, res }) {
    const isAuth = await checkAuth(req);
    console.log("hi from dashboard page");
    // if (!isAuth) {
    //     console.log("Not logged in!");
    //     return {
    //         redirect: {
    //             destination: "/login",
    //             permanent: false
    //         }
    //     };
    // }
    return { props: { isAuth } };
}

export default function Dashboard(props) {
    console.log("Dashboard props");
    console.log(props);

    let userID = null;
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        userID = window.sessionStorage.getItem('loggedInUserID');
        setIsLoggedIn(userID ? true : false);
    }, [isLoggedIn]);

    return (
        <div className="flex flex-col justify-center mx-auto">
            <HeaderMain />

            <UserBox />

            <SearchBar prevQuery="Search..." />
            {isLoggedIn ? <CreatePost /> : null}
            
            <NewsFeed />
        </div>
    );
}
