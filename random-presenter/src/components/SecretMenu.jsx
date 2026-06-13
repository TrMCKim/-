import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

export default function SecretMenu({ students, secretWinners, setSecretWinners, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleToggleSecret = (student) => {
    if (secretWinners.includes(student)) {
      setSecretWinners(secretWinners.filter(s => s !== student));
    } else {
      setSecretWinners([...secretWinners, student]);
    }
  };

  const filteredStudents = students.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="secret-menu-overlay">
      <div className="secret-menu-content">
        <div className="flex justify-between items-center mb-6">
          <h3 className="title" style={{ fontSize: '1.5rem', marginBottom: 0, textShadow: 'none', background: 'white', WebkitTextFillColor: 'white' }}>
            🔒 Teacher Secret Settings
          </h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-400 mb-4 text-sm">
          Select students to ALWAYS be picked first. They will be chosen in the order selected.
        </p>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            className="input pl-10" 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="student-list" style={{ maxHeight: '200px' }}>
          {filteredStudents.map((student, idx) => {
            const isSelected = secretWinners.includes(student);
            const selectionIndex = secretWinners.indexOf(student) + 1;
            
            return (
              <div 
                key={idx} 
                className="student-item"
                style={{ cursor: 'pointer', background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent' }}
                onClick={() => handleToggleSecret(student)}
              >
                <span>{student}</span>
                {isSelected && (
                  <span className="badge" style={{ background: '#10b981' }}>#{selectionIndex}</span>
                )}
              </div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="text-center text-gray-400 py-4">No students found.</div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button onClick={() => setSecretWinners([])} className="btn btn-danger mr-2">
            Clear Selection
          </button>
          <button onClick={onClose} className="btn">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
