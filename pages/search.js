import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar';
import HeaderMain from '../components/HeaderMain';

//The search results page
export default function Search() {
    const router = useRouter();
    const { q } = router.query;

    return (
        <div>
            <HeaderMain/>
            <SearchBar prevQuery={q}/>
            <p>Query:</p>
            <p>{q}</p>
        </div>
    );
}