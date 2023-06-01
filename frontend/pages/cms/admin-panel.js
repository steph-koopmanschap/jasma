import { useCheckAuthClientSide } from "@/features/auth/admin";
import UserWidgets from "@/widgets/user/index.js";

/*
    This is a page for administrators to manage moderators / account roles.
*/

export default function AdminPanel() {
    useCheckAuthClientSide("/cms/cms-login");

    return (
        <div>
            <UserWidgets.AdminPanel />
        </div>
    );
}
