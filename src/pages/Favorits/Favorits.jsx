import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import { 
  searchCampers,
  selectCampers,
  resetPagination,
  resetCampers
} from '../../redux/slices/campersSlice';
import {
  toggleFavorite,
  toggleShowFavorites,
  selectFavorites,
  selectShowFavorites,
  setShowFavorites
} from '../../redux/slices/favoritesSlice';
import styles from './Favorits.module.css';

const Catalog = () => {
  const dispatch = useDispatch();
  const campers = useSelector(selectCampers);
  const favoriteIds = useSelector(selectFavorites);
  const showFavorites = useSelector(selectShowFavorites);
  const { error } = useSelector(state => state.campers);

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(resetCampers());
    dispatch(searchCampers({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setShowFavorites(true));
    return () => {
      dispatch(setShowFavorites(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (showFavorites) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1, loadAll: true }));
    }
  }, [dispatch, showFavorites]);

  const filteredCampers = useMemo(() => {
    if (!campers) return [];
    if (showFavorites) {
      return campers.filter(camper => favoriteIds.includes(camper.id));
    }
    return campers;
  }, [campers, showFavorites, favoriteIds]);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.variantsColumn}>
        {showFavorites && (
          <div className={styles.favoritesHeader}>
            <h2>Favorites ({favoriteIds.length})</h2>
          </div>
        )}
        <div className={styles.campersGrid}>
          {filteredCampers.map((camper) => (
            <div key={camper.id} className={styles.camperCard}>
              <div className={styles.cardImageContainer}>
                <img 
                  src={camper.mainImage} 
                  alt={camper.name} 
                  className={styles.camperImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
              <div className={styles.camperInfo}>
                <div className={styles.camperHeader}>
                  <h3>{camper.name}</h3>
                  <div className={styles.priceHeart}>
                    <span className={styles.price}>€{camper.price.toFixed(2)}</span>
                    <button 
                      className={`${styles.heartButton} ${favoriteIds.includes(camper.id) ? styles.heartActive : ''}`}
                      onClick={() => dispatch(toggleFavorite(camper.id))}
                    >
                      {favoriteIds.includes(camper.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
                <div className={styles.location}>
                  <span className={styles.rating}>★ {camper.rating}</span>
                  <span className={styles.reviewsCount}>({camper.reviews} {camper.reviews === 1 ? 'Review' : 'Reviews'})</span>
                  <span className={styles.locationText}>{camper.location}</span>
                </div>
                <p className={styles.description}>{camper.description}</p>
                <div className={styles.features}>
                  {camper.features?.AC && (
                    <span className={styles.feature}>
                      <Icon name="icon-wind" />
                      Air Condit..
                    </span>
                  )}
                  {camper.features?.bathroom && (
                    <span className={styles.feature}>
                      <Icon name="icon-shower" />
                      Bathroom
                    </span>
                  )}
                  {camper.features?.kitchen && (
                    <span className={styles.feature}>
                      <Icon name="icon-cup-hot" />
                      Kitchen
                    </span>
                  )}
                  {camper.features?.TV && (
                    <span className={styles.feature}>
                      <Icon name="icon-tv" />
                      TV
                    </span>
                  )}
                  {camper.features?.radio && (
                    <span className={styles.feature}>
                      <Icon name="icon-radio" />
                      Radio
                    </span>
                  )}
                  {camper.features?.refrigerator && (
                    <span className={styles.feature}>
                      <Icon name="icon-fridge" />
                      Refrigerator
                    </span>
                  )}
                  {camper.features?.microwave && (
                    <span className={styles.feature}>
                      <Icon name="icon-microwave" />
                      Microwave
                    </span>
                  )}
                  {camper.features?.gas && (
                    <span className={styles.feature}>
                      <Icon name="icon-gas" />
                      Gas
                    </span>
                  )}
                  {camper.features?.water && (
                    <span className={styles.feature}>
                      <Icon name="icon-water" />
                      Water
                    </span>
                  )}
                  {camper.form && (
                    <span className={styles.feature}>
                      <Icon name={
                        camper.form === 'alcove' ? 'icon-bi_grid' :
                        camper.form === 'fullyIntegrated' ? 'icon-bi_grid-3x3' :
                        'icon-bi_grid-1x2'
                      } />
                      {camper.form === 'fullyIntegrated' ? 'Integrated' :
                       camper.form === 'panelTruck' ? 'Van' :
                       'Alcove'}
                    </span>
                  )}
                  {camper.features?.engine && (
                    <span className={styles.feature}>
                      <Icon name="icon-fuel" />
                      {camper.features.engine}
                    </span>
                  )}
                  {camper.features?.transmission && (
                    <span className={styles.feature}>
                      <Icon name="icon-diagram" />
                      {camper.features.transmission}
                    </span>
                  )}
                </div>
                <a 
                  href={`/catalog/${camper.id}`}
                  className={styles.showMore}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Show more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
