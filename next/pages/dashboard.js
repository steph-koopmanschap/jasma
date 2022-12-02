import CreatePost from '../components/CreatePost';
import SearchBar from '../components/SearchBar';
import HeaderMain from '../components/HeaderMain';
import LogoutBtn from '../components/LogoutBtn';


export default function Dashboard() {

    return (
    <div className="flex flex-col justify-center mx-auto">
        <HeaderMain/>
        <SearchBar prevQuery="Search..."/>
        <LogoutBtn />
        <CreatePost />
    </div>
    );
}
