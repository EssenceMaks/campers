import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
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
import { toggleFavorite, setShowFavorites, selectFavorites, selectShowFavorites } from '../../redux/slices/favoritesSlice';
import styles from './Catalog.module.css';

const EQUIPMENT_OPTIONS = [
  { key: 'AC', label: 'Air Condit..', icon: 'icon-wind' },
  { key: 'bathroom', label: 'Bathroom', icon: 'icon-shower' },
  { key: 'kitchen', label: 'Kitchen', icon: 'icon-cup-hot' },
  { key: 'TV', label: 'TV', icon: 'icon-tv' },
  { key: 'radio', label: 'Radio', icon: 'icon-radio' },
  { key: 'refrigerator', label: 'Refrigerator', icon: 'icon-fridge' },
  { key: 'microwave', label: 'Microwave', icon: 'icon-microwave' },
  { key: 'gas', label: 'Gas', icon: 'icon-cup-hot' },
  { key: 'water', label: 'Water', icon: 'icon-water' }
];

const ENGINE_OPTIONS = [
  { key: 'petrol', label: 'Petrol', icon: 'icon-fuel' },
  { key: 'diesel', label: 'Diesel', icon: 'icon-fuel' },
  { key: 'hybrid', label: 'Hybrid', icon: 'icon-fuel' },
  { key: 'gas', label: 'Gas', icon: 'icon-fuel' }
];

const TRANSMISSION_OPTIONS = [
  { key: 'automatic', label: 'Automatic', icon: 'icon-diagram' },
  { key: 'manual', label: 'Manual', icon: 'icon-diagram' }
];

const VEHICLE_TYPE_OPTIONS = [
  { key: 'alcove', label: 'Alcove', icon: 'icon-bi_grid' },
  { key: 'fullyIntegrated', label: 'Fully Integrated', icon: 'icon-bi_grid-3x3' },
  { key: 'panelTruck', label: 'Van', icon: 'icon-bi_grid-1x2' }
];

const truncateTitle = (title, maxLength = 23) => {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
};

