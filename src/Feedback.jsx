import { useState } from "react";
import { useNavigate } from "react-router";


function Feedback(){
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(() => {
        if (window.history.state.usr.feedbackMsg) {
            return window.history.state.usr.feedbackMsg;
        }
        return "No feedback available yet.";
    });

    return(
        <><h1>Feedback Page</h1>
        <p className="home_p">Here you'll get feedback from your session.</p>
        <div className="feedback-div">
            <p>{feedback}</p>
        </div>

        <div className="buttons-div">
        <button onClick={() => navigate('/')}>
            Return Home
        </button> 
        <button onClick={() => navigate('/chat')}>
            Return to Chat
        </button> 
        <button>
            Download Feedback
        </button>
        </div>
        </>
    )
}

export default Feedback;