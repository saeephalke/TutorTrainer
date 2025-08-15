import { useNavigate } from "react-router";
import Header from "./Header";

function NotFound() {
    const navigate = useNavigate();
    return (
       
            <><Header /><div className="page-fade">
            <h1>404 Not Found</h1>
            <p className="home_p">The page you are looking for does not exist.</p>
            <div className="buttons-div">
                <button onClick={() => navigate('/')}>Return Home</button>
                <button onClick={() => navigate('/chat')}>Go Chat</button>
            </div>
        </div></>
    );
}

export default NotFound;