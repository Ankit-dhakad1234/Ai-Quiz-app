import React, { useRef, useState } from 'react';
import Icon from '../components/Icon';

export default function PdfChatScreen() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
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
  };

  const sendQuestion = (event) => {
    event.preventDefault();
    const value = question.trim();
    if (!value || !file) return;
    setMessages((previous) => [...previous, { question: value }]);
    setQuestion('');
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
            <button className="button button-primary" onClick={() => inputRef.current?.click()}><Icon name="upload" size={17} /> Upload a PDF</button>
            <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" onChange={(event) => selectFile(event.target.files[0])} />
            {error && <p className="field-error" role="alert">{error}</p>}
          </div>
        ) : (
          <>
            <div className="chat-document-bar">
              <div className="chat-document"><span className="pdf-file-icon"><Icon name="file" /></span><div><strong>{file.name}</strong><span>PDF document</span></div></div>
              <button className="text-button" onClick={() => { setFile(null); setMessages([]); }}>Change document <Icon name="close" size={15} /></button>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
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
                      <div className="assistant-message"><span className="assistant-avatar"><Icon name="sparkles" size={15} /></span><p>PDF Q&amp;A will be available once document processing is connected. Your question is ready to send when the AI service is enabled.</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <form className="chat-composer" onSubmit={sendQuestion}>
              <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about your PDF..." aria-label="Ask a question about your PDF" />
              <button type="submit" className="send-button" aria-label="Send question" disabled={!question.trim()}><Icon name="send" size={17} /></button>
              <span className="composer-footnote">AI answers will be based on your uploaded document</span>
            </form>
          </>
        )}
      </section>
      <div className="chat-footnote"><Icon name="alert" size={15} /> AI can make mistakes. Verify important information with your source document.</div>
    </div>
  );
}
