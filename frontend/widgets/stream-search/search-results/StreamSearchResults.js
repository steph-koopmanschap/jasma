import { handleStreamSearch } from "@/features/stream";
import StreamListWidgets from "@/widgets/stream-list";
import { useRouter } from "next/router";

export const StreamSearchResults = () => {
    const searchTerm = useRouter().query.search;

    const { isLoading, isError, error, data } = handleStreamSearch(searchTerm);

    return (
        <div>
            <StreamListWidgets.VirtualizedCatalog
                data={data}
                isError={isError}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};
