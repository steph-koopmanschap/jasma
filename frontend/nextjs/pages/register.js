import HeaderMain  from '../components/HeaderMain';
import FooterMain  from '../components/FooterMain';
import SignUpForm  from '../components/SignUpForm';

//Login page
export default function RegistrationPage() {
    return (
      <div className="">
        <HeaderMain/>
  
        <section className='flex flex-col items-center justify-center w-full h-fit'>
            <SignUpForm/>
        </section>
  
        <FooterMain/>
      </div>
    );
}
