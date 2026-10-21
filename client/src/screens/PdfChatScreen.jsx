import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Icon from '../components/Icon';
import { askPdfQuestion, uploadPdf } from '../services/QuizServices';

export default function PdfChatScreen() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const processFile = async (selectedFile) => {
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
    setDocumentId('');
    setQuestion('');
    setMessages([]);
    processFile(selectedFile);
  };

  const sendQuestion = async (event) => {
    event.preventDefault();
    const value = question.trim();
    if (!value || !documentId || isSending) return;
    const messageIndex = messages.length;
    setMessages((previous) => [...previous, { question: value }]);
    setQuestion('');
    setError('');
    setIsSending(true);
    try {
      const answer = await askPdfQuestion(documentId, value);
      setMessages((previous) => previous.map((message, index) => (
        index === messageIndex ? { ...message, answer } : message
      )));
    } catch (questionError) {
      setError(questionError.message || 'Failed to answer this question.');
      setMessages((previous) => previous.filter((_message, index) => index !== messageIndex));
      setQuestion(value);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="tool-page chat-tool-page">
      <div className="tool-heading">
        <div>
          <div className="eyebrow"><span className="status-dot" /> YOUR AI STUDY PARTNER</div>
          <h1>Chat with your PDF</h1>
          <p>Ask questions, explore ideas and find answers in your study material.</p>
        </div>
        <div className="heading-art chat-art"><Icon name="message" size={28} /><span><Icon name="sparkles" size={17} /></span></div>
      </div>
      <section className="chat-panel">
        {!file ? (
          <div className="chat-empty">
            <div className="empty-illustration"><Icon name="book" size={34} /><span><Icon name="sparkles" size={17} /></span></div>
            <h2>Start with a document</h2>
            <p>Upload a PDF and ask anything about its contents. Answers will be grounded in your document.</p>
            <button className="button button-primary" disabled={isUploading} onClick={() => inputRef.current?.click()}><Icon name="upload" size={17} /> {isUploading ? 'Uploading...' : 'Upload a PDF'}</button>
            <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" disabled={isUploading} onChange={(event) => { selectFile(event.target.files[0]); event.target.value = ''; }} />
            {error && <p className="field-error" role="alert">{error}</p>}
          </div>
        ) : (
          <>
            <div className="chat-document-bar">
              <div className="chat-document"><span className="pdf-file-icon"><Icon name="file" /></span><div><strong>{file.name}</strong><span>{isUploading ? 'Uploading and processing...' : documentId ? 'PDF document ready' : 'PDF upload failed'}</span></div></div>
              <button className="text-button" disabled={isUploading || isSending} onClick={() => { setFile(null); setDocumentId(''); setQuestion(''); setMessages([]); setError(''); }}>Change document <Icon name="close" size={15} /></button>
            </div>
            <div className="chat-messages">
              {!documentId ? (
                <div className="chat-welcome">
                  <span className="chat-welcome-icon"><Icon name="sparkles" size={20} /></span>
                  <h2>{isUploading ? 'Preparing your document...' : 'Your document needs attention'}</h2>
                  <p>{isUploading ? 'Extracting text and creating searchable document sections.' : 'We could not prepare this PDF for chat. You can try uploading it again.'}</p>
                  {error && <p className="field-error" role="alert">{error}</p>}
                  {!isUploading && <button className="button button-primary" onClick={() => { setError(''); processFile(file); }}>Retry upload</button>}
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-welcome">
                  <span className="chat-welcome-icon"><Icon name="sparkles" size={20} /></span>
                  <h2>Your document is ready</h2>
                  <p>Ask a question to explore what’s inside <strong>{file.name}</strong>.</p>
                  <div className="suggestion-list">
                    {['Summarize the key ideas', 'What should I focus on?', 'Explain a difficult concept'].map((suggestion) => <button key={suggestion} onClick={() => setQuestion(suggestion)}>{suggestion}<Icon name="arrow" size={14} /></button>)}
                  </div>
                </div>
              ) : (
                <div className="conversation">
                  {messages.map((message, index) => (
                    <div className="message-pair" key={`${message.question}-${index}`}>
                      <div className="user-message"><span className="avatar small-avatar">A</span><p>{message.question}</p></div>
                      <div className="assistant-message">
                        <span className="assistant-avatar"><Icon name="sparkles" size={15} /></span>
                        <div className="assistant-answer">
                          <ReactMarkdown>{message.answer || (isSending && index === messages.length - 1 ? 'Looking through your PDF...' : '')}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <form className="chat-composer" onSubmit={sendQuestion}>
              <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about your PDF..." aria-label="Ask a question about your PDF" maxLength={2000} disabled={!documentId || isSending} />
              <button type="submit" className="send-button" aria-label="Send question" disabled={!documentId || !question.trim() || isSending}><Icon name="send" size={17} /></button>
              <span className="composer-footnote">{error && documentId ? error : 'AI answers will be based on your uploaded document'}</span>
            </form>
          </>
        )}
      </section>
      <div className="chat-footnote"><Icon name="alert" size={15} /> AI can make mistakes. Verify important information with your source document.</div>
    </div>
  );
}
