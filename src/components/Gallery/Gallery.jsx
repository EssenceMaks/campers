import { useState } from 'react';
import styles from './Gallery.module.css';

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      {images.map((image, index) => (
        <div key={index} className={styles.imageWrapper}>
          <div
            className={styles.imageContainer}
            onClick={() => handleImageClick(index)}
          >
            <img 
              src={image.original || image.thumbnail} 
              alt={`Gallery image ${index + 1}`}
              className={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={`${styles.modalButton} ${styles.closeButton}`} 
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <span>×</span>
            </button>
            <button 
              className={`${styles.modalButton} ${styles.prevButton}`} 
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <span>‹</span>
            </button>
            <img
              src={images[selectedImage].original || images[selectedImage].thumbnail}
              alt={`Full size image ${selectedImage + 1}`}
              className={styles.modalImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
            />
            <button 
              className={`${styles.modalButton} ${styles.nextButton}`} 
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <span>›</span>  
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
