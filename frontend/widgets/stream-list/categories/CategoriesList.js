import { CategoryCard, SectionHeading } from "@/entities/stream";
import { memo } from "react";
import "./List.css";
import { useRouter } from "next/router";
import { handleGetCategories } from "@/features/stream";

export const CategoriesList = memo(() => {
    const { isError, error, data, isLoading } = handleGetCategories();
    const router = useRouter();
    if (isError || isLoading || !data || !data.length) return null;

    return (
        <div className="categories-container">
            <SectionHeading>Categories</SectionHeading>
            <div className="list-container">
                {data?.map((item) => (
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
