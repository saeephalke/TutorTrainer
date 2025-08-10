function Home() {
  return (
    <div className="home">
      <h1>Welcome to The Tutor Trainer</h1>
      <h2>Your AI-powered tutoring assistant</h2>
      <br/>
      <p className="home_p">Note that an AI assistant shouldn't replace experience with actual students,
        whatever you do here should be used as a guide and not as a replacement for
        actual teaching experience.</p>
      <button onClick={() => window.location.href = '/chat'}> 
        Start Chatting
      </button>
    </div>
  );
}   

export default Home;