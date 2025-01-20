import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  searchCampers, 
  setPage, 
  resetPagination, 
  resetCampers,
  selectCampers,
  selectPagination,
  selectHasMore
} from '../../redux/slices/campersSlice';
import styles from './Catalog.module.css';

const Catalog = () => {
  const dispatch = useDispatch();
  const campers = useSelector(selectCampers);
  const pagination = useSelector(selectPagination);
  const hasMore = useSelector(selectHasMore);
  const { isLoading, error } = useSelector(state => state.campers);

  useEffect(() => {
    // Reset state when component mounts
    dispatch(resetPagination());
    dispatch(resetCampers());
    // Load first page
    dispatch(searchCampers({ page: 1 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1;
    dispatch(setPage(nextPage));
    dispatch(searchCampers({ page: nextPage }));
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.filtersColumn}>
        <h2 className={styles.filtersTitle}>Filters</h2>
        
        <div className={styles.filterSection}>
          <h3>Vehicle equipment</h3>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            AC
          </label>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            Automatic
          </label>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            Kitchen
          </label>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            TV
          </label>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            Bathroom
          </label>
        </div>

        <div className={styles.filterSection}>
          <h3>Vehicle type</h3>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            Van
          </label>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            Fully Integrated
          </label>
          <label>
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
            />
            Alcove
          </label>
        </div>

        <div className={styles.filterActions}>
          <button 
            className={styles.searchButton} 
            onClick={() => {}}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          <button 
            className={styles.resetButton} 
            onClick={() => {}}
            disabled={isLoading}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className={styles.variantsColumn}>
        <div className={styles.campersList}>
          {campers.map((camper) => (
            <div key={camper.id} className={styles.camperCard}>
              <div className={styles.cardImageContainer}>
                <img 
                  src={camper.mainImage || 'https://via.placeholder.com/300x200?text=No+Image'} 
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
                    <span className={styles.price}>€{camper.price}</span>
                    <button className={styles.heartButton}>♡</button>
                  </div>
                </div>
                <div className={styles.location}>
                  <span className={styles.rating}>★ {camper.rating}</span>
                  <span className={styles.locationText}>{camper.location}</span>
                </div>
                <div className={styles.features}>
                  {camper.features.transmission === 'automatic' && (
                    <span className={styles.feature}>Automatic</span>
                  )}
                  {camper.features.engine === 'petrol' && (
                    <span className={styles.feature}>Petrol</span>
                  )}
                  {camper.features.kitchen && (
                    <span className={styles.feature}>Kitchen</span>
                  )}
                  {camper.features.AC && (
                    <span className={styles.feature}>AC</span>
                  )}
                </div>
                <Link to={`/camper/${camper.id}`} className={styles.showMore}>
                  Show more
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {isLoading && <div className={styles.loading}>Loading...</div>}
        
        {!isLoading && hasMore && (
          <button 
            className={styles.loadMoreButton}
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Catalog;
