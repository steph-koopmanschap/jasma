import Link from "next/link";
import ProfilePic from "./ProfilePic";

export default function UsersList(props) {
    const { users } = props;

    return ( 
        <div>
            {users.map((user) => (
            <div 
                className="flex mx-auto w-1/5 p-2 m-2 bg-gray-600" 
                key={user.user_id}
            >
                <ProfilePic userID={user.user_id} width={40} height={40} />
                <Link className="font-bold" href={`/user/${user.username}`}>{user.username}</Link>
            </div>
        ))}
    </div>
    );
}
