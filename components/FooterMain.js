import Image from 'next/image';
import Link from 'next/link';

//The main footer

export default function FooterMain() {
    return ( 
        <footer className="">
            <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            >
            Powered by{' '}
                <span className="">
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                </span>
            </a>
            <Link className='hover:text-sky-500' href="/about">About</Link>
        </footer>
    );
}
