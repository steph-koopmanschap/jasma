import { useCheckAuthClientSide } from "@/features/auth/admin/index.js";

export default function CMS_Login() {
    useCheckAuthClientSide("/cms/cms-login");

    return (
        <div>
            <h1 className="text-xl">JASMA CONTENT DELETION POLICY</h1>
            <p>Nothing here yet...</p>
        </div>
    );
}
