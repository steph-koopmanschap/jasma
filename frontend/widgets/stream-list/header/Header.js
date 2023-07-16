import { StreamSearch } from "@/features/stream";
import "./Header.css";

export const Header = () => {
    return (
        <div className="stream-list-header">
            <div className="stream-search-container">
                <StreamSearch />
            </div>
        </div>
    );
};
