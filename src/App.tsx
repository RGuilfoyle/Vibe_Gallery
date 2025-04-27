import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import PhotoGallery from "./components/Gallery";
import PhotoUpload from "./components/PhotoUpload";
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'todos'>('gallery');
  const [refreshGallery, setRefreshGallery] = useState(0);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

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
            <button 
              className={activeTab === 'todos' ? 'active' : ''} 
              onClick={() => setActiveTab('todos')}
            >
              Todos
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
          
          {activeTab === 'todos' && (
            <div className="todos-container">
              <h2>My todos</h2>
              <button onClick={createTodo}>+ new</button>
              <ul>
                {todos.map((todo) => (
                  <li key={todo.id}>{todo.content}</li>
                ))}
              </ul>
              <div>
                🥳 App successfully hosted. Try creating a new todo.
                <br />
                <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                  Review next step of this tutorial.
                </a>
              </div>
            </div>
          )}
        </main>
      )}
    </Authenticator>
  );
}

export default App;
