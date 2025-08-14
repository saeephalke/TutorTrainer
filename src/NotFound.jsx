import { useNavigate } from "react-router";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="not-found">
            <h1>404 Not Found</h1>
            <p className="home_p">The page you are looking for does not exist.</p>
            <button onClick={() => navigate('/')}>Return Home</button>
        </div>
    );
}

export default NotFound;