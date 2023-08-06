import { formatLargeNumber } from "@/shared/utils";
import "./CategoryCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export const CategoryCard = ({ title, onClick, views = 0, color_hex, category_img }) => {
    return (
        <div
            className={`card-container`}
            tabIndex={0}
            role="link"
            aria-label={`${title} category`}
            onClick={onClick}
        >
            <CardShape color={color_hex} />
            <div className="card-wrapper">
                <div className="play-icon">
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <h2>{title}</h2>
                {views > 100 ? <h3>{formatLargeNumber(views)} views</h3> : null}
            </div>
            <div
                className="card-img-wrapper"
                style={{ backgroundImage: `url(${category_img})` }}
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
