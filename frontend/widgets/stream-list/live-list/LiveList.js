import { SectionHeading } from "@/entities/stream";
import { handleGetLiveStreams } from "@/features/stream";
import { VirtualizedCatalog } from "../catalog/VirtualizedCatalog";

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
        title: "Random Stream6 Random Stream6 Random Stream6 Random Stream6 Random Stream6",
        thumbnail: "https://www.pexels.com/photo/45853/download/",
        stream_key: "test",
        viewers: 32525
    }
];

export const LiveList = ({ category = "" }) => {
    const { isError, error, isLoading, data } = handleGetLiveStreams(category);

    const DATA = data ? data : DUMMY_DATA;

    return (
        <div className="live-list-container">
            <SectionHeading>{category ? category : "Live Now"}</SectionHeading>
            <VirtualizedCatalog
                data={DATA}
                isError={isError}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};
