import { LoadError, SectionHeading, StreamCard } from "@/entities/stream";
import "./List.css";
import UserWidgets from "@/widgets/user";
import { useRouter } from "next/router";
import { handleGetLiveStreams } from "@/features/stream";
import { Spinner } from "@/shared/ui";
import Virtualized from "@/shared/ui/wrappers/Virtualized";
import { useInfiniteScroll } from "@/shared/model/hooks/useInfiniteScroll";

const DUMMY_DATA = [
    {
        user_id: 1,
        username: "John Doe",
        title: "Random Stream",
        thumbnail: "https://imgv3.fotor.com/images/blog-richtext-image/take-a-picture-with-camera.png",
        stream_key: "test",
        viewers: 2141215
    },
    {
        user_id: 2,
        username: "John Doe",
        title: "Random Stream5",
        thumbnail: "https://lifetouch.com/wp-content/uploads/2018/06/Underclass_girlwithbluebg.jpg",
        stream_key: "test",
        viewers: 144
    },
    {
        user_id: 3,
        username: "John Doe",
        title: "Random Stream2",
        thumbnail: "https://ichef.bbci.co.uk/news/640/cpsprodpb/15951/production/_117310488_16.jpg",
        stream_key: "test",
        viewers: 234124
    },
    {
        user_id: 4,
        username: "John Doe",
        title: "Random Stream6",
        thumbnail: "https://www.pexels.com/photo/45853/download/",
        stream_key: "test",
        viewers: 32525
    },
    {
        user_id: 5,
        username: "John Doe",
        title: "Random Stream6",
        thumbnail: "https://www.pexels.com/photo/45853/download/",
        stream_key: "test",
        viewers: 32525
    },
    {
        user_id: 6,
        username: "John Doe",
        title: "Random Stream6",
        thumbnail: "https://www.pexels.com/photo/45853/download/",
        stream_key: "test",
        viewers: 32525
    },
    {
        user_id: 10,
        username: "John Doe",
        title: "Random Stream6",
        thumbnail: "https://www.pexels.com/photo/45853/download/",
        stream_key: "test",
        viewers: 32525
    }
];

export const LiveList = () => {
    const router = useRouter();

    const { isError, data, isLoading, error } = handleGetLiveStreams();
    const { lastElRef } = useInfiniteScroll({
        onRequestNext: (page) => {
            console.log(page);
        },
        isLoading,
        startPage: 1
    });

    const DATA = data ? data : DUMMY_DATA;

    const handleClick = (stream_key) => {
        router.push(`/live/stream/${stream_key}`);
    };

    return (
        <div className="live-list-container">
            <SectionHeading>Live Now</SectionHeading>
            <div className="list-layout">
                {isError ? (
                    <LoadError>{error}</LoadError>
                ) : (
                    <div className="live-list-wrapper">
                        {DATA?.map((item, ind) => (
                            <Virtualized
                                key={item.user_id}
                                itemId={item.stream_key}
                                isLast={ind + 1 === DATA.length}
                                ref={lastElRef}
                            >
                                <StreamCard
                                    key={item.user_id}
                                    userPic={
                                        <UserWidgets.ProfilePic
                                            userID={item.user_id}
                                            width={50}
                                            height={50}
                                        />
                                    }
                                    onClick={() => handleClick(item.stream_key)}
                                    {...item}
                                />
                            </Virtualized>
                        ))}
                    </div>
                )}
                {isLoading ? (
                    <div className="relative w-full h-12">
                        <Spinner />
                    </div>
                ) : null}
                {!DATA?.length && !isLoading ? <LoadError>{"No live streams found"}</LoadError> : null}
            </div>
        </div>
    );
};
