import { SectionHeading } from "@/entities/stream";
import { handleGetLiveStreams } from "@/features/stream";
import { VirtualizedCatalog } from "../catalog/VirtualizedCatalog";

const DUMMY_DATA = [
    // {
    //     user_id: 1,
    //     username: "John Doe",
    //     title: "Random Stream",
    //     thumbnail: "https://imgv3.fotor.com/images/blog-richtext-image/take-a-picture-with-camera.png",
    //     stream_key: "test",
    //     viewers: 2141215
    // },
];

export const LiveList = ({ category = "" }) => {
    const { isError, error, isLoading, data } = handleGetLiveStreams(category);
    return (
        <div className="live-list-container">
            <SectionHeading>{category ? category : "Live Now"}</SectionHeading>
            <VirtualizedCatalog
                data={data}
                isError={isError}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};
