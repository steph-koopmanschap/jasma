import CreateComment from "./CreateComment";
import CommentList from "./CommentLost";

export default function Post(props) {
    return (
        <div className="px-4 py-4">
            <img 
                src={props.postData.profilepic} 
                className="rounded-t-full"
                alt="Profile pic"
                width="40" 
                height="40"
            />
            <p className="">{props.postData.username}</p>
            <p className="">{props.postData.createdAt}</p>
            <p className="">{props.postData.textContent}</p>
            <p className="">{props.postData.hashtags}</p>
            <img 
                src={props.postData.fileContent} 
                className="object-scale-down"
                alt="Post picture"
                width="999" 
                height="999"
            />

            {/* 
            {CreateComment}
            {CommentList} 
            */}
        </div>
    );
}
