export const UserAdminItem = ({ user, adminAction }) => {
    return (
        <div
            className="mb-2"
            key={user.user_id}
        >
            <p className="mb-2">
                Username:
                <Link
                    className="font-bold"
                    href={`/user/${user.username}`}
                >
                    {user.username}
                </Link>
            </p>
            {adminAction ? adminAction : null}
        </div>
    );
};