const CamperCard = ({ camper, onFavoriteClick, isFavorite }) => {
  // Додаємо console.log для провірки структури даних
  

  return (
    <div className={styles.camperCard}>
      <img
        src={camper.mainImage || camper.gallery?.[0]} 
        alt={camper.name}
        className={styles.camperImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      <h3 title={camper.name} className={styles.camperTitle}>{truncateTitle(camper.name)}</h3>
      <div className={styles.priceContainer}>
        <p className={styles.camperPrice}>€{camper.price.toLocaleString('de-DE')},00</p>
        <div className={styles.favoriteIcon} onClick={() => onFavoriteClick(camper.id)}>
          <Icon 
            name="icon-heart" 
            className={`${styles.icon} ${isFavorite ? styles.iconFilled : ''}`} 
          />
        </div>
      </div>
      
      <div className={styles.reviewsLocation}>
        <div className={styles.reviews}>
          <Icon name="icon-star" />
          {camper.rating} ({camper.reviews} Reviews)
        </div>
        <div className={styles.location}>
          <Icon name="icon-map" />
          {camper.location}
        </div>
      </div>

      <p className={styles.description}>
        {camper.description?.length > 100
          ? `${camper.description.substring(0, 100)}...`
          : camper.description}
      </p>

      <div className={styles.features}>
        {/* Vehicle Equipment */}
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

        {/* Vehicle Type */}
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

        {/* Engine Type */}
        {camper.features?.engine && (
          <span className={styles.feature}>
            <Icon name="icon-fuel" />
            {camper.features.engine}
          </span>
        )}

        {/* Transmission */}
        {camper.features?.transmission && (
          <span className={styles.feature}>
            <Icon name="icon-diagram" />
            {camper.features.transmission}
          </span>
        )}
      </div>

      <div className={styles.button}>
        <Link 
          to={`/catalog/${camper.id}`} 
          className={styles.showMoreButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Show more
        </Link>
      </div>
    </div>
  );
};

import { useLocation } from 'react-router-dom';

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

  const location = useLocation();
  // Reset showFavorites when entering Catalog page
  useEffect(() => {
    dispatch(setShowFavorites(false));
    // eslint-disable-next-line
  }, [location.pathname]);

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
    
    // Якщо поле порожнє, скидаємо фільтр та валідацію
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
      // Перевіряємо валідність після невеликої затримки, щоб дочекатися результатів пошуку
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

  // Функція для очищення локації
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

  // Перевірка валідності міста при втраті фокусу
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

  const handleEngineChange = (key) => {
    // Toggle the selected engine type
    const newEngines = filters.engines.includes(key)
      ? filters.engines.filter(engine => engine !== key)
      : [...filters.engines, key];
    
    dispatch(setEngineFilter(newEngines));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  const handleTransmissionChange = (key) => {
    // Toggle the selected transmission type
    const newTransmissions = filters.transmissions.includes(key)
      ? filters.transmissions.filter(transmission => transmission !== key)
      : [...filters.transmissions, key];
    
    dispatch(setTransmissionFilter(newTransmissions));
    if (isAutoSearch) {
      dispatch(resetPagination());
      dispatch(searchCampers({ page: 1 }));
    }
  };

  const handleFormChange = (key) => {
    // Toggle the selected form type
    const newForms = filters.forms.includes(key)
      ? filters.forms.filter(form => form !== key)
      : [...filters.forms, key];
    
    dispatch(setFormFilter(newForms));
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

    return campers;
  }, [campers, showFavorites, favoriteIds]);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.filtersColumn}>
        
        {/* Location Filter */}
        <div className={styles.filterSection}>
        <h4>Location</h4>
          <div className={styles.locationInputContainer} ref={locationInputRef}>
            <Icon name="icon-map" className={styles.locationIcon} />
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
              <div className={styles.loadingLocations} style={{ left: '50%' }}>Loading...</div>
            )}
          </div>
        </div>
        <h4 className={styles.filtersTitle}>Filters</h4>
        {/* Equipment Filter */}
        <div className={styles.filterSection}>
          <h3>Vehicle Equipment</h3>
          <div className={styles.filterGrid}>
            {EQUIPMENT_OPTIONS.map(({ key, label, icon }) => (
              <label key={key} className={`${styles.filterLabel} ${filters.equipment[key] ? styles.selected : ''}`}>
                <input
                  type="checkbox"
                  checked={filters.equipment[key]}
                  onChange={() => handleEquipmentChange(key)}
                  className={styles.hiddenCheckbox}
                />
                <Icon name={icon} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Engine Filter */}
        <div className={styles.filterSection}>
          <h3>Engine Type</h3>
          <div className={styles.filterGrid}>
            {ENGINE_OPTIONS.map(({ key, label, icon }) => (
              <label key={key} className={`${styles.filterLabel} ${filters.engines.includes(key) ? styles.selected : ''}`}>
                <input
                  type="checkbox"
                  checked={filters.engines.includes(key)}
                  onChange={() => handleEngineChange(key)}
                  className={styles.hiddenCheckbox}
                />
                <Icon name={icon} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission Filter */}
        <div className={styles.filterSection}>
          <h3>Transmission</h3>
          <div className={styles.filterGrid}>
            {TRANSMISSION_OPTIONS.map(({ key, label, icon }) => (
              <label key={key} className={`${styles.filterLabel} ${filters.transmissions.includes(key) ? styles.selected : ''}`}>
                <input
                  type="checkbox"
                  checked={filters.transmissions.includes(key)}
                  onChange={() => handleTransmissionChange(key)}
                  className={styles.hiddenCheckbox}
                />
                <Icon name={icon} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Vehicle Type Filter */}
        <div className={styles.filterSection}>
          <h3>Vehicle Type</h3>
          <div className={styles.filterGrid}>
            {VEHICLE_TYPE_OPTIONS.map(({ key, label, icon }) => (
              <label key={key} className={`${styles.filterLabel} ${filters.forms.includes(key) ? styles.selected : ''}`}>
                <input
                  type="checkbox"
                  checked={filters.forms.includes(key)}
                  onChange={() => handleFormChange(key)}
                  className={styles.hiddenCheckbox}
                />
                <Icon name={icon} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search Mode Toggle */}
        <div className={styles.searchModeToggle}>
          <h4>Search Settings</h4>
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

          <button 
            className={`${styles.searchButton} ${!isAutoSearch ? styles.active : ''}`}
            onClick={handleManualSearch}
          >
            Search Campers
          </button>

          <div className={styles.filtersActions}>
            <button 
              className={styles.resetButton}
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
            <button
              className={`${styles.resetButton} ${showFavorites ? styles.activeFilter : ''}`}
              onClick={() => dispatch(setShowFavorites(!showFavorites))}
            >
              Show Favorites ({favoriteIds.length || 0}) <Icon name="icon-heart" className={favoriteIds.length > 0 ? styles.activeHeart : styles.emptyHeart} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.variantsColumn}>
        {showFavorites && (
          <div className={styles.favoritesHeader}>
            <h2>Favorites ({favoriteIds.length})</h2>
            <button
              className={styles.outOfFavoritesButton}
              onClick={() => dispatch(setShowFavorites(false))}
            >
              Out of favorites
            </button>
          </div>
        )}
        <div className={styles.campersGrid}>
          {filteredCampers.map((camper) => (
            <CamperCard 
              key={camper.id} 
              camper={camper} 
              onFavoriteClick={() => dispatch(toggleFavorite(camper.id))}
              isFavorite={favoriteIds.includes(camper.id)}
            />
          ))}
        </div>
        
        {isLoading && <div className={styles.loading}>Loading...</div>}
        
        {!isLoading && !showFavorites && hasMore && (
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
