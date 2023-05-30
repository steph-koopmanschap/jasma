import { ToggleFollowBtn, useGetUserID } from "@/features/user";
import { ProfilePic } from "../profile-picture/ProfilePic";
import { Modal } from "@/shared/ui";
import FollowList from "@/widgets/follow-list";
import UserLists from "@/widgets/user-list";

export const Profile = ({ username }) => {
    const [loggedInUserID, setLoggedInUserID] = useState(null);
    const [followerModalState, setFollowerModalState] = useState(false);
    const openFollowerModal = () => {
        setFollowerModalState(true);
    };
    const closeFollowerModal = () => {
        setFollowerModalState(false);
    };

    useEffect(() => {
        setLoggedInUserID(window.localStorage.getItem("loggedInUserID"));
    }, []);

    const { status, isLoading, isError, data, error, refetch } = useGetUserID(username);

    if (data) {
        console.log("data from ProfilePage", data);
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <ProfilePic
                    userID={data?.success ? data.user_id : ""}
                    width={100}
                    height={100}
                />
                <h1 className="font-bold">{username}</h1>
                <Link
                    className="hover:text-sky-500"
                    href={`/user/${username}/bio`}
                >
                    About
                </Link>

                {loggedInUserID ? (
                    data?.user_id !== loggedInUserID ? (
                        <ToggleFollowBtn
                            userID_two={data?.user_id}
                            username={username}
                        />
                    ) : null
                ) : null}

                <button
                    className="formButtonDefault m-2"
                    onClick={openFollowerModal}
                >
                    See followers
                </button>
                <Modal
                    modalName="followerModal"
                    isOpen={followerModalState}
                    onClose={closeFollowerModal}
                >
                    <FollowList.FollowersList userID={data ? data?.user_id : ""} />
                    <FollowList.FolloweesList userID={data ? data?.user_id : ""} />
                </Modal>
            </div>

            <section className="flex flex-col">
                {loggedInUserID && window.localStorage.getItem("loggedInUsername") === username ? <CreatePost /> : null}
                {data?.success ? (
                    <UserLists.UserPostList userID={data?.user_id} />
                ) : (
                    <p className="text-center">Could not retrieve posts.</p>
                )}
            </section>
        </>
    );
};
