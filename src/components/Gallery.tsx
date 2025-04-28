import React, { useState, useEffect, useCallback } from 'react';
import PhotoAlbum from 'react-photo-album';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from '../../amplify/data/resource';

// Define the Photo type that matches react-photo-album's requirements
interface PhotoType {
  src: string;
  width: number;
  height: number;
  title?: string;
  alt?: string;
}

interface PhotoGalleryProps {
  title?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ title = "Photo Gallery" }) => {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
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
                if (!photo.s3Key) {
                  return null;
                }
                
                // Get the signed URL for the S3 object
                const s3Response = await getUrl({
                  path: photo.s3Key,
                  options: {
                    bucket: 'photo-gallery-storage-bucket',
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
          setPhotos(photosWithUrls.filter(Boolean) as PhotoType[]);
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
  }, [client.models.Photo]);

  const openLightbox = useCallback((_: React.MouseEvent | null, { photo, index }: { photo: PhotoType; index: number }) => {
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
        <PhotoAlbum 
          photos={photos} 
          layout="rows"
          onClick={({ photo, index }) => openLightbox(null, { photo, index })} 
        />
      ) : (
        <p>No photos found. Add some photos to get started!</p>
      )}
    </div>
  );
};

// Sample photos as fallback
const samplePhotos: PhotoType[] = [
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
