import React, { useState, useEffect } from 'react';
import StudentManager from './components/StudentManager';
import SlotMachine from './components/SlotMachine';
import SecretMenu from './components/SecretMenu';

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('presenter-students');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [extractCount, setExtractCount] = useState(1);
  const [secretWinners, setSecretWinners] = useState([]);
  const [isSecretMenuOpen, setIsSecretMenuOpen] = useState(false);

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('presenter-students', JSON.stringify(students));
  }, [students]);

  // Keyboard shortcut listener for Secret Menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + S
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSecretMenuOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="title">랜덤 발표자 추출기</h1>
      <p className="subtitle">공정하고 재미있는 발표자 선정!</p>

      <div className="w-full flex flex-col md:flex-row gap-8 mt-8">
        {/* Left Side: Setup */}
        <div className="flex-1 flex flex-col gap-4">
          <StudentManager 
            students={students} 
            setStudents={setStudents} 
          />
          
          <div className="glass-panel w-full">
            <h2 className="title" style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'left' }}>
              ⚙️ 설정
            </h2>
            <div className="flex items-center justify-between">
              <label htmlFor="extractCount" style={{ fontWeight: 600 }}>추출할 인원 수:</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  id="extractCount"
                  min="1" 
                  max={Math.max(1, students.length)} 
                  value={extractCount}
                  onChange={(e) => setExtractCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input"
                />
                <span className="text-gray-400">명</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Slot Machine Result */}
        <div className="flex-1 glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SlotMachine 
            students={students} 
            count={extractCount} 
            secretWinners={secretWinners}
            onComplete={(winners) => {
              // Optionally clear secret winners after they are picked
              setSecretWinners([]);
            }}
          />
        </div>
      </div>

      <SecretMenu 
        isOpen={isSecretMenuOpen}
        onClose={() => setIsSecretMenuOpen(false)}
        students={students}
        secretWinners={secretWinners}
        setSecretWinners={setSecretWinners}
      />
    </div>
  );
}

export default App;
