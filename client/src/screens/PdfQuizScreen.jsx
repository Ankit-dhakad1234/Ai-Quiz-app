import React, { useRef, useState } from 'react';
import Icon from '../components/Icon';
import { useQuiz } from '../hooks/useQuiz';
import { generatePdfQuiz, uploadPdf } from '../services/QuizServices';

export default function PdfQuizScreen() {
  const inputRef = useRef(null);
  const { dispatch } = useQuiz();
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const selectFile = async (selectedFile) => {
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
    setDocumentId('');
    setIsUploading(true);
    try {
      const result = await uploadPdf(selectedFile);
      setDocumentId(result.documentId);
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to process this PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  const startQuiz = async () => {
    if (!documentId || isGenerating) return;
    setIsGenerating(true);
    setError('');
    try {
      const questions = await generatePdfQuiz(documentId, questionCount, difficulty);
      dispatch({
        type: 'START_QUIZ',
        payload: { questions, topic: `PDF: ${file.name}`, source: 'pdf' },
      });
    } catch (quizError) {
      setError(quizError.message || 'Failed to generate a quiz from this PDF.');
    } finally {
      setIsGenerating(false);
    }
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
              <div className="uploaded-file-copy"><strong>{file.name}</strong><span>{isUploading ? 'Uploading and processing...' : documentId ? 'PDF ready' : 'Upload failed'}</span></div>
              {!isUploading && <button className="icon-button remove-file" aria-label="Remove selected PDF" disabled={isGenerating} onClick={() => { setFile(null); setDocumentId(''); setError(''); }}><Icon name="close" /></button>}
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
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" disabled={isUploading || isGenerating} onChange={(event) => { selectFile(event.target.files[0]); event.target.value = ''; }} />
          {error && <p className="field-error" role="alert">{error}</p>}
          {file && !documentId && !isUploading && (
            <button className="text-button" onClick={() => selectFile(file)}>Retry upload <Icon name="arrow" size={14} /></button>
          )}
          <div className="privacy-note"><Icon name="check" size={15} /> Your documents stay private and secure</div>
        </section>

        <section className="tool-card settings-card">
          <div className="card-heading">
            <span className="step-number">02</span>
            <div><h2>Customize your quiz</h2><p>Choose how you’d like to practice</p></div>
          </div>
          <div className="setting-group">
            <div className="setting-label"><strong>Number of questions</strong><span>{questionCount} questions</span></div>
            <input className="range-input" type="range" min="5" max="25" step="5" value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} aria-label="Number of questions" disabled={isGenerating} />
            <div className="range-labels"><span>5</span><span>15</span><span>25</span></div>
          </div>
          <div className="setting-group difficulty-group">
            <div className="setting-label"><strong>Difficulty level</strong><span>Choose your challenge</span></div>
            <div className="segmented-control">
              {['Easy', 'Medium', 'Hard'].map((level) => <button type="button" className={difficulty === level ? 'selected' : ''} key={level} onClick={() => setDifficulty(level)} disabled={isGenerating}>{level}</button>)}
            </div>
          </div>
          <button className="button button-primary generate-button" disabled={!documentId || isUploading || isGenerating} onClick={startQuiz}>
            <Icon name="sparkles" size={17} /> {isUploading ? 'Processing PDF...' : isGenerating ? 'Generating quiz...' : 'Generate my quiz'} {!isUploading && !isGenerating && <Icon name="arrow" size={16} />}
          </button>
          {!file && <p className="button-hint">Upload a PDF to get started</p>}
          {file && !documentId && !isUploading && !error && <p className="button-hint">Wait for the PDF to finish processing</p>}
        </section>
      </div>

      <div className="tool-tip"><span className="tip-icon"><Icon name="sparkles" size={17} /></span><div><strong>Make the most of your study time</strong><p>For the best results, upload clear notes or textbook pages with selectable text.</p></div></div>
    </div>
  );
}
