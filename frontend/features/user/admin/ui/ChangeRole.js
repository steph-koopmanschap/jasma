//import { getCSRF_TOKEN } from "@/entities/auth";
import { handleChangeUserRole } from "../../model/userActions";
import { useToast } from "@/shared/model";
import { UserRolesOptions } from "@/entities/user";

export const ChangeRole = ({ userId }) => {
    const { notifyToast } = useToast();

    const changeRole = async (e) => {
        e.preventDefault();

        if (searchedUser !== "") {
            const role = document.getElementById(`changeRoleSelect_search`).value;
            console.log("role", role);
            let res = "";
            res = await handleChangeUserRole(userId, role);
        } else {
            const user_id = e.target.id.replace("form_", "");
            const role = document.getElementById(`changeRoleSelect_${user_id}`).value;
            res = await handleChangeUserRole(user_id, role);
        }
        if (res.error) notifyToast(res.message, true);
    };

    return (
        <form
            className="mb-6"
            id={`form_search`}
            action="#"
            onSubmit={changeRole}
        >
            {/* <input
                type="hidden"
                name="_csrf"
                value={getCSRF_TOKEN()}
            /> */}
            <select
                name="role"
                id={`changeRoleSelect_search`}
            >
                <UserRolesOptions />
            </select>
            <input
                className="formButtonDefault outline-white border my-1 ml-2"
                type="submit"
                value="Save"
            />
        </form>
    );
};
