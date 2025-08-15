import { Link } from "react-router";
function Header() {
    return (
        <header>
        <Link to="/">
          <img
            src="/tutor_trainer.svg"
            alt="Tutor Trainer Logo"
            style={{ width: "100px", height: "100px", margin: "10px" }}
        />  
        </Link>
        
        </header>
    );
}

export default Header;