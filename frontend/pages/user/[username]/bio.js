import { useRouter } from "next/router";
import UserWidgets from "@/widgets/user";

//The (public?) bio page of a user
export default function BioPage(props) {
    const router = useRouter();
    const { username } = router.query;

    return <UserWidgets.Bio username={username} />;
}
