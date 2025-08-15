import { useState } from "react";
import { useNavigate } from "react-router";


function Feedback(){
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(() => {
        if (window.history.state.usr.feedbackMsg) {
            return window.history.state.usr.feedbackMsg;
        }
        return "Not enough information to generate feedback.";
    });

    const handleDownload = () => {
        if (!feedback || feedback === "Not enough information to generate feedback.") {
            alert("No feedback to download.");
            return;
        }
        const blob = new Blob([feedback], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'feedback.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return(
        <><h1>Feedback Time</h1>
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
        <button onClick={handleDownload}>
            Download Feedback
        </button>
        </div>
        </>
    )
}

export default Feedback;