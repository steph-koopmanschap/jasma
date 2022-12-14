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
            <div className="flex flex-col">
            <h3 className='text-xl'>Filters:</h3>
                <button className='formButtonDefault m-2'>Hashtags</button>
                <button className='formButtonDefault m-2'>Text in posts</button>
                <button className='formButtonDefault m-2'>Comments</button>
                <button className='formButtonDefault m-2'>Users</button>
                <button className='formButtonDefault m-2'>Bookmarks</button>
            {/* <h3 className='text-xl'>Sub Filters:</h3>
                <button className='formButtonDefault m-2'>Videos</button>
                <button className='formButtonDefault m-2'>Images</button>
                <button className='formButtonDefault m-2'>Audios</button>
                <button className='formButtonDefault m-2'>Text</button> */}
            </div>
        </div>
    );
}
