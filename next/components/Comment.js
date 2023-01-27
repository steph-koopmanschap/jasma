import Link from "next/link";
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import ProfilePic from "./ProfilePic";

export default function Comment(props) {
    const { commentData } = props;
    return (
        <div className="p-2 m-2 bg-gray-800">
            <ProfilePic userID={commentData.user_id} width={32} height={32} />
            <Link className="font-bold" href={`/user/${commentData.username}`}>{commentData.username}</Link>

            <p className="mb-2">{commentData.comment_text}</p>
            {commentData.file_url ? 
                <Image
                    src={commentData.file_url} 
                    className="object-scale-down mb-1"
                    alt="Comment picture"
                    width="999" 
                    height="999"
                />
                : null}
            <p className="text-xs">{commentData.created_at}</p>
            <p className="text-xs">{formatDistance(new Date(commentData.created_at), new Date())} a go.</p>
        </div>
    );
}
