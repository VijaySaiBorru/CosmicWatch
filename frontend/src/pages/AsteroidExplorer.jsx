import React, { useState } from 'react';
import { FaSearch, FaUndo } from 'react-icons/fa';
import { useGetAsteroidsByDateRangeQuery } from '../redux/features/nasa/nasaApi';
import AsteroidCard from '../components/AsteroidCard';
import CosmicButton from '../components/CosmicButton';
import './AsteroidExplorer.css';

const AsteroidExplorer = () => {
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [searchParams, setSearchParams] = useState({ startDate: today, endDate: today });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const { data, isLoading, error } = useGetAsteroidsByDateRangeQuery(searchParams, {
        skip: !searchParams.startDate || !searchParams.endDate
    });


    const filteredAsteroids = data?.asteroids?.filter(asteroid => 
        asteroid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asteroid.id.includes(searchTerm)
    ) || [];


    const totalPages = Math.ceil(filteredAsteroids.length / ITEMS_PER_PAGE);
    const paginatedAsteroids = filteredAsteroids.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ startDate, endDate });
        setCurrentPage(1); // Reset to page 1 on new date search
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="explorer-page container">
            <header className="explorer-header">
                <h1 className="text-3xl font-bold text-white mb-4">🔭 Asteroid Explorer</h1>
                <p className="text-slate-400 mb-8">
                    Select a date range to discover Near-Earth Objects passing by Earth.
                </p>

                <form className="date-search-form" onSubmit={handleSearch}>
                    <div className="date-input-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="cosmic-input"
                        />
                    </div>
                    <div className="date-input-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="cosmic-input"
                        />
                    </div>
                    
                    <div className="date-input-group search-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Name or ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); 
                            }}
                            className="cosmic-input"
                        />
                    </div>

                    <div className="date-input-group buttons-group">
                        <CosmicButton type="submit" variant="primary">
                            <FaSearch className="mr-2" /> Search
                        </CosmicButton>
                        <CosmicButton 
                            type="button" 
                            variant="danger"
                            onClick={() => {
                                setStartDate(today);
                                setEndDate(today);
                                setSearchTerm('');
                                setSearchParams({ startDate: today, endDate: today });
                                setCurrentPage(1);
                            }}
                        >
                            <FaUndo className="mr-2" /> Reset
                        </CosmicButton>
                    </div>
                </form>
            </header>

            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Scanning the cosmos...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    ⚠️ Failed to fetch asteroid data. Please check your dates (max 7 days range generally).
                </div>
            )}

            <div className="explorer-results">
                <h2 className="text-xl font-semibold text-white mb-6">
                    Found {filteredAsteroids.length} Asteroids
                    {searchTerm && <span className="text-sm font-normal text-slate-400 ml-2">(filtered from {data?.asteroids?.length})</span>}
                </h2>

                <div className="asteroids-grid">
                    {paginatedAsteroids.map((asteroid, index) => (
                        <AsteroidCard
                            key={asteroid.id}
                            asteroid={asteroid}
                            animationDelay={index * 0.05}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <CosmicButton 
                            variant="secondary" 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </CosmicButton>
                        <span className="page-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <CosmicButton 
                            variant="secondary" 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </CosmicButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AsteroidExplorer;
