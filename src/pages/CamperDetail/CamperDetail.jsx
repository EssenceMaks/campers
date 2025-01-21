import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamperById } from '../../redux/slices/campersSlice';
import { toggleFavorite, selectFavorites } from '../../redux/slices/favoritesSlice';
import { selectSelectedCamper, selectCampersLoading, selectCampersError } from '../../redux/slices/campersSlice';
import Gallery from '../../components/Gallery/Gallery';
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
            <span>📍</span>
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
              {favoriteIds.includes(camper.id) ? '♥' : '♡'}
            </div>
          </div>
        
          <div className={styles.tabsContent}>
            {activeTab === 'features' && (
              <div className={styles.features}>
                <div className={styles.featureIcons}>
                  {Object.entries(camper.features || {}).map(([key, value]) => 
                    value && (
                      <span key={key}>{key}</span>
                    )
                  )}
                </div>
                <div className={styles.details}>
                  {camper.form && <p><strong>Form:</strong> {camper.form}</p>}
                  {camper.length && <p><strong>Length:</strong> {camper.length}</p>}
                  {camper.width && <p><strong>Width:</strong> {camper.width}</p>}
                  {camper.height && <p><strong>Height:</strong> {camper.height}</p>}
                  {camper.tank && <p><strong>Tank:</strong> {camper.tank}</p>}
                  {camper.consumption && <p><strong>Consumption:</strong> {camper.consumption}</p>}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviews}>
                {camper.reviews?.map((review, index) => (
                  <div key={index} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>{review.author}</span>
                      <span className={styles.reviewRating}>★ {review.rating}</span>
                    </div>
                    <p className={styles.reviewText}>{review.text}</p>
                  </div>
                ))}
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
