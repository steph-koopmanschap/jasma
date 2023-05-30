import React from "react";
import Image from "next/image";

export function ProfileImage({ imgSrc = "", width = 32, height = 32 }) {
    //rounded-t-full (css)

    // if (data) {
    //     console.log("data from profile pic", data);
    // }

    // let profilePicSrc = "/";
    // if (data) {
    //     //Create url from blob for img src={profilePic}
    //     profilePicSrc = window.URL.createObjectURL(data);
    // }

    return (
        <React.Fragment>
            <Image
                className=" m-2"
                src={imgSrc}
                width={width}
                height={height}
                alt="Profile picture"
            />
            {/* <Image 
                className=" m-2"
                src={`http://localhost:5000/media/users/00000000-0000-0000-0000-000000000000/profile-pic.webp`}
                width={props.width}
                height={props.height}
                alt="Profile picture"
            /> */}
        </React.Fragment>
    );
}
