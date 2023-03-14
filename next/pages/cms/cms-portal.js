import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../clientAPI/api.js";
import ReportsList from "../../components/cms/ReportsList";

export default function CMS_Portal() {

    const router = useRouter();
    
    useEffect( () => {
        //Check if user is already logged in. If yes, redirect them to cms portal.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide();
            // Replace above line of code with below line of code when page is done.
            //const isLoggedIn = await api.checkAuthModClientSide();
            if (isLoggedIn === false) {
                router.replace('/cms/cms-login');
            }
        })();
        
    }, []);

    const deleteReport = async () => {
        const res = await api.deleteReport(post_id);
        console.log(res);
    }

    const ignoreReport = async () => {
        const res = await api.ignoreReport(post_id);
        console.log(res);
    }

    const passReport = async () => {
        console.log("This button does not work yet.");
    }

    return (
    <div>
        <h1 className="text-xl">JASMA CONTENT MODERATION SYSTEM (J-CMS)</h1>

        <Link className="text-blue-700" href={"/cms/content-deletetion-policy"}>Content Deletion Policy</Link>

        <ReportsList />

        <div>
            <button
                className="bg-amber-400 hover:bg-amber-200 text-black font-bold py-2 px-4 rounded mr-4" 
                onClick={passReport}
            >
                PASS
            </button>

            <button
                className="bg-red-800 hover:bg-red-600 text-black font-bold py-2 px-4 rounded mr-4" 
                onClick={deleteReport}
            >
                DELETE
            </button>

            <button
                className="bg-green-700 hover:bg-green-500 text-black font-bold py-2 px-4 rounded" 
                onClick={ignoreReport}
            >
                IGNORE
            </button>
        </div>

    </div>
    );
}
