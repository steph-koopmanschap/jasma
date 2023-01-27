import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import api from "../../clientAPI/api.js";
import CreatePost from '../../components/CreatePost';
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';
import LogInOutBtn from '../../components/LogInOutBtn';
import UserPostList from '../../components/UserPostList';
import { useState, useEffect } from 'react';


//import HeaderMain from '../../components/HeaderMain';

//The Settings profile
export default function Settings(props) {

    return (
        <div>
            <HeaderMain /> 

            <h1>Nothing here yet.</h1>

        </div>
    );
}
