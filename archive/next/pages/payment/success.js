import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import api from "../clientAPI/api.js";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";

export default function PaymentSuccess() {
    
    return (
        <div className="">
            <HeaderMain />

            <section className="flex flex-col items-center justify-center w-full h-fit">
                <h1 className='text-xl'>Payment Success.</h1>
            </section>

            <FooterMain />
        </div>
    );
}
