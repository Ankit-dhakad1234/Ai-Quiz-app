import React, { useState } from 'react';
import { QuizProvider } from './context/QuizContext';
import { useQuiz } from './hooks/useQuiz';
import TopicScreen from './screens/TopicScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import DashboardScreen from './screens/DashboardScreen';
import PdfQuizScreen from './screens/PdfQuizScreen';
import PdfChatScreen from './screens/PdfChatScreen';
import Icon from './components/Icon';

const navigation = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'general', label: 'General Quiz', icon: 'sparkles' },
  { id: 'pdf-quiz', label: 'PDF Quiz', icon: 'file' },
  { id: 'pdf-chat', label: 'Chat with PDF', icon: 'message' },
  { id: 'documents', label: 'My Documents', icon: 'folder' },
  { id: 'history', label: 'History', icon: 'clock' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

function AppContent() {
  const { quizState, dispatch } = useQuiz();
  const [page, setPage] = useState('dashboard');
  const [isLight, setIsLight] = useState(false);

  const navigate = (nextPage) => {
    if (nextPage === 'documents') {
      setPage('pdf-quiz');
      return;
    }
    setPage(nextPage);
  };

  const renderPage = () => {
    if (quizState.error && page === 'general') {
      return (
        <div className="notice-card" role="alert">
          <span className="notice-icon"><Icon name="alert" /></span>
          <div>
            <h2>We couldn’t start your quiz</h2>
            <p>{quizState.error}</p>
            <button className="button button-primary" onClick={() => dispatch({ type: 'RESET_QUIZ' })}>
              Back to topics
            </button>
          </div>
        </div>
      );
    }

    if (page === 'dashboard') return <DashboardScreen onNavigate={navigate} />;
    if (page === 'general') {
      if (quizState.isLoading) {
        return <div className="loading-card"><span className="spinner" /><p>Generating your quiz...</p></div>;
      }
      if (quizState.questions.length === 0) return <TopicScreen />;
      if (quizState.currentQuestionIndex < quizState.questions.length) return <QuizScreen />;
      return <ResultsScreen />;
    }
    if (page === 'pdf-quiz') return <PdfQuizScreen />;
    if (page === 'pdf-chat') return <PdfChatScreen />;
    if (page === 'history') return <DashboardScreen onNavigate={navigate} showHistory />;
    return <DashboardScreen onNavigate={navigate} />;
  };

  const currentNavigation = page === 'history' ? 'history' : page;
  const pageTitle = navigation.find((item) => item.id === currentNavigation)?.label || 'Home';

  return (
    <div className={`app-shell${isLight ? ' light-theme' : ''}`}>
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('dashboard')} aria-label="LearnAI home">
          <span className="brand-mark"><Icon name="sparkles" /></span>
          <span>Learn<span className="brand-accent">AI</span></span>
        </button>
        <nav className="side-navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item${currentNavigation === item.id ? ' active' : ''}`}
              key={item.id}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Icon name="sparkles" /></div>
            <strong>Upgrade to Pro</strong>
            <p>Get more quizzes, larger PDF support and more.</p>
            <button className="button upgrade-button" onClick={() => navigate('pdf-quiz')}>Explore Pro</button>
          </div>
          <div className="sidebar-profile">
            <div className="avatar">A</div>
            <div><strong>Alex Morgan</strong><span>Free plan</span></div>
            <Icon name="chevron" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" /><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Icon name="search" />
              <input type="search" aria-label="Search" placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button theme-button" onClick={() => setIsLight(!isLight)} aria-label="Toggle color theme">
              <Icon name={isLight ? 'moon' : 'sun'} />
            </button>
            <button className="avatar avatar-button" aria-label="Open profile">A</button>
          </div>
        </header>
        <section className="page-content" key={page}>
          {page !== 'dashboard' && (
            <button className="button button-quiet workspace-back-button" onClick={() => navigate('dashboard')}>
              <Icon name="arrow" size={16} className="back-arrow" />
              Back to dashboard
            </button>
          )}
          {renderPage()}
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}

export default App;
