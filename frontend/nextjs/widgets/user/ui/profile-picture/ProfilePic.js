import { ProfileImage } from "@/entities/images";
import { useGetUserPicture } from "../../model/userActions";

export const ProfilePic = ({ userID }) => {
    const { data, error } = useGetUserPicture(userID);

    return <ProfileImage imgSrc={data.profile_img} />;
};
