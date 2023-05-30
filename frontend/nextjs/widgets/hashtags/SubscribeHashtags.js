import { HashtagShell } from "@/entities/hashtags";
import { SubToHashtagsForm, UnsubHashtagBtn, useGetHastags } from "@/features/hashtags";

export function SubscribeHashtags(props) {
    //Fetch currently subscribed hashtags from server
    const { status, isLoading, isError, data, error, refetch } = useGetHastags();

    if (isLoading) {
        return <h1>Retrieving subscribed hashtags...</h1>;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    if (data.success === false) {
        return <h1>{data.message}</h1>;
    }

    return (
        <div className="flex flex-col mx-auto">
            <SubToHashtagsForm />
            <p>Your are currently subscribed to the following hashtags:</p>
            <div className="flex">
                {data?.hashtags.map((hashtag) => (
                    <HashtagShell
                        {...hashtag}
                        key={hashtag.id}
                        unSubAction={<UnsubHashtagBtn />}
                    />
                ))}
            </div>
        </div>
    );
}
