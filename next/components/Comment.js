export default function Comment(props) {
    return (
        <div className="px-4 py-4">
            <img 
                src={props.commentData.profilepic} 
                className="rounded-t-full"
                alt="Profile pic"
                width="32" 
                height="32"
            />
            <p className="">{props.commentData.username}</p>
            <p className="">{props.commentData.textContent}</p>
            <img 
                src={props.commentData.fileContent} 
                className="object-scale-down"
                alt="Comment pic"
                width="999" 
                height="999"
            />
            <p className="">{props.commentData.createdAt}</p>
        </div>
    );
}
