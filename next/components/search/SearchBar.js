import styles from "./SearchBar.module.css";

const SearchBar = () => {
    return (
        <form>
            <input
                className={styles.input}
                type="text"
                placeholder="Search..."
            />
            <input
                className={styles.submitBtn}
                type="submit"
                value="Search"
            />
        </form>
    );
};

export default SearchBar;
