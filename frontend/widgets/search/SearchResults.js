import { SearchFilter } from "@/entities/search";
import { useGetSearchResults } from "@/features/search";
import { useRouter } from "next/router";
import Comment from "../comment";
import Post from "../post";
import UserLists from "../user-list";
import { useState } from "react";

export const SearchResults = () => {
    const router = useRouter();
    const { q } = router.query;

    const [filter, setFilter] = useState("posts");

    const { status, isLoading, isError, data, error, refetch } = useGetSearchResults(q, filter);

    const renderResult = () => {
        if (isLoading) {
            return <h1>Searching...</h1>;
        }

        if (isError) {
            return <h1>{error.message}</h1>;
        }

        if (filter === "hashtags" || filter === "posts") {
            return (
                <div>
                    {data.result.map((post) => (
                        <Post
                            key={post.post_id}
                            postData={post}
                        />
                    ))}
                </div>
            );
        } else if (filter === "comments") {
            return (
                <div>
                    {data.result.map((comment) => (
                        <Comment
                            key={comment.comment_id}
                            commentData={comment}
                        />
                    ))}
                </div>
            );
        } else if (filter === "users") {
            return <UserLists.UsersList users={data.result} />;
        }
    };

    const changeFilter = (e) => {
        setFilter(e.target.value);
        refetch();
    };

    return (
        <>
            <h3 className="flex justify-center mx-auto text-xl">Filters:</h3>
            <div className="flex justify-center mx-auto">
                {FILTERS.map((f) => (
                    <SearchFilter
                        value={f.toLowerCase()}
                        onClick={changeFilter}
                        key={f}
                    >
                        {f}
                    </SearchFilter>
                ))}
            </div>
            <div className="flex flex-col justify-center mx-auto">
                <h1 className="text-center">Results: </h1>

                <div>{data?.success ? renderResult() : <h1>{data?.message}</h1>}</div>
            </div>
        </>
    );
};

var FILTERS = ["Hastags", "Text in Posts", "Comments", "Users", "Bookmarks"];
