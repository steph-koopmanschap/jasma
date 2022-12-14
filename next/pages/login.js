import HeaderMain  from '../components/HeaderMain';
import FooterMain  from '../components/FooterMain';
import LoginForm   from '../components/LoginForm';

//Login page
export default function LoginPage() {
    return (
      <div className="">
        <HeaderMain/>
  
        <main className='flex flex-col items-center justify-center w-full h-fit'>
          <LoginForm/>
        </main>
  
        <FooterMain/>
      </div>
    );
}
