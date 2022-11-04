import CreatePost from '../components/CreatePost';
import SearchBar from '../components/SearchBar';
import HeaderMain from '../components/HeaderMain';


export default function Dashboard() {

    return (
    <div>
        <HeaderMain/>
        <SearchBar />
        <CreatePost />
    </div>
    );
}
