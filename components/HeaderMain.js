//The main header

import Link from "next/link";

export default function HeaderMain() {
    return ( 
        <header className='flex flex-col items-center justify-center w-full'>
            <Link className='text-2xl' href="/">JASMA</Link>
            <h2 className='text-xl'>Just Another Social Media App</h2>
        </header>
    );
}