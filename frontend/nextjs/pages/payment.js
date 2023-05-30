import { useRequireAuth } from "@/shared/model";
import Payment from "@/widgets/payments";

export default function PaymentPage() {
    //Redirect user to the dashboard if they are not logged in.
    useRequireAuth("/dashboard");

    return (
        <div className="">
            <section className="flex flex-col items-center justify-center w-full h-fit">
                <Payment />
            </section>
        </div>
    );
}
