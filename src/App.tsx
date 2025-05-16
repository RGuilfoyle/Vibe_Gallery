import { useState, lazy, Suspense } from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Lazy load components for better initial load performance
const PhotoGallery = lazy(() => import("./components/Gallery"));
const PhotoUpload = lazy(() => import("./components/PhotoUpload"));

function App() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadComplete = () => {
    // Trigger gallery refresh when upload completes
    setRefreshGallery(prev => prev + 1);
    // Switch to gallery tab
    setActiveTab('gallery');
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div className="app-header">
            <h1>Vibe Gallery</h1>
            {user && (
              <div className="user-info">
                <span>Welcome, {user.username}</span>
                <button onClick={signOut}>Sign out</button>
              </div>
            )}
          </div>
          
          <div className="tabs">
            <button 
              className={activeTab === 'gallery' ? 'active' : ''} 
              onClick={() => setActiveTab('gallery')}
              aria-pressed={activeTab === 'gallery'}
            >
              Photo Gallery
            </button>
            <button 
              className={activeTab === 'upload' ? 'active' : ''} 
              onClick={() => setActiveTab('upload')}
              aria-pressed={activeTab === 'upload'}
            >
              Upload Photo
            </button>
          </div>

          <Suspense fallback={<div className="loading">Loading...</div>}>
            {activeTab === 'gallery' && (
              <div className="gallery-container">
                <PhotoGallery title="My Photos" key={refreshGallery} />
              </div>
            )}
            
            {activeTab === 'upload' && (
              <div className="upload-container">
                <PhotoUpload onUploadComplete={handleUploadComplete} />
              </div>
            )}
          </Suspense>
        </main>
      )}
    </Authenticator>
  );
}

export default App;