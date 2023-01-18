import Link from "next/link";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";

export default function Post(props) {
    const { postData } = props;
    return (
        <div>
            <div className="p-2 m-2 bg-gray-600">
                {/* <img 
                    src={props.profilepic} 
                    className="rounded-t-full"
                    alt="Profile pic"
                    width="40" 
                    height="40"
                /> */}
                <Link className="font-bold" href={`/user/${postData.username}`}>{postData.username}</Link>
                <p className="text-xs mb-2">{postData.created_at}</p>
                <p className="">{postData.text_content}</p>
                {/* <p className="">{postData.hashtags}</p> */}
                {/* <img 
                    src={postData.file_url} 
                    className="object-scale-down"
                    alt="Post picture"
                    width="999" 
                    height="999"
                /> */}
        </div>

        <div className="p-2">
            <CreateComment />
        </div>
            
        {/* 
        <div>
            <CommentList /> 
        </div>
        */}
        </div>
    );
}
