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

  const client = generateClient<Schema>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Get current user
      const user = await getCurrentUser();
      
      // Generate a unique key for the file
      const fileExtension = file.name.split('.').pop();
      const key = `photos/${user.userId}/${Date.now()}.${fileExtension}`;
      
      // Create a thumbnail version if it's an image
      let thumbnailKey = null;
      if (file.type.startsWith('image/')) {
        thumbnailKey = `thumbnails/${user.userId}/${Date.now()}.${fileExtension}`;
      }
      
      // Upload file to S3
      const uploadResult = await uploadData({
        key,
        data: file,
        options: {
          bucket: 'photo-gallery-storage-bucket',
          accessLevel: isPublic ? 'public' : 'private',
          onProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        },
      });
      
      // Create image dimensions (you might want to use an actual image library to get real dimensions)
      // For now, we'll create a placeholder
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          resolve();
        };
      });
      
      // Save photo metadata to database
      await client.models.Photo.create({
        title,
        description: description || undefined,
        s3Key: key,
        width: img.width,
        height: img.height,
        isPublic,
        owner: user.userId,
      });
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setIsPublic(false);
      setProgress(0);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
      
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload-container">
      <h3>Upload a New Photo</h3>
      
      {error && <div className="error-message">{error}</div>}
      
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
          {file && <div className="file-name">{file.name}</div>}
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
            <div className="progress" style={{ width: `${progress}%` }}></div>
            <span>{progress}%</span>
          </div>
        )}
        
        <button type="submit" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
};

export default PhotoUpload;

export default PhotoUpload;
