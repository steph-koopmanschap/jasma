import { CategoryCard } from "@/entities/stream";
import "./List.css";
const DUMMY_DATA = [
    {
        title: "Chatting",
        views: "21521051",
        category_color: "#9e66ca",
        category_png: "/assets/png_example.png"
    },
    {
        title: "Overwatch",
        views: "15000",
        category_color: "#c94035",
        category_png: "/assets/png_example2.png"
    },
    {
        title: "Apex",
        views: "123214",
        category_color: "#e759ad",
        category_png: "/assets/png_example3.png"
    },
    {
        title: "Movies",
        views: "21422",
        category_color: "#9e66ca",
        category_png: "/assets/png_example3.png"
    }
];

export const RecommendedList = () => {
    return (
        <div className="recommendations-container">
            <h2 className="recommendations-title">Recommended Categories</h2>
            <div className="list-container">
                {DUMMY_DATA.map((item) => (
                    <CategoryCard
                        key={item.title}
                        onClick={() => {}}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
};
