import React, { useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Trash2, Users } from 'lucide-react';

export default function StudentManager({ students, setStudents }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          // Assuming first column has names
          const newStudents = results.data
            .map((row) => row[0])
            .filter((name) => name && name.trim() !== '');
          
          setStudents((prev) => {
            const combined = [...prev, ...newStudents];
            return [...new Set(combined)]; // Remove duplicates
          });
        },
        header: false,
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeStudent = (nameToRemove) => {
    setStudents(students.filter((name) => name !== nameToRemove));
  };

  const clearAll = () => {
    if (window.confirm('정말 모든 명단을 삭제하시겠습니까?')) {
      setStudents([]);
    }
  };

  return (
    <div className="glass-panel w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>
          <Users className="inline-block mr-2" size={24} />
          명단 관리
        </h2>
        <span className="badge">{students.length}명</span>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="file-input-wrapper flex-1">
          <button className="btn btn-secondary w-full">
            <Upload size={18} />
            CSV 일괄 추가
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </div>
        <button onClick={clearAll} className="btn btn-danger" disabled={students.length === 0}>
          <Trash2 size={18} />
          전체 삭제
        </button>
      </div>

      <div className="student-list">
        {students.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            등록된 학생이 없습니다.<br/>CSV 파일을 업로드해주세요.
          </div>
        ) : (
          students.map((student, index) => (
            <div key={index} className="student-item">
              <span>{student}</span>
              <button 
                onClick={() => removeStudent(student)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
