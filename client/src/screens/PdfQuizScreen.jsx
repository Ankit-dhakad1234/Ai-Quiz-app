import React, { useRef, useState } from 'react';
import Icon from '../components/Icon';

export default function PdfQuizScreen() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [quizStarted, setQuizStarted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.');
      setFile(null);
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('This PDF is larger than 20 MB. Choose a smaller file.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
    setQuizStarted(false);
  };

  return (
    <div className="tool-page">
      <div className="tool-heading">
        <div>
          <div className="eyebrow"><span className="status-dot green" /> STUDY SMARTER</div>
          <h1>Turn your PDF into a quiz</h1>
          <p>Upload your study material and create a practice quiz tailored to you.</p>
        </div>
        <div className="heading-art"><Icon name="file" size={28} /><span><Icon name="sparkles" size={17} /></span></div>
      </div>

      <div className="tool-layout">
        <section className="tool-card upload-card">
          <div className="card-heading">
            <span className="step-number">01</span>
            <div><h2>Upload your document</h2><p>Choose a PDF you want to study from</p></div>
          </div>
          {file ? (
            <div className="uploaded-file">
              <span className="pdf-file-icon"><Icon name="file" size={22} /></span>
              <div className="uploaded-file-copy"><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · PDF document</span></div>
              <button className="icon-button remove-file" aria-label="Remove selected PDF" onClick={() => { setFile(null); setQuizStarted(false); }}><Icon name="close" /></button>
            </div>
          ) : (
            <button
              className={`dropzone${dragging ? ' dragging' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); }}
            >
              <span className="upload-symbol"><Icon name="upload" size={22} /></span>
              <strong>Drop your PDF here, or <span>browse files</span></strong>
              <small>PDF format · Maximum file size 20 MB</small>
            </button>
          )}
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" onChange={(event) => selectFile(event.target.files[0])} />
          {error && <p className="field-error" role="alert">{error}</p>}
          <div className="privacy-note"><Icon name="check" size={15} /> Your documents stay private and secure</div>
        </section>

        <section className="tool-card settings-card">
          <div className="card-heading">
            <span className="step-number">02</span>
            <div><h2>Customize your quiz</h2><p>Choose how you’d like to practice</p></div>
          </div>
          <div className="setting-group">
            <div className="setting-label"><strong>Number of questions</strong><span>{questionCount} questions</span></div>
            <input className="range-input" type="range" min="5" max="25" step="5" value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} aria-label="Number of questions" />
            <div className="range-labels"><span>5</span><span>15</span><span>25</span></div>
          </div>
          <div className="setting-group difficulty-group">
            <div className="setting-label"><strong>Difficulty level</strong><span>Choose your challenge</span></div>
            <div className="segmented-control">
              {['Easy', 'Medium', 'Hard'].map((level) => <button className={difficulty === level ? 'selected' : ''} key={level} onClick={() => setDifficulty(level)}>{level}</button>)}
            </div>
          </div>
          <button className="button button-primary generate-button" disabled={!file} onClick={() => setQuizStarted(true)}>
            <Icon name="sparkles" size={17} /> Generate my quiz <Icon name="arrow" size={16} />
          </button>
          {!file && <p className="button-hint">Upload a PDF to get started</p>}
        </section>
      </div>

      {quizStarted && (
        <section className="prototype-notice" role="status">
          <span className="notice-icon"><Icon name="check" /></span>
          <div><strong>Your quiz preferences are ready</strong><p>{file.name} · {questionCount} questions · {difficulty} difficulty. PDF-based question generation will be connected in the next step.</p></div>
        </section>
      )}

      <div className="tool-tip"><span className="tip-icon"><Icon name="sparkles" size={17} /></span><div><strong>Make the most of your study time</strong><p>For the best results, upload clear notes or textbook pages with selectable text.</p></div></div>
    </div>
  );
}
