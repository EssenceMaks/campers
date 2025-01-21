import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  searchCampers,
  selectCampers,
  selectPagination,
  selectHasMore,
  resetPagination,
  resetCampers,
  setPage
} from '../../redux/slices/campersSlice';
import {
  searchLocations,
  clearSuggestions,
  selectLocationSuggestions,
  selectLocationsLoading
} from '../../redux/slices/locationsSlice';
import {
  setLocationFilter,
  setEquipmentFilter,
  setEngineFilter,
  setTransmissionFilter,
  setFormFilter,
  toggleAutoSearch,
  resetFilters,
  selectFilters,
  selectIsAutoSearch
} from '../../redux/slices/filtersSlice';
import { toggleFavorite, toggleShowFavorites, selectFavorites, selectShowFavorites } from '../../redux/slices/favoritesSlice';
import styles from './Catalog.module.css';

const EQUIPMENT_OPTIONS = [
  { key: 'AC', label: 'Air Conditioning' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'TV', label: 'TV' },
  { key: 'radio', label: 'Radio' },
  { key: 'refrigerator', label: 'Refrigerator' },
  { key: 'microwave', label: 'Microwave' },
  { key: 'gas', label: 'Gas' },
  { key: 'water', label: 'Water' }
];

const ENGINE_OPTIONS = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'gas', label: 'Gas' }
];

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' }
];

const VEHICLE_TYPE_OPTIONS = [
  { value: 'alcove', label: 'Alcove' },
  { value: 'fullyIntegrated', label: 'Fully Integrated' },
  { value: 'panelTruck', label: 'Panel Truck' }
];

