import { ProfileImage } from "@/entities/images";
import { useGetUserPicture } from "@/features/user";

const ProfilePic = ({ userID }) => {
    const { data, error } = useGetUserPicture(userID);

    return <ProfileImage imgSrc={data.profile_img} />;
};
export default ProfilePic;
