import { formatLargeNumber } from "@/shared/utils";
import "./CategoryCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export const CategoryCard = ({ title, onClick, views, category_color, category_png }) => {
    return (
        <div className={`card-container`}>
            <CardShape color={category_color} />
            <div className="card-wrapper">
                <div className="play-icon">
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <h2>{title}</h2>
                <h3>{formatLargeNumber(views)} views</h3>
            </div>
            <div
                className="card-img-wrapper"
                style={{ backgroundImage: `url(${category_png})` }}
            ></div>
        </div>
    );
};

function CardShape({ color }) {
    return (
        <div className="shape-container">
            <div
                className="shape-before"
                style={{ backgroundColor: `${color}` }}
            ></div>
        </div>
    );
}
