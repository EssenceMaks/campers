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
    const tabsContainer = document.querySelector(`.${styles.tabs}`);
    if (activeElement && tabsContainer) {
      const left = activeElement.offsetLeft;
      const width = activeElement.offsetWidth;
      
      requestAnimationFrame(() => {
        tabsContainer.style.setProperty('--tab-width', `${width}px`);
        tabsContainer.style.setProperty('--tab-left', `${left}px`);
      });
    }
  };

  useEffect(() => {
    updateTabIndicator();
  }, [activeTab]);

  useEffect(() => {
    if (camper) {
      const timer = setTimeout(updateTabIndicator, 100);
      window.addEventListener('resize', updateTabIndicator);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateTabIndicator);
      };
    }
  }, [camper]);

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
            <span style={{ borderBottom: 'solid 1px black' }}>{camper.rating} ({camper.reviews?.length || 0} Reviews)</span>
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
                className={`${styles.icon} ${favoriteIds.includes(camper.id) ? styles.iconFilled : ''}`} 
              />
            </div>
          </div>
        
          <div className={styles.tabsContent}>
            {activeTab === 'features' && (
              <div className={styles.features}>
                <div className={styles.featureIcons}>
                  {Object.entries(camper.features || {}).map(([key, value]) => {
                    if (!value) return null;
                    
                    let iconName = '';
                    let label = '';
                    
                    switch(key) {
                      // Vehicle Type
                      case 'form':
                        switch(value) {
                          case 'alcove':
                            iconName = 'icon-bi_grid';
                            label = 'Alcove';
                            break;
                          case 'fullyIntegrated':
                            iconName = 'icon-bi_grid-3x3';
                            label = 'Fully Integrated';
                            break;
                          case 'panelTruck':
                            iconName = 'icon-bi_grid-1x2';
                            label = 'Panel Truck';
                            break;
                          default:
                            iconName = 'icon-bi_grid';
                            label = value;
                        }
                        break;

                      // Transmission
                      case 'transmission':
                        iconName = 'icon-diagram';
                        label = value === 'automatic' ? 'Automatic' : 'Manual';
                        break;

                      // Engine types
                      case 'engine':
                        iconName = 'icon-fuel';
                        label = value.charAt(0).toUpperCase() + value.slice(1);
                        break;

                      // Equipment
                      case 'AC':
                        iconName = 'icon-wind';
                        label = 'Air Conditioning';
                        break;
                      case 'bathroom':
                        iconName = 'icon-shower';
                        label = 'Bathroom';
                        break;
                      case 'kitchen':
                        iconName = 'icon-cup-hot';
                        label = 'Kitchen';
                        break;
                      case 'TV':
                        iconName = 'icon-tv';
                        label = 'TV';
                        break;
                      case 'radio':
                        iconName = 'icon-radio';
                        label = 'Radio';
                        break;
                      case 'refrigerator':
                        iconName = 'icon-fridge';
                        label = 'Refrigerator';
                        break;
                      case 'microwave':
                        iconName = 'icon-microwave';
                        label = 'Microwave';
                        break;
                      case 'gas':
                        iconName = 'icon-cup-hot';
                        label = 'Gas';
                        break;
                      case 'water':
                        iconName = 'icon-water';
                        label = 'Water';
                        break;
                      default:
                        iconName = `icon-${key}`;
                        label = key.charAt(0).toUpperCase() + key.slice(1);
                    }
                    
                    return (
                      <span key={key} className={styles.featureIcon}>
                        <Icon name={iconName} className={styles.icon} />
                        {label}
                      </span>
                    );
                  })}
                </div>
                <div className={styles.vehicleDetails}>Vehicle details</div>
                <div className={styles.details}>
                  <p><strong>Form</strong> {camper.form || 'Panel truck'}</p>
                  <p><strong>Length</strong> {camper.length || '5.4 m'}</p>
                  <p><strong>Width</strong> {camper.width || '2.01 m'}</p>
                  <p><strong>Height</strong> {camper.height || '2.05 m'}</p>
                  <p><strong>Tank</strong> {camper.tank || '132 l'}</p>
                  <p><strong>Consumption</strong> {camper.consumption || '12.4l/100km'}</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviews}>
                {camper.reviews && camper.reviews.length > 0 ? (
                  camper.reviews.map((review, index) => (
                    <div key={index} className={styles.review}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAuthor}>
                          {review.reviewer_name?.[0]}
                        </div>
                        <div className={styles.reviewInfo}>
                          <div className={styles.reviewName}>{review.reviewer_name}</div>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.reviewer_rating ? styles.starFilled : ''}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className={styles.reviewText}>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.noReviews}>
                    <p>No reviews yet</p>
                  </div>
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
