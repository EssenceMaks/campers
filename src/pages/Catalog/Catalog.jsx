import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  searchCampers, 
  setLocationFilter,
  setEquipmentFilter,
  setVehicleTypeFilter,
  resetFilters,
  setPage, 
  resetPagination, 
  resetCampers,
  selectCampers,
  selectPagination,
  selectHasMore
} from '../../redux/slices/campersSlice';
import {
  searchLocations,
  clearSuggestions,
  selectLocationSuggestions,
  selectLocationsLoading
} from '../../redux/slices/locationsSlice';
import styles from './Catalog.module.css';

const Catalog = () => {
  const dispatch = useDispatch();
  const campers = useSelector(selectCampers);
  const pagination = useSelector(selectPagination);
  const hasMore = useSelector(selectHasMore);
  const { isLoading, error, filters } = useSelector(state => state.campers);
  const locationSuggestions = useSelector(selectLocationSuggestions);
  const isLoadingLocations = useSelector(selectLocationsLoading);
  
  const [locationInput, setLocationInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(resetCampers());
    dispatch(searchCampers({ page: 1 }));
  }, [dispatch]);

  const handleLocationInputChange = useCallback((e) => {
    const value = e.target.value;
    setLocationInput(value);
    setShowSuggestions(true);
    
    if (value.length >= 2) {
      dispatch(searchLocations(value));
    } else {
      dispatch(clearSuggestions());
    }
  }, [dispatch]);

  const handleLocationSelect = (location) => {
    setLocationInput(location);
    setShowSuggestions(false);
    dispatch(setLocationFilter(location));
    dispatch(resetPagination());
    dispatch(searchCampers({ page: 1 }));
  };

  const handleEquipmentChange = (name) => {
    dispatch(setEquipmentFilter({ name, value: !filters.equipment[name] }));
    dispatch(resetPagination());
    dispatch(searchCampers({ page: 1 }));
  };

  const handleVehicleTypeChange = (name) => {
    dispatch(setVehicleTypeFilter({ name, value: !filters.vehicleType[name] }));
    dispatch(resetPagination());
    dispatch(searchCampers({ page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocationInput('');
    dispatch(resetPagination());
    dispatch(searchCampers({ page: 1 }));
  };

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
        
        {/* Location Filter */}
        <div className={styles.filterSection}>
          <h3>Location</h3>
          <div className={styles.locationInputContainer}>
            <input
              type="text"
              value={locationInput}
              onChange={handleLocationInputChange}
              placeholder="Enter city..."
              className={styles.locationInput}
            />
            <button 
              className={styles.locationDropdownButton}
              onClick={() => {
                setShowSuggestions(!showSuggestions);
                dispatch(searchLocations(''));
              }}
              title="Show all locations"
            >
              ▼
            </button>
            {locationInput && (
              <button 
                className={styles.locationClearButton}
                onClick={() => {
                  setLocationInput('');
                  setShowSuggestions(false);
                  dispatch(setLocationFilter(''));
                  dispatch(resetPagination());
                  dispatch(searchCampers({ page: 1 }));
                }}
                title="Clear location"
              >
                ✕
              </button>
            )}
            {showSuggestions && locationSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {locationSuggestions.map((location, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className={styles.suggestionItem}
                  >
                    {location}
                  </li>
                ))}
              </ul>
            )}
            {isLoadingLocations && (
              <div className={styles.loadingLocations}>Loading...</div>
            )}
          </div>
        </div>

        {/* Equipment Filter */}
        <div className={styles.filterSection}>
          <h3>Vehicle Equipment</h3>
          {Object.entries(filters.equipment).map(([key, value]) => (
            <label key={key} className={styles.filterLabel}>
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleEquipmentChange(key)}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>

        {/* Vehicle Type Filter */}
        <div className={styles.filterSection}>
          <h3>Vehicle Type</h3>
          {Object.entries(filters.vehicleType).map(([key, value]) => (
            <label key={key} className={styles.filterLabel}>
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleVehicleTypeChange(key)}
              />
              {key.split(/(?=[A-Z])/).join(' ')}
            </label>
          ))}
        </div>

        <button 
          className={styles.resetFiltersButton}
          onClick={handleResetFilters}
        >
          Reset All Filters
        </button>
      </div>

      <div className={styles.variantsColumn}>
        <div className={styles.campersGrid}>
          {campers.map((camper) => (
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
                    <button className={styles.heartButton}>♡</button>
                  </div>
                </div>
                <div className={styles.location}>
                  <span className={styles.rating}>★ {camper.rating}</span>
                  <span className={styles.locationText}>{camper.location}</span>
                </div>
                <p className={styles.description}>{camper.description}</p>
                <div className={styles.features}>
                  {camper.features.transmission && (
                    <span className={styles.feature}>
                      {camper.features.transmission}
                    </span>
                  )}
                  {camper.features.engine && (
                    <span className={styles.feature}>
                      {camper.features.engine}
                    </span>
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
            className={styles.loadMore}
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
