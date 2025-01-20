import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchCampers, setFilter, resetFilters } from '../../redux/slices/campersSlice';
import styles from './Catalog.module.css';

const Catalog = () => {
  const dispatch = useDispatch();
  const { items, status, hasMore, filters, error, total } = useSelector((state) => state.campers);

  const handleSearch = useCallback(() => {
    dispatch(searchCampers({ page: 1, filters }));
  }, [dispatch, filters]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleLoadMore = () => {
    const nextPage = Math.floor(items.length / 4) + 1;
    dispatch(searchCampers({ page: nextPage, filters }));
  };

  const handleFilterChange = (category, name) => {
    dispatch(setFilter({ category, name, value: !filters[category][name] }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  if (status === 'failed') {
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
              checked={filters.equipment.ac}
              onChange={() => handleFilterChange('equipment', 'ac')}
            />
            AC
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.equipment.automatic}
              onChange={() => handleFilterChange('equipment', 'automatic')}
            />
            Automatic
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.equipment.kitchen}
              onChange={() => handleFilterChange('equipment', 'kitchen')}
            />
            Kitchen
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.equipment.tv}
              onChange={() => handleFilterChange('equipment', 'tv')}
            />
            TV
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.equipment.bathroom}
              onChange={() => handleFilterChange('equipment', 'bathroom')}
            />
            Bathroom
          </label>
        </div>

        <div className={styles.filterSection}>
          <h3>Vehicle type</h3>
          <label>
            <input
              type="checkbox"
              checked={filters.vehicleType.van}
              onChange={() => handleFilterChange('vehicleType', 'van')}
            />
            Van
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.vehicleType.fullyIntegrated}
              onChange={() => handleFilterChange('vehicleType', 'fullyIntegrated')}
            />
            Fully Integrated
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.vehicleType.alcove}
              onChange={() => handleFilterChange('vehicleType', 'alcove')}
            />
            Alcove
          </label>
        </div>

        <div className={styles.filterActions}>
          <button 
            className={styles.searchButton} 
            onClick={handleSearch}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Searching...' : 'Search'}
          </button>
          <button 
            className={styles.resetButton} 
            onClick={handleResetFilters}
            disabled={status === 'loading'}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className={styles.variantsColumn}>
        {status === 'loading' && items.length === 0 ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.campersGrid}>
              {items.map((camper) => (
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
            
            {status === 'loading' && items.length > 0 && (
              <div className={styles.loading}>Loading more...</div>
            )}
            
            {hasMore && status !== 'loading' && items.length > 0 && (
              <button 
                className={styles.loadMore} 
                onClick={handleLoadMore}
                disabled={status === 'loading'}
              >
                Load more
              </button>
            )}

            {items.length === 0 && status === 'succeeded' && (
              <div className={styles.noResults}>No campers found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;
