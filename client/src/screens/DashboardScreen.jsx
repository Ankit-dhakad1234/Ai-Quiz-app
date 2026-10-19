import React from 'react';
import Icon from '../components/Icon';

const activities = [
  { title: 'Data Structures Quiz', detail: 'General Quiz · 10 questions', score: '8/10', time: '2 hours ago', icon: 'sparkles', tone: 'violet', page: 'general' },
  { title: 'Machine Learning Notes', detail: 'Chat with PDF · 15 questions', score: '12/15', time: '1 day ago', icon: 'file', tone: 'teal', page: 'pdf-chat' },
  { title: 'Operating Systems Book', detail: 'PDF Quiz · 5 questions', score: '4/5', time: '3 days ago', icon: 'book', tone: 'orange', page: 'pdf-quiz' },
];

export default function DashboardScreen({ onNavigate, showHistory = false }) {
  return (
    <div className="dashboard">
      <div className="welcome-row">
        <div>
          <div className="eyebrow"><span className="status-dot" /> YOUR LEARNING SPACE</div>
          <h1>{showHistory ? 'Your recent activity' : 'Welcome back, Alex'}<span className="wave">✦</span></h1>
          <p>{showHistory ? 'Pick up where you left off and keep your momentum going.' : 'Your personal AI learning workspace'}</p>
        </div>
        <button className="button button-quiet" onClick={() => onNavigate('general')}><Icon name="sparkles" /> Quick quiz</button>
      </div>

      <div className="feature-grid">
        <button className="feature-card feature-purple" onClick={() => onNavigate('general')}>
          <span className="feature-icon"><Icon name="sparkles" size={21} /></span>
          <span className="feature-arrow"><Icon name="arrow" size={16} /></span>
          <strong>General AI Quiz</strong>
          <span className="feature-description">Generate quizzes on any topic with AI. Perfect for quick learning and revision.</span>
          <span className="feature-cta"><Icon name="arrow" size={17} /></span>
        </button>
        <button className="feature-card feature-green" onClick={() => onNavigate('pdf-quiz')}>
          <span className="feature-icon"><Icon name="file" size={21} /></span>
          <span className="feature-arrow"><Icon name="arrow" size={16} /></span>
          <strong>Quiz from PDF</strong>
          <span className="feature-description">Upload your notes or textbook and generate a custom quiz from the content.</span>
          <span className="feature-cta"><Icon name="arrow" size={17} /></span>
        </button>
        <button className="feature-card feature-pink" onClick={() => onNavigate('pdf-chat')}>
          <span className="feature-icon"><Icon name="message" size={21} /></span>
          <span className="feature-arrow"><Icon name="arrow" size={16} /></span>
          <strong>Chat with PDF</strong>
          <span className="feature-description">Ask questions about your documents and get accurate answers with citations.</span>
          <span className="feature-cta"><Icon name="arrow" size={17} /></span>
        </button>
      </div>

      <section className="activity-panel">
        <div className="section-heading">
          <div><h2>{showHistory ? 'All activity' : 'Recent activity'}</h2><p>Your learning journey at a glance</p></div>
          <button className="text-button" onClick={() => onNavigate(showHistory ? 'dashboard' : 'history')}>
            {showHistory ? 'Back to home' : 'View all'} <Icon name="arrow" size={14} />
          </button>
        </div>
        <div className="activity-list">
          {activities.map((activity) => (
            <button className="activity-row" key={activity.title} onClick={() => onNavigate(activity.page)}>
              <span className={`activity-icon ${activity.tone}`}><Icon name={activity.icon} size={17} /></span>
              <span className="activity-copy"><strong>{activity.title}</strong><span>{activity.detail}</span></span>
              <span className="activity-score"><Icon name="check" size={12} /> Score: {activity.score}</span>
              <span className="activity-time">{activity.time}</span>
              <Icon className="activity-chevron" name="chevron" size={16} />
            </button>
          ))}
        </div>
      </section>

      <div className="dashboard-footer">
        <span><Icon name="sparkles" size={14} /> Small steps make big progress.</span>
        <span>Keep your streak alive today</span>
      </div>
    </div>
  );
}
