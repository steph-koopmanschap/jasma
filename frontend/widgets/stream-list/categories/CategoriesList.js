import { CategoryCard, SectionHeading } from "@/entities/stream";
import { memo } from "react";
import "./List.css";
import { useRouter } from "next/router";
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

export const CategoriesList = memo(() => {
    const router = useRouter();
    return (
        <div className="categories-container">
            <SectionHeading>Categories</SectionHeading>
            <div className="list-container">
                {DUMMY_DATA.map((item) => (
                    <CategoryCard
                        key={item.title}
                        onClick={() => router.push(`/stream-page/results/category/${item.title}`)}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
});
