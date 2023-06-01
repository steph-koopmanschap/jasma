import { FileUploader } from "@/features/file-upload";
import { ProfilePic } from "../profile-picture/ProfilePic";
import { handleUploadUserPic } from "@/features/user/model/userActions";
import { useToast } from "@/shared/model";

export function UploadProfilePic(props) {
    const { userID } = props;
    const [file, setFile] = useState(null);

    const { notifyToast } = useToast();

    const uploadProfilePic = async () => {
        const res = await handleUploadUserPic(file);
        if (res.error) return notifyToast(res.message);

        setFile(null);
    };

    return (
        <div className="flex flex-col">
            <p>Your current profile picture: </p>
            <ProfilePic
                userID={userID}
                width={250}
                height={250}
            />
            <p>Change profile picture:</p>
            <FileUploader
                file={file}
                setFile={setFile}
            />
            {file ? (
                <button
                    className="formButtonDefault outline-white border my-1"
                    onClick={uploadProfilePic}
                >
                    Upload picture.
                </button>
            ) : null}
        </div>
    );
}
