import { StreamSearch } from "@/features/stream";
import "./Header.css";
import { useRouter } from "next/router";

export const Header = () => {
    const router = useRouter();

    return (
        <div className="stream-list-header">
            <div className="stream-search-container">
                <StreamSearch onGoTo={(value) => router.push(`/live/stream-list?search=${value}`)} />
            </div>
        </div>
    );
};
