import Link from 'next/link';

//The main footer

export default function FooterMain() {
    return ( 
        <footer className="">
            <Link className='hover:text-sky-500' href="/about">About</Link>
            <Link className='hover:text-sky-500' href="legal/privacy-policy">Privacy Policy</Link>
            <Link className='hover:text-sky-500' href="legal/terms-of-service">Terms of Service</Link>
        </footer>
    );
}
