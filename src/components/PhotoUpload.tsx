import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

interface PhotoUploadProps {
  onUploadComplete?: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Generate the client outside of the handler to avoid recreation
  const client = generateClient<Schema>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.split('.')[0].replace(/[-_]/g, ' ');
        setTitle(fileName);
      }
    }
  };

  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => prev + "\n" + message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDebugInfo('Starting upload process...');
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for the photo');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      // Check if the Photo model exists in the client
      addDebugInfo('Checking client models...');
      addDebugInfo(`Available models: ${Object.keys(client.models).join(', ') || 'No models found'}`);
      
      // Get current user
      let user;
      try {
        user = await getCurrentUser();
        addDebugInfo(`Got current user: ${user.userId}`);
      } catch (userErr: any) {
        addDebugInfo(`ERROR getting user: ${userErr.message}`);
        throw userErr;
      }
      
      // Generate a unique key for the file
      const fileExtension = file.name.split('.').pop();
      const timestamp = Date.now();
      const key = `photos/${timestamp}.${fileExtension}`;
      addDebugInfo(`Generated S3 key: ${key}`);
      
      // Upload file to S3
      try {
        addDebugInfo('Starting S3 upload...');
        await uploadData({
          path: key,
          data: file,
          options: {
            onProgress: (event) => {
              if (event.total) {
                const percentage = Math.round((event.loaded / event.total) * 100);
                setProgress(percentage);
              }
            },
          },
        });
        addDebugInfo('S3 upload complete');
      } catch (uploadErr: any) {
        addDebugInfo(`ERROR uploading to S3: ${uploadErr.message}`);
        throw uploadErr;
      }
      
      // Get image dimensions
      let width = 800;
      let height = 600;
      
      try {
        addDebugInfo('Getting image dimensions...');
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            width = img.width;
            height = img.height;
            addDebugInfo(`Image dimensions: ${width}x${height}`);
            resolve();
          };
          img.onerror = () => {
            addDebugInfo('Failed to load image for dimensions, using defaults');
            resolve();
          };
          img.src = URL.createObjectURL(file);
        });
      } catch (dimErr: any) {
        addDebugInfo(`ERROR getting dimensions: ${dimErr.message}`);
        // Continue with default dimensions
      }
      
      // Save photo metadata to database using client.models approach
      try {
        addDebugInfo('Creating database record...');
        
        // Using the client directly
        try {
          addDebugInfo('Trying client.models.Photo.create...');
          
          const photoData = {
            title,
            description: description || undefined,
            s3Key: key,
            width,
            height,
            isPublic,
            owner: user.userId,
          };
          
          addDebugInfo(`Client API data: ${JSON.stringify(photoData)}`);
          
          if (client.models.Photo) {
            const result = await client.models.Photo.create(photoData);
            addDebugInfo(`Database record created with client: ${JSON.stringify(result)}`);
          } else {
            addDebugInfo('ERROR: Photo model not available in client');
            
            // Try a different approach if Photo model is not available
            addDebugInfo('Trying alternative approach with client.models...');
            const availableModels = Object.keys(client.models);
            
            if (availableModels.length > 0) {
              // Try the first available model as a test
              const firstModel = availableModels[0];
              addDebugInfo(`Testing with available model: ${firstModel}`);
              
              try {
                // Just a test to see if any model works
                const testResult = await client.models[firstModel].list();
                addDebugInfo(`Test query successful with model ${firstModel}: ${JSON.stringify(testResult)}`);
              } catch (testErr: any) {
                addDebugInfo(`Test query failed: ${testErr.message}`);
              }
            }
          }
        } catch (clientErr: any) {
          addDebugInfo(`ERROR with client method: ${clientErr.message}`);
          if (clientErr.errors) {
            addDebugInfo(`Client errors: ${JSON.stringify(clientErr.errors)}`);
          }
        }
      } catch (dbErr: any) {
        addDebugInfo(`ERROR creating database record: ${dbErr.message}`);
        throw dbErr;
      }
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setIsPublic(false);
      setProgress(0);
      addDebugInfo('Upload complete!');
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
      
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setError(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload-container">
      <h3>Upload a New Photo</h3>
      
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="photo-file">Select Photo</label>
          <input
            type="file"
            id="photo-file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="photo-title">Title</label>
          <input
            type="text"
            id="photo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="photo-description">Description (optional)</label>
          <textarea
            id="photo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
          />
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="photo-public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={uploading}
          />
          <label htmlFor="photo-public">Make this photo public</label>
        </div>
        
        {uploading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%`, height: '20px', backgroundColor: 'blue' }}></div>
            <span>{progress}%</span>
          </div>
        )}
        
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
        
        {/* Debug information */}
        {debugInfo && (
          <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', whiteSpace: 'pre-line', fontSize: '12px'}}>
            <strong>Debug Info:</strong>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default PhotoUpload;
