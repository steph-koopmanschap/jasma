import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import HeaderMain from '../components/HeaderMain';

export default function Home() {
  return (
    <div className="">
      <Head>
        <meta charset="utf-8" />
        
        <title>JASMA</title>
        
        <meta name="description" content="JASMA - Just Another Social Media App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="author" content="Steph Koopmanschap" />
        
        <meta property="og:title" content="Just Another Social Media App" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jasma.vercel.app" />
        <meta property="og:description" content="Just Another Social Media App" />
        <meta property="og:image" content="image.png" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        <link rel="apple-touch-icon" href="/logo192.png" />

      {/* <!--
        manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
      --> */}
      <link rel="manifest" href="/manifest.json" />
      </Head>

      <HeaderMain/>

      <main className='flex flex-col items-center justify-center w-full h-fit hover:text-sky-500'>
        
        <Link href="/dashboard">Dashboard</Link>
      </main>

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
      </footer>
    </div>
  );
}
