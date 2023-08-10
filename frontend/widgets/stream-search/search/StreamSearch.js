import { StreamSearch as Search } from "@/features/stream";
import "./Search.css";
import { useRouter } from "next/router";

export const StreamSearch = () => {
    const router = useRouter();
    return (
        <div className="stream-list-header">
            <div className="stream-search-container">
                <Search onGoTo={(value) => router.push(`/stream-page/results/search/${value}`)} />
            </div>
        </div>
    );
};
