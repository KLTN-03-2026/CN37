import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDebounce } from '../../../../hooks/useDebounce';
import styles from './HeaderSearch.module.scss';
import classNames from 'classnames/bind';
import { searchProducts } from '../../../../api/ProductApi';

const cx = classNames.bind(styles);

function HeaderSearch() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);

  const debouncedSearchValue = useDebounce(searchValue, 400);

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // Fetch search results khi debouncedSearchValue thay đổi
  useEffect(() => {
    if (!debouncedSearchValue.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await searchProducts(encodeURIComponent(debouncedSearchValue))

        if (!response.ok) {
          throw new Error('API Error');
        }

        const data = await response.json();
        setResults(data || []);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchValue]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  // Handle clear input
  const handleClear = () => {
    setSearchValue('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle select product
  const handleSelectProduct = (product) => {
    // Add to search history
    const newHistory = [searchValue, ...searchHistory.filter(h => h !== searchValue)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory);

    // Navigate to product detail
    navigate(`/product/${product.slug}`);

    // Clear search
    setSearchValue('');
    setResults([]);
    setIsOpen(false);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (!isOpen && results.length === 0) {
      if (e.key === 'Enter' && searchValue.trim()) {
        navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
        setSearchValue('');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectProduct(results[selectedIndex]);
        } else if (searchValue.trim()) {
          navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
          setSearchValue('');
          setIsOpen(false);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;

      default:
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight keyword in product name
  const highlightKeyword = (text, keyword) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={cx('highlight')}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Render item sản phẩm
  const renderProductItem = (product, index) => {
    const isSelected = selectedIndex === index;
    const discountPercent = product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

    return (
      <div
        key={product.id}
        className={cx('productItem', { active: isSelected })}
        onClick={() => handleSelectProduct(product)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        {/* Thumbnail */}
        <div className={cx('thumbnail')}>
          <img
            src={product.thumbnail || '/default-product.png'}
            alt={product.name}
            onError={(e) => {
              e.target.src = '/default-product.png';
            }}
          />
          {discountPercent > 0 && (
            <span className={cx('badge')}>-{discountPercent}%</span>
          )}
        </div>

        {/* Product Info */}
        <div className={cx('info')}>
          <h4 className={cx('name')}>
            {highlightKeyword(product.name, debouncedSearchValue)}
          </h4>

          {/* Pricing */}
          <div className={cx('pricing')}>
            {product.discountPrice ? (
              <>
                <span className={cx('originalPrice')}>
                  {product.price.toLocaleString('vi-VN')} ₫
                </span>
                <span className={cx('discountPrice')}>
                  {product.discountPrice.toLocaleString('vi-VN')} ₫
                </span>
              </>
            ) : (
              <span className={cx('price')}>
                {product.price.toLocaleString('vi-VN')} ₫
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cx('searchWrapper')} ref={containerRef}>
      <div className={cx('searchBox')}>
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className={cx('input')}
          placeholder="Nhập tên sản phẩm cần tìm..."
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchValue.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            type="button"
            className={cx('clearBtn')}
            onClick={handleClear}
            title="Xóa"
          >
            <FaTimes />
          </button>
        )}

        {/* Search/Loading Button */}
        <button
          type="button"
          className={cx('searchBtn', { loading })}
          onClick={() => {
            if (searchValue.trim()) {
              navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
              setSearchValue('');
            }
          }}
          title="Tìm kiếm"
          disabled={loading}
        >
          {loading ? (
            <span className={cx('spinner')}></span>
          ) : (
            <FaSearch />
          )}
        </button>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className={cx('dropdown')} ref={dropdownRef}>
          {loading ? (
            <div className={cx('loading')}>
              <div className={cx('skeletonItem')}>
                <div className={cx('skeletonThumbnail')}></div>
                <div className={cx('skeletonContent')}>
                  <div className={cx('skeletonLine', 'line1')}></div>
                  <div className={cx('skeletonLine', 'line2')}></div>
                </div>
              </div>
              <div className={cx('skeletonItem')}>
                <div className={cx('skeletonThumbnail')}></div>
                <div className={cx('skeletonContent')}>
                  <div className={cx('skeletonLine', 'line1')}></div>
                  <div className={cx('skeletonLine', 'line2')}></div>
                </div>
              </div>
              <div className={cx('skeletonItem')}>
                <div className={cx('skeletonThumbnail')}></div>
                <div className={cx('skeletonContent')}>
                  <div className={cx('skeletonLine', 'line1')}></div>
                  <div className={cx('skeletonLine', 'line2')}></div>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className={cx('resultList')}>
              {results.map((product, index) => renderProductItem(product, index))}
            </div>
          ) : (
            <div className={cx('empty')}>
              <p>Không tìm thấy sản phẩm nào</p>
              <small>Hãy thử từ khóa khác</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
