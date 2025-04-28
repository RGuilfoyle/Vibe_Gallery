import { useState } from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import PhotoGallery from "./components/Gallery";
import PhotoUpload from "./components/PhotoUpload";
import '@aws-amplify/ui-react/styles.css';

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
            >
              Photo Gallery
            </button>
            <button 
              className={activeTab === 'upload' ? 'active' : ''} 
              onClick={() => setActiveTab('upload')}
            >
              Upload Photo
            </button>
          </div>

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
        </main>
      )}
    </Authenticator>
  );
}

export default App;