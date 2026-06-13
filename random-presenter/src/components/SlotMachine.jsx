import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

export default function SlotMachine({ students, count, secretWinners, onComplete }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentName, setCurrentName] = useState('???');
  const [results, setResults] = useState([]);

  const startSpin = () => {
    if (students.length < count) {
      alert(`명단이 부족합니다. (최소 ${count}명 필요)`);
      return;
    }

    setIsSpinning(true);
    setResults([]);
    setCurrentName(students[Math.floor(Math.random() * students.length)]);

    // Determine final winners
    let finalWinners = [];
    
    // Check if secret winners are available and valid
    if (secretWinners && secretWinners.length > 0) {
      finalWinners = secretWinners.slice(0, count);
      // If secret winners are less than count, fill the rest randomly
      const remainingCount = count - finalWinners.length;
      if (remainingCount > 0) {
        const availablePool = students.filter(s => !finalWinners.includes(s));
        const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
        finalWinners = [...finalWinners, ...shuffled.slice(0, remainingCount)];
      }
    } else {
      // Normal random selection
      const shuffled = [...students].sort(() => 0.5 - Math.random());
      finalWinners = shuffled.slice(0, count);
    }

    let speed = 50;
    let iterations = 0;
    const maxIterations = 40;

    const spin = () => {
      setCurrentName(students[Math.floor(Math.random() * students.length)]);
      iterations++;

      if (iterations < maxIterations) {
        // Slow down gradually
        if (iterations > maxIterations * 0.7) speed += 20;
        setTimeout(spin, speed);
      } else {
        setIsSpinning(false);
        setResults(finalWinners);
        setCurrentName('🎉 완료! 🎉');
        if (onComplete) onComplete(finalWinners);
      }
    };

    setTimeout(spin, speed);
  };

  const reset = () => {
    setResults([]);
    setCurrentName('???');
  };

  return (
    <div className="slot-machine-container w-full">
      <div className="slot-viewport">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentName}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="slot-item"
          >
            {currentName}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={startSpin} 
          disabled={isSpinning || students.length === 0}
          className="btn"
          style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}
        >
          <Play size={24} />
          {isSpinning ? '추출 중...' : '발표자 뽑기!'}
        </button>
        {results.length > 0 && (
          <button onClick={reset} className="btn btn-secondary">
            <RotateCcw size={20} />
            초기화
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="results-grid">
          {results.map((winner, idx) => (
            <div key={idx} className="result-card">
              {winner}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
