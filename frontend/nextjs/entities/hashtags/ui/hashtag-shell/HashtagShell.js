export const HashtagShell = ({ unSubAction, hashtag }) => {
    return (
        <div
            className="flex mr-2"
            id={`subbed_${hashtag.hashtag}`}
        >
            <p className="mr-2">{hashtag.hashtag}</p>
            {unSubAction ? unSubAction : null}
        </div>
    );
};
