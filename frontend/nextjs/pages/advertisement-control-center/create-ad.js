export default function createAdPage() {
    //Redirect user to the dashboard if they are not logged in.
    useRequireAuth("/dashboard");

    return (
        <div>
            <h1 className="text-xl">Create a new advertisement</h1>
            <h2>Nothing here yet...</h2>
        </div>
    );
}
