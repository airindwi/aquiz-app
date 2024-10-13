import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './quiz.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Komponen Navbar untuk menampilkan nama kuis dan waktu tersisa
const QuizNavbar = ({ quizName, durationInMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="navbar">
      <h2>{quizName}</h2>
      <div className="time-container">
        <FontAwesomeIcon icon={faClock} />
        <h3 className="time-left">{formatTime(timeLeft)}</h3>
      </div>
    </nav>
  );
};

// Komponen Loading untuk menampilkan saat data sedang dimuat
const Loading = () => (
  <div className="loading-container">
    <div className="loading-card">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  </div>
);

// Komponen utama Quiz
const Quiz = () => {
  const quizName = 'General Knowledge Quiz';
  const durationInMinutes = 120;

  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data kuis dari API
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('https://pacmann-frontend.pacmann.workers.dev/');
        const formattedData = response.data.data.map((item) => ({
          question: item.question,
          options: item.options.map(option => ({
            label: option.label,
            value: option.value,
          })),
          correctAnswer: item.correctAnswer,
        }));
        setQuizData(formattedData);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  // Menangani pemilihan jawaban
  const handleAnswerSelection = (optionLabel) => {
    setSelectedAnswer(optionLabel);
    const isCorrect = optionLabel === quizData[currentQuestionIndex]?.correctAnswer;
    setIsAnswerCorrect(isCorrect);
  };

  // Menangani pergantian pertanyaan
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setIsAnswerCorrect(null);
    } else {
      alert('You have completed the quiz!'); // Implement submission logic here
    }
  };

  // Jika loading, tampilkan komponen Loading
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <QuizNavbar quizName={quizName} durationInMinutes={durationInMinutes} />
      <div className="quiz-container">
        <div className="question-card">
          <h3>Question {currentQuestionIndex + 1}/{quizData.length}</h3>
          <p className="question-text" dangerouslySetInnerHTML={{ __html: quizData[currentQuestionIndex].question }}></p>
          <ul className="options-list">
            {quizData[currentQuestionIndex]?.options.map((option) => (
              <li 
                key={option.value}
                className={`option-item ${selectedAnswer === option.label ? (isAnswerCorrect ? 'correct' : 'incorrect') : ''}`}>
                <label className="option-label">
                  <input
                    type="radio"
                    name="answer"
                    value={option.value}
                    checked={selectedAnswer === option.label}
                    onChange={() => handleAnswerSelection(option.label)}
                    disabled={selectedAnswer !== ''}
                  />
                  {option.value}
                </label>
              </li>
            ))}
          </ul>
          <button className="next-button" onClick={handleNextQuestion} disabled={!selectedAnswer}>
            {currentQuestionIndex < quizData.length - 1 ? (
              <>Next Question <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" /></>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
