export const UserListItemShell = ({ followAction, profilePic, user }) => {
    return (
        <div>
            <div
                className="flex mx-auto w-1/5 p-2 m-2 bg-gray-600"
                key={user.user_id}
            >
                {profilePic ? profilePic : null}
                <Link
                    className="font-bold mr-4"
                    href={`/user/${user.username}`}
                >
                    {user.username}
                </Link>
                <div className="">{followAction ? followAction : null}</div>
            </div>
        </div>
    );
};
