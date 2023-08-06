import { LoadError, StreamCard } from "@/entities/stream";
import { useInfiniteScroll } from "@/shared/model/hooks/useInfiniteScroll";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "./Catalog.css";
import Virtualized from "@/shared/ui/wrappers/Virtualized";
import UserWidgets from "@/widgets/user";
import { Spinner } from "@/shared/ui";

export const VirtualizedCatalog = ({
    data = [],
    isError = false,
    error = "",
    isLoading = false,
    onRequestNext = () => {}
}) => {
    const router = useRouter();

    const { lastElRef } = useInfiniteScroll({
        onRequestNext,
        isLoading,
        startPage: 1
    });

    // useEffect(() => {
    //     const scrollPosition = sessionStorage.getItem("stream_scroll_pos");
    //     if (scrollPosition) {
    //         window.scrollTo(0, parseInt(scrollPosition, 10));
    //         sessionStorage.removeItem("scrollPosition");
    //     }
    // }, []);

    const handleClick = (stream_key) => {
        window.sessionStorage.setItem("stream_scroll_pos", window.pageYOffset);
        router.push(`/stream-page/stream/${stream_key}`);
    };
    return (
        <div className="list-layout">
            {isError ? (
                <LoadError>{error?.message}</LoadError>
            ) : (
                <div className="live-list-wrapper">
                    {data?.map((item, ind) => (
                        <Virtualized
                            key={item.user_id}
                            itemId={item.stream_key}
                            isLast={ind + 1 === data.length}
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
            {!data?.length && !isLoading ? <LoadError>{"No live streams found"}</LoadError> : null}
        </div>
    );
};