const Catalog = () => {
  const dispatch = useDispatch();
  const campers = useSelector(selectCampers);
  const pagination = useSelector(selectPagination);
  const hasMore = useSelector(selectHasMore);
  const { isLoading, error } = useSelector(state => state.campers);
  const filters = useSelector(selectFilters);
  const isAutoSearch = useSelector(selectIsAutoSearch);
  const locationSuggestions = useSelector(selectLocationSuggestions);
  const isLoadingLocations = useSelector(selectLocationsLoading);
  const favoriteIds = useSelector(selectFavorites);
  const showFavorites = useSelector(selectShowFavorites);
  
  const [locationInput, setLocationInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInvalidCity, setIsInvalidCity] = useState(false);

  const locationInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(resetCampers());
    dispatch(searchCampers({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (showFavorites) {
      // Reset pagination and load all campers when showing favorites
      dispatch(resetPagination());
      dispatch(resetFilters());
      dispatch(searchCampers({ page: 1, loadAll: true }));
    }
  }, [dispatch, showFavorites]);

  const handleLocationInputChange = useCallback((e) => {
    const value = e.target.value;
    setLocationInput(value);
    setShowSuggestions(true);
    
    // Если поле пустое, сбрасываем фильтр и валидацию
    if (!value) {
      setIsInvalidCity(false);
      dispatch(setLocationFilter(''));
      if (isAutoSearch) {
        dispatch(resetPagination());
        dispatch(searchCampers({ page: 1 }));
      }
      return;
    }
    
    if (value.length >= 2) {
      dispatch(searchLocations(value));
      // Проверяем валидность после небольшой задержки, чтобы дождаться результатов поиска
      setTimeout(() => {
        if (!locationSuggestions || locationSuggestions.length === 0) {
          setIsInvalidCity(true);
        } else {
          setIsInvalidCity(false);
        }
      }, 300);
    } else {
      dispatch(clearSuggestions());
      setIsInvalidCity(true);
    }
  }, [dispatch, isAutoSearch, locationSuggestions]);

  const handleLocationSelect = (location) => {
    setLocationInput(location);
    setShowSuggestions(false);
    setIsInvalidCity(false);
    dispatch(setLocationFilter(location));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  // Функция для очистки локации
  const handleLocationClear = () => {
    setLocationInput('');
    setShowSuggestions(false);
    setIsInvalidCity(false);
    dispatch(setLocationFilter(''));
    dispatch(clearSuggestions());
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  // Проверка валидности города при потере фокуса
  const handleLocationBlur = () => {
    if (locationInput && (!locationSuggestions || locationSuggestions.length === 0)) {
      setIsInvalidCity(true);
    }
  };

  const handleEquipmentChange = (name) => {
    dispatch(setEquipmentFilter({ 
      name, 
      value: !filters.equipment[name] 
    }));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  const handleEngineChange = (value) => {
    dispatch(setEngineFilter(value));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  const handleTransmissionChange = (value) => {
    dispatch(setTransmissionFilter(value));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  const handleFormChange = (value) => {
    dispatch(setFormFilter(value));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  const handleSearchModeToggle = () => {
    dispatch(toggleAutoSearch());
  };

  const handleManualSearch = () => {
    if (!isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
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

  const filteredCampers = useMemo(() => {
    if (!campers) return [];
    
    // If showing favorites, return all favorited campers without filtering
    if (showFavorites) {
      return campers.filter(camper => favoriteIds.includes(camper.id));
    }

    // Otherwise apply normal filters
    return campers.filter(camper => {
      // Location filter
      const matchesLocation = !filters?.location || 
        camper.location.toLowerCase().includes(filters.location.toLowerCase());

      // Form filter
      const matchesForm = !filters?.form || filters.form === camper.form;

      // Transmission filter
      const matchesTransmission = !filters?.transmission || 
        filters.transmission === camper.transmission;

      // Engine filter
      const matchesEngine = !filters?.engine || filters.engine === camper.engine;

      // Features filter
      const matchesFeatures = !filters?.features?.length || 
        filters.features.every(feature => camper.features[feature]);

      return matchesLocation && matchesForm && matchesTransmission && 
             matchesEngine && matchesFeatures;
    });
  }, [campers, filters, showFavorites, favoriteIds]);

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
          <div className={styles.locationInputContainer} ref={locationInputRef}>
            <input
              type="text"
              value={locationInput}
              onChange={handleLocationInputChange}
              onBlur={handleLocationBlur}
              placeholder="Enter city..."
              className={`${styles.locationInput} ${isInvalidCity ? styles.invalidInput : ''}`}
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
                onClick={handleLocationClear}
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
            {isInvalidCity && (
              <div className={styles.errorMessage}>
                No campers available in this city
              </div>
            )}
            {isLoadingLocations && (
              <div className={styles.loadingLocations}>Loading...</div>
            )}
          </div>
        </div>

        {/* Equipment Filter */}
        <div className={styles.filterSection}>
          <h3>Vehicle Equipment</h3>
          {EQUIPMENT_OPTIONS.map(({ key, label }) => (
            <label key={key} className={styles.filterLabel}>
              <input
                type="checkbox"
                checked={filters.equipment[key]}
                onChange={() => handleEquipmentChange(key)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Engine Filter */}
        <div className={styles.filterSection}>
          <h3>Engine Type</h3>
          {ENGINE_OPTIONS.map(({ value, label }) => (
            <label key={value} className={styles.filterLabel}>
              <input
                type="checkbox"
                checked={filters.engines.includes(value)}
                onChange={() => handleEngineChange(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Transmission Filter */}
        <div className={styles.filterSection}>
          <h3>Transmission</h3>
          {TRANSMISSION_OPTIONS.map(({ value, label }) => (
            <label key={value} className={styles.filterLabel}>
              <input
                type="checkbox"
                checked={filters.transmissions.includes(value)}
                onChange={() => handleTransmissionChange(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Vehicle Type Filter */}
        <div className={styles.filterSection}>
          <h3>Vehicle Type</h3>
          {VEHICLE_TYPE_OPTIONS.map(({ value, label }) => (
            <label key={value} className={styles.filterLabel}>
              <input
                type="checkbox"
                checked={filters.forms.includes(value)}
                onChange={() => handleFormChange(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Search Mode Toggle */}
        <div className={styles.searchModeContainer}>
          <button 
            className={`${styles.searchModeButton} ${isAutoSearch ? styles.active : ''}`}
            onClick={handleSearchModeToggle}
          >
            Auto-Search
          </button>
          <span className={styles.searchModeDivider}>|</span>
          <button 
            className={`${styles.searchModeButton} ${!isAutoSearch ? styles.active : ''}`}
            onClick={handleSearchModeToggle}
          >
            Search
          </button>
        </div>

        {!isAutoSearch && (
          <button 
            className={styles.searchButton}
            onClick={handleManualSearch}
          >
            Search Campers
          </button>
        )}

        <div className={styles.filtersActions}>
          <button 
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            Reset All Filters
          </button>
          {favoriteIds.length > 0 && (
            <button
              className={`${styles.resetButton} ${showFavorites ? styles.activeFilter : ''}`}
              onClick={() => {
                dispatch(toggleShowFavorites());
              }}
            >
              Show Favorites ({favoriteIds.length})
            </button>
          )}
        </div>
      </div>

      <div className={styles.variantsColumn}>
        {showFavorites && (
          <div className={styles.favoritesHeader}>
            <h2>Favorites ({favoriteIds.length})</h2>
            <button
              className={styles.outOfFavoritesButton}
              onClick={() => dispatch(toggleShowFavorites())}
            >
              Out of favorites
            </button>
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
                  {camper.form && (
                    <span className={styles.feature}>
                      {camper.form}
                    </span>
                  )}
                </div>
                <Link to={`/catalog/${camper.id}`} className={styles.showMore}>
                  Show more
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {isLoading && <div className={styles.loading}>Loading...</div>}
        
        {!isLoading && !showFavorites && hasMore && (
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
