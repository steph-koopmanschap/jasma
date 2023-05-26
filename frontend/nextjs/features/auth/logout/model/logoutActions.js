import { logout } from "@/entities/auth";

const handleLogout = async () => {
    try {
        const res = await logout();
        //Remove userID and username from localStorage

        window.localStorage.setItem("loggedInUserID", "");
        window.localStorage.setItem("loggedInUsername", "");
        window.localStorage.removeItem("loggedInUserID");
        window.localStorage.removeItem("loggedInUsername");
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

export { handleLogout };
