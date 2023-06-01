import SignUpForm from "@/features/auth/sign-up";

//Login page
export default function RegistrationPage() {
    return (
        <div className="">
            <section className="flex flex-col items-center justify-center w-full h-fit">
                <SignUpForm />
            </section>
        </div>
    );
}
