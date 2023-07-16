import { ChannelCard } from "@/entities/stream";
import "./List.css";
import UserWidgets from "@/widgets/user";

const DUMMY_DATA = [
    {
        user_id: 1,
        title: "RandUser_1",
        followers: 125123
    },
    {
        user_id: 2,
        title: "RandUser_2",
        followers: 125124
    },
    {
        user_id: 3,
        title: "RandUser_3",
        followers: 41234
    },
    {
        user_id: 4,
        title: "RandUser_5",
        followers: 21415
    }
];

export const TopChannelsList = () => {
    return (
        <div className="top-channels-container">
            <h2 className="section-title">Top Channels</h2>
            <div className="channels-list">
                {DUMMY_DATA.map((item) => (
                    <ChannelCard
                        key={item.user_id}
                        onClick={() => {}}
                        userPic={
                            <UserWidgets.ProfilePic
                                width={50}
                                height={50}
                                userID={item.user_id}
                            />
                        }
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
};
