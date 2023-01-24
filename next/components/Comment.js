import Link from "next/link";
import { formatDistance } from 'date-fns';
import ProfilePic from "./ProfilePic";

export default function Comment(props) {
    const { commentData } = props;
    return (
        <div className="p-2 m-2 bg-gray-800">
            <ProfilePic userID={commentData.user_id} width={32} height={32} />
            <Link className="font-bold" href={`/user/${commentData.username}`}>{commentData.username}</Link>

            <p className="mb-2">{commentData.comment_text}</p>
            {/* <img 
                src={props.commentData.fileContent} 
                className="object-scale-down"
                alt="Comment pic"
                width="999" 
                height="999"
            /> */}
            <p className="text-xs">{commentData.created_at}</p>
            <p className="text-xs">{formatDistance(new Date(commentData.created_at), new Date())} a go.</p>
        </div>
    );
}
