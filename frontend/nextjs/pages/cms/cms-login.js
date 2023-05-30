import { useCheckAuthClientSide } from "@/features/auth/admin";

export default function CMS_Login() {
    useCheckAuthClientSide("/cms/cms-login", "/cms/admin-panel");

    return (
        <div>
            <h1 className="text-xl text-center mt-4">JASMA CONTENT MODERATION SYSTEM (J-CMS) LOGIN</h1>
            <h2>Nothing here yet...</h2>
        </div>
    );
}
