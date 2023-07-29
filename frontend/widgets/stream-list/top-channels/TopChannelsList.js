import { ChannelCard, SectionHeading } from "@/entities/stream";
import "./List.css";
import UserWidgets from "@/widgets/user";
import { memo } from "react";
import { useRouter } from "next/router";

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

export const TopChannelsList = memo(() => {
    const router = useRouter();
    return (
        <div className="top-channels-container">
            <SectionHeading>Top Channels</SectionHeading>
            <div className="channels-list">
                {DUMMY_DATA.map((item) => (
                    <ChannelCard
                        key={item.user_id}
                        onClick={() => router.push(`/user/${item.title}`)}
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
});
