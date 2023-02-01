import { useEffect } from "react";
import { useRecoilState } from "recoil";
import userState from "../../state/userState";
import jasmaApi from "../../clientAPI/api";

const NavProfile = () => {
    const [user, setUser] = useRecoilState(userState);
    useEffect(() => {
        async function getClientUser() {
            const data = await jasmaApi.getClientUser();
            if (data.success) {
                setUser(data.user);
            }
        }
        getClientUser();
    }, []);

    if (!user) {
        return <div>default stuff</div>;
    }

    return (
        <div>
            <div>{user.username}</div>
        </div>
    );
};

export default NavProfile;
