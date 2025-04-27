import React, { useState, useEffect, useCallback } from 'react';
import Gallery from 'react-photo-gallery';
import { Photo } from 'react-photo-gallery';
import { generateClient } from 'aws-amplify/data';
import { fetchAuthSession } from 'aws-amplify/auth';
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from '../../amplify/data/resource';

interface PhotoGalleryProps {
  title?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ title = "Photo Gallery" }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = generateClient<Schema>();

  // Fetch photos from the database and S3
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        
        // Check if the Photo model exists in the client
        if (!client.models.Photo) {
          console.warn('Photo model is not available yet. Using sample photos.');
          setPhotos(samplePhotos);
          return;
        }
        
        // Get photos from the database
        try {
          const response = await client.models.Photo.list();
          
          // For each photo, get the S3 URL
          const photosWithUrls = await Promise.all(
            response.data.map(async (photo) => {
              try {
                // Get the signed URL for the S3 object
                const s3Response = await getUrl({
                  key: photo.s3Key,
                  options: {
                    bucket: 'photo-gallery-storage-bucket',
                    accessLevel: photo.isPublic ? 'public' : 'private',
                    validateObjectExistence: true,
                    expiresIn: 3600, // URL expires in 1 hour
                  }
                });
                
                return {
                  src: s3Response.url.toString(),
                  width: photo.width,
                  height: photo.height,
                  title: photo.title,
                  alt: photo.description || photo.title,
                };
              } catch (err) {
                console.error(`Error getting URL for photo ${photo.id}:`, err);
                return null;
              }
            })
          );
          
          // Filter out any photos that failed to get URLs
          setPhotos(photosWithUrls.filter(Boolean) as Photo[]);
        } catch (err) {
          console.error('Error fetching photos from database:', err);
          // Use sample photos as fallback
          setPhotos(samplePhotos);
        }
      } catch (err) {
        console.error('Error in fetchPhotos:', err);
        setError('Failed to load photos. Please try again later.');
        
        // Use sample photos as fallback
        setPhotos(samplePhotos);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, []);

  const openLightbox = useCallback((event: React.MouseEvent, { photo, index }) => {
    // Implement lightbox functionality here if needed
    console.log('Opening photo:', photo, 'at index:', index);
  }, []);

  if (loading) {
    return <div className="loading">Loading photos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="photo-gallery-container">
      <h2>{title}</h2>
      {photos.length > 0 ? (
        <Gallery photos={photos} onClick={openLightbox} />
      ) : (
        <p>No photos found. Add some photos to get started!</p>
      )}
    </div>
  );
};

// Sample photos as fallback
const samplePhotos: Photo[] = [
  {
    src: 'https://source.unsplash.com/2ShvY8Lf6l0/800x599',
    width: 4,
    height: 3
  },
  {
    src: 'https://source.unsplash.com/Dm-qxdynoEc/800x799',
    width: 1,
    height: 1
  },
  {
    src: 'https://source.unsplash.com/qDkso9nvCg0/600x799',
    width: 3,
    height: 4
  },
  {
    src: 'https://source.unsplash.com/iecJiKe_RNg/600x799',
    width: 3,
    height: 4
  },
  {
    src: 'https://source.unsplash.com/epcsn8Ed8kY/600x799',
    width: 3,
    height: 4
  },
  {
    src: 'https://source.unsplash.com/NQSWvyVRIJk/800x599',
    width: 4,
    height: 3
  }
];

export default PhotoGallery;
