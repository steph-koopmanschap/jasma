import Link from "next/link";

export default function Comment(props) {
    const { commentData } = props;
    return (
        <div className="p-2 m-2 bg-gray-600">
            {/* <img 
                src={props.commentData.profilepic} 
                className="rounded-t-full"
                alt="Profile pic"
                width="32" 
                height="32"
            /> */}
            <Link className="font-bold" href={`/user/${commentData.username}`}>{commentData.username}</Link>

            <p className="">{commentData.comment_text}</p>
            {/* <img 
                src={props.commentData.fileContent} 
                className="object-scale-down"
                alt="Comment pic"
                width="999" 
                height="999"
            /> */}
            <p className="text-xs">{commentData.created_at}</p>
        </div>
    );
}
