import {logout} from '../clientAPI/api.js';

export default function LogoutBtn() {
    const logoutUser = async (e) => {
        const res = await logout();
        alert(res.message);
        console.log(res);
    }
    
    return (
        <div>
            <button 
                className="formButtonDefault m-2" 
                onClick={logoutUser}
            >
                Logout
            </button>
        </div>
    );
}
