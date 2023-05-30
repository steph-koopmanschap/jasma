export const UserRolesOptions = () => {
    return (
        <>
            {USER_ROLES.map((role) => (
                <option
                    value={role}
                    key={role}
                >
                    {role}
                </option>
            ))}
        </>
    );
};

var USER_ROLES = ["admin", "mod", "normal"];
