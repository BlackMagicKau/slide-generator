import React, { useState, useEffect } from 'react';
import './App.css';
import { generateSlides as generateSlidesAPI } from './services/openai';
import { generatePPTX } from './services/pptx';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import { FiLogOut } from 'react-icons/fi';
import { BiSlideshow, BiDownload } from 'react-icons/bi';
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function App() {
  const [prompt, setPrompt] = useState('');
  const [slides, setSlides] = useState([]);
  const [design, setDesign] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGenerateSlides = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateSlidesAPI(prompt);
      setSlides(response.slides);
      setDesign(response.design);
      setCurrentSlide(0);
    } catch (err) {
      setError('Failed to generate slides. Please try again.');
      console.error('Error generating slides:', err);
    }
    setIsLoading(false);
  };

  const handleDownload = async () => {
    try {
      const blob = await generatePPTX(slides, design);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'presentation.pptx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading presentation:', err);
      setError('Failed to download presentation. Please try again.');
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="app">
      <div className="bg-gradient">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
      </div>
      <div className="container">
        <div className="header">
          <h1>
            <BiSlideshow className="title-icon" />
            Slide Generator
          </h1>
          <div className="user-controls">
            <button className="sign-out-button" onClick={() => auth.signOut()}>
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>
        
        <div className="input-section">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your presentation topic..."
            rows={4}
          />
          <button 
            onClick={handleGenerateSlides}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="loading-icon spin" />
                Generating...
              </>
            ) : (
              'Generate Slides'
            )}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {slides.length > 0 && design && (
          <div className="presentation-section">
            <div className="presentation-controls">
              <button 
                className="download-button"
                onClick={handleDownload}
              >
                <BiDownload /> Download PowerPoint
              </button>
            </div>
            
            <div 
              className={`slide ${slides[currentSlide].layout}`}
              style={{
                '--primary-color': design.primaryColor,
                '--secondary-color': design.secondaryColor,
                '--background-color': design.backgroundColor,
                '--accent-color': design.accentColor,
                '--heading-font': design.headingFont,
                '--body-font': design.bodyFont,
                background: `linear-gradient(135deg, ${design.backgroundColor}, ${design.secondaryColor}15)`,
              }}
            >
              <h2 style={{ 
                color: design.primaryColor,
                fontFamily: design.headingFont 
              }}>
                {slides[currentSlide].title}
              </h2>
              <ul>
                {slides[currentSlide].points.map((point, index) => (
                  <li 
                    key={index}
                    style={{ 
                      color: design.secondaryColor,
                      fontFamily: design.bodyFont
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="controls">
              <button onClick={prevSlide} disabled={currentSlide === 0}>
                <IoMdArrowRoundBack />
              </button>
              <div className="dots">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <button onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
                <IoMdArrowRoundForward />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
