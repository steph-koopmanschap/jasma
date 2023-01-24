import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreatePost from "../components/CreatePost";
import SearchBar from "../components/SearchBar";
import HeaderMain from "../components/HeaderMain";
import LogInOutBtn from "../components/LogInOutBtn";
import ProfilePic from "../components/ProfilePic";
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
    const queryClient = useQueryClient();
    const [userCredentials, setUserCredentials] = useState(queryClient.getQueryData("userCredentials")?.user);

    console.log("Dashboard props");
    console.log(props);

    // useEffect(() => {

    // }, [userCredentials]);

    return (
        <div className="flex flex-col justify-center mx-auto">
            <HeaderMain />
            <div className="flex flex-col items-end justify-end mr-4">
                <Link href={`/user/${userCredentials?.username}`}>
                    <ProfilePic
                        userid={userCredentials?.user_id}
                        width="100"
                        height="100"
                    />
                </Link>

                <LogInOutBtn initialState={props.isAuth} />
            </div>

            <SearchBar prevQuery="Search..." />

            <CreatePost />

            <NewsFeed />
        </div>
    );
}
