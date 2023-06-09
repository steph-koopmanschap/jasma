import { useRequireAuth } from "@/shared/model";

export default function advertisement(props) {
    //Redirect user to the dashboard if they are not logged in.
    useRequireAuth("/dashboard");

    return (
        <div>
            <h1 className="text-xl">Information on your ad</h1>
            <h2>Nothing here yet...</h2>
        </div>
    );
}