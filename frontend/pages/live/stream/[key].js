import StreamWidget from "@/widgets/stream";
import { useRouter } from "next/router";
import "./StreamPage.css";

const StreamPage = (props) => {
    const router = useRouter();

    return (
        <div>
            <StreamWidget stream_key={router.query.key} />
        </div>
    );
};

export const getServerSideProps = async () => {
    return {
        props: {}
    };
};

export default StreamPage;
