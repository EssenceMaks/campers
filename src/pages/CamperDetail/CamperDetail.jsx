import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamperById } from '../../redux/slices/campersSlice';
import { toggleFavorite, selectFavorites } from '../../redux/slices/favoritesSlice';
import { selectSelectedCamper, selectCampersLoading, selectCampersError } from '../../redux/slices/campersSlice';
import Gallery from '../../components/Gallery/Gallery';
import Icon from '../../components/Icon/Icon';
import styles from './CamperDetail.module.css';

const CamperDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavorites);
  const camper = useSelector(selectSelectedCamper);
  const isLoading = useSelector(selectCampersLoading);
  const error = useSelector(selectCampersError);
  const [activeTab, setActiveTab] = useState('features');
  
  useEffect(() => {
    if (id) {
      dispatch(fetchCamperById(id));
    }
  }, [dispatch, id]);

  const updateTabIndicator = () => {
    const activeElement = document.querySelector(`.${styles.activeTab}`);
    if (activeElement) {
      const tabsContainer = document.querySelector(`.${styles.tabs}`);
      const left = activeElement.offsetLeft;
      const width = activeElement.offsetWidth;
      
      tabsContainer.style.setProperty('--tab-width', `${width}px`);
      tabsContainer.style.setProperty('--tab-left', `${left}px`);
    }
  };

  useEffect(() => {
    updateTabIndicator();
  }, [activeTab]);

  // Инициализация подчеркивания при монтировании
  useEffect(() => {
    // Небольшая задержка, чтобы DOM успел обновиться
    const timer = setTimeout(updateTabIndicator, 0);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!camper) {
    return <div className={styles.error}>Camper not found</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.mainblock}>
        <div className={styles.title}>{camper.name}
        </div>
        <div className={styles.locationContainer}>
          <div className={styles.reviewsrating}>
            <span>★</span>
            <span>{camper.rating} ({camper.reviews?.length || 0} Reviews)</span>
          </div>
          <div className={styles.location}>
            <Icon name="icon-map" className={styles.locationIcon} />
            <span>{camper.location}</span>
          </div>
        </div>
        <div className={styles.price}>€{Number(camper.price).toFixed(2)}</div>
        <div className={styles.pictures}>
          <Gallery images={camper.gallery || []} />
        </div>
        <div className={styles.description}>
          <p>{camper.description}</p>
        </div>

        <div className={styles.containerTabs}>
          <div className={styles.tabs}>
            <ul className={styles.tabsList}>
              <li 
                className={activeTab === 'features' ? styles.activeTab : ''}
                onClick={() => setActiveTab('features')}
              >
                Features
              </li>
              <li 
                className={activeTab === 'reviews' ? styles.activeTab : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </li>
            </ul>
            <div className={styles.favoriteIcon} onClick={() => dispatch(toggleFavorite(camper.id))}>
              {!favoriteIds.includes(camper.id) && <span className={styles.favoriteText}>Add to favorites</span>}
              <Icon 
                name="icon-heart" 
                className={`${styles.icon} ${favoriteIds.includes(camper.id) ? styles.iconActive : ''}`} 
              />
            </div>
          </div>
        
          <div className={styles.tabsContent}>
            {activeTab === 'features' && (
              <div className={styles.features}>
                <div className={styles.featureIcons}>
                  {Object.entries(camper.features || {}).map(([key, value]) => 
                    value && (
                      <span key={key} className={styles.featureIcon}>
                        <Icon name={`icon-${key}`} className={styles.icon} />
                        {key === 'transmission' && 'Automatic'}
                        {key === 'AC' && 'AC'}
                        {key === 'engine' && 'Petrol'}
                        {key === 'kitchen' && 'Kitchen'}
                        {key === 'radio' && 'Radio'}
                      </span>
                    )
                  )}
                </div>
                <div className={styles.details}>
                  <p><strong>Form:</strong> {camper.form || 'Panel truck'}</p>
                  <p><strong>Length:</strong> {camper.length || '5.4 m'}</p>
                  <p><strong>Width:</strong> {camper.width || '2.01 m'}</p>
                  <p><strong>Height:</strong> {camper.height || '2.05 m'}</p>
                  <p><strong>Tank:</strong> {camper.tank || '132 l'}</p>
                  <p><strong>Consumption:</strong> {camper.consumption || '12.4l/100km'}</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviews}>
                {(camper.reviews || []).map((review, index) => (
                  <div key={index} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>
                        {String.fromCharCode(65 + index)} {/* A, B, C, ... */}
                      </span>
                      <div className={styles.stars}>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className={styles.reviewText}>{review.text}</p>
                  </div>
                ))}
                {(!camper.reviews || camper.reviews.length === 0) && (
                  <p className={styles.noReviews}>No reviews yet</p>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.bookingForm}>
            <h3>Book your campervan now</h3>
            <p>Stay connected! We are always ready to help you.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Здесь будет логика отправки формы
            }}>
              <input type="text" name="name" placeholder="Name*" required />
              <input type="email" name="email" placeholder="Email*" required />
              <input type="date" name="date" required />
              <textarea name="comment" placeholder="Comment"></textarea>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
      
    </main>
  );
};

export default CamperDetail;
