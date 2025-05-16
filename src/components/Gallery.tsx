import React, { useState, useEffect, useCallback, memo } from 'react';
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
  thumbnailSrc?: string; // Added for thumbnails
}

interface PhotoGalleryProps {
  title?: string;
}

// Create a memoized photo album component to prevent unnecessary re-renders
const MemoizedPhotoAlbum = memo(({ photos, openLightbox }: { 
  photos: any[], 
  openLightbox: (event: React.MouseEvent | null, { photo, index }: { photo: PhotoType; index: number }) => void 
}) => (
  <PhotoAlbum 
    photos={photos} 
    layout="rows"
    onClick={({ photo, index }) => openLightbox(null, { photo, index })} 
    sizes={{
      size: "calc(100vw - 40px)",
      sizes: [
        { viewport: "(max-width: 640px)", size: "calc(100vw - 16px)" },
        { viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" },
        { viewport: "(max-width: 1600px)", size: "calc(100vw - 40px)" },
      ],
    }}
  />
));

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ title = "Photo Gallery" }) => {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = generateClient<Schema>();

  // Fetch photos from the database and S3
  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        
        // Check if the Photo model exists in the client
        if (!client.models.Photo) {
          console.warn('Photo model is not available yet. Using sample photos.');
          if (isMounted) setPhotos(samplePhotos);
          return;
        }
        
        // Get photos from the database
        try {
          const response = await client.models.Photo.list();
          
          if (!isMounted) return;
          
          // Process photos in batches to avoid blocking the main thread
          const processPhotoBatch = async (batch: any[], startIndex: number) => {
            const processedBatch = await Promise.all(
              batch.map(async (photo) => {
                try {
                  if (!photo.s3Key) return null;
                  
                  // Get the signed URL for the S3 object
                  const s3Response = await getUrl({
                    path: `photos/${photo.s3Key.split('/').slice(1).join('/')}`,
                    options: {
                      validateObjectExistence: true,
                      expiresIn: 3600, // URL expires in 1 hour
                    }
                  });
                  
                  // Get thumbnail URL if available
                  let thumbnailSrc = undefined;
                  if (photo.thumbnailKey) {
                    try {
                      const thumbnailResponse = await getUrl({
                        path: `photos/${photo.thumbnailKey.split('/').slice(1).join('/')}`,
                        options: {
                          validateObjectExistence: true,
                          expiresIn: 3600,
                        }
                      });
                      thumbnailSrc = thumbnailResponse.url.toString();
                    } catch (thumbnailError) {
                      console.warn(`Could not get thumbnail for ${photo.id}:`, thumbnailError);
                    }
                  }
                  
                  return {
                    src: s3Response.url.toString(),
                    width: photo.width || 800,
                    height: photo.height || 600,
                    title: photo.title,
                    alt: photo.description || photo.title,
                    thumbnailSrc: thumbnailSrc,
                  };
                } catch (err) {
                  console.error(`Error getting URL for photo ${photo.id}:`, err);
                  return null;
                }
              })
            );
            
            if (isMounted) {
              // Update photos state with processed batch
              setPhotos(prevPhotos => {
                const newPhotos = [...prevPhotos];
                processedBatch.forEach((photo, index) => {
                  if (photo) newPhotos[startIndex + index] = photo;
                });
                return newPhotos.filter(Boolean) as PhotoType[];
              });
            }
          };
          
          // Initialize photos array with placeholders
          if (isMounted) {
            setPhotos(new Array(response.data.length).fill(null));
          }
          
          // Process photos in batches of 5
          const batchSize = 5;
          for (let i = 0; i < response.data.length; i += batchSize) {
            const batch = response.data.slice(i, i + batchSize);
            await processPhotoBatch(batch, i);
          }
          
        } catch (err) {
          console.error('Error fetching photos from database:', err);
          // Use sample photos as fallback
          if (isMounted) setPhotos(samplePhotos);
        }
      } catch (err) {
        console.error('Error in fetchPhotos:', err);
        if (isMounted) {
          setError('Failed to load photos. Please try again later.');
          // Use sample photos as fallback
          setPhotos(samplePhotos);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchPhotos();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [client.models.Photo]);

  const openLightbox = useCallback((_: React.MouseEvent | null, { photo, index }: { photo: PhotoType; index: number }) => {
    // Implement lightbox functionality here if needed
    console.log('Opening photo:', photo, 'at index:', index);
  }, []);

  if (loading) {
    return <div className="loading" aria-live="polite">Loading photos...</div>;
  }

  if (error) {
    return <div className="error" role="alert">{error}</div>;
  }

  // Prepare photos for the album, using thumbnails for srcSet if available
  const albumPhotos = photos.map(photo => ({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
    title: photo.title,
    srcSet: photo.thumbnailSrc ? [
      { src: photo.thumbnailSrc, width: 200, height: 200 }
    ] : undefined,
  }));

  return (
    <div className="photo-gallery-container">
      <h2>{title}</h2>
      {photos.length > 0 ? (
        <MemoizedPhotoAlbum photos={albumPhotos} openLightbox={openLightbox} />
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
