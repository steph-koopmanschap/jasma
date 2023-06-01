export const UserBio = ({ given_name, last_name, date_of_birth, bio, website, country, city, email, phone }) => {
    return (
        <div>
            <p>Name: {given_name || ""}</p>
            <p>Last name: {last_name || ""}</p>
            <p>Bio: {bio || ""}</p>
            <p>Website: {website || ""}</p>
            <p>Date of Birth: {date_of_birth || ""}</p>
            <p>Country: {country || ""}</p>
            <p>City: {city || ""}</p>
            <p>E-mail: {email || ""}</p>
            <p>Phone: {phone || ""}</p>
        </div>
    );
};
