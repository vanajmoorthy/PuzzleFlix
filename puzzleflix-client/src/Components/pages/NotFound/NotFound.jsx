import { Link } from "react-router-dom";
import "./NotFound.css";
import { ReactComponent as NotFoundSVG } from "../../../assets/not-found.svg";
export default function NotFound() {
    return (
        <div className="not-found">
            <h1>We couldn't find that page :/</h1>
            <p>
                <NotFoundSVG className="not-found-image" />
            </p>
            <p>
                Click <Link to="/">here</Link> to go home.
            </p>
        </div>
    );
}
