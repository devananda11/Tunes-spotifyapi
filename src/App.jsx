import { useEffect, useState } from "react";
import axios from 'axios';

function App() {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const AUTH_ENDPOINT = import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT;
    const RESPONSE_TYPE = import.meta.env.VITE_SPOTIFY_RESPONSE_TYPE;
    const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES;

    const [token, setToken] = useState("");
    const [data, setData] = useState([]); // For both tracks and artists
    const [type, setType] = useState('tracks'); // Default type is tracks
    const [timeRange, setTimeRange] = useState('medium_term'); // Default time range
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.localStorage.setItem("token", token);
            window.location.hash = "";
        }

        setToken(token);
    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
        setData([]);  // Clear data when logging out
    };

    const searchTopItems = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error before fetching
        setData([]);  // Clear previous data
        try {
            console.log(`Fetching ${type} for time range ${timeRange}`); // Debugging line
            const { data } = await axios.get(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API Response:', data); // Debugging line
            if (data.items.length > 0) {
                setData(data.items);
            } else {
                setError(`No top ${type} data available for the selected time range.`);
            }
        } catch (error) {
            console.error(`Error fetching top ${type}:`, error);
            setError(`Error fetching top ${type}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setData([]); // Clear the previous data when switching between tracks and artists
        setError(""); // Clear error when switching type
    };

    const renderData = () => {
        if (loading) {
            return <p className="text-white">Loading...</p>;
        }

        if (error) {
            return <p className="text-red-500">{error}</p>;
        }

        if (data.length === 0) {
            return <p className="text-white text-center">Nothing to display</p>;
        }

        return data.map((item, index) => (
            <div key={item.id} className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg mb-4 max-w-lg mx-auto">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white font-bold bg-gray-700 rounded-full mr-4">
                    {index + 1}
                </div>
                <img
                    src={type === 'tracks' ? item.album.images[0]?.url : item.images[0]?.url}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                    <p className="text-white font-bold mb-1">{item.name}</p>
                    {type === 'tracks' ? (
                        <>
                            <p className="text-gray-400 text-sm mb-1">
                                {item.artists.map(artist => artist.name).join(', ')}
                            </p>
                            <p className="text-gray-500 text-xs">{item.album.name}</p>
                        </>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            {item.genres.length > 0 ? item.genres.join(', ') : 'No genres available'}
                        </p>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200">
            <nav className="bg-gray-800 p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <p className="text-2xl text-green-300 font-bold">Tunes</p>
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="cursor-pointer text-white">Dark Mode</div>
                        {!token ? (
                            <a
                                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-colors"
                            >
                                Login to Spotify
                            </a>
                        ) : (
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transition-colors"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                    <div className="lg:hidden md:flex flex-col justify-end">
                        <button onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}>
                            {mobileDrawerOpen ? "X" : "="}
                        </button>
                    </div>
                </div>
                {mobileDrawerOpen && (
                    <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul>
                            <li className="py-4 text-center"><a href="#top-tracks">Dark Mode</a></li>
                            <li className="py-4"><a >
                                {!token ? (
                            <a
                                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-colors"
                            >
                                Login to Spotify
                            </a>
                        ) : (
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transition-colors"
                            >
                                Logout
                            </button>
                        )}
                            </a>

                            </li>
                            {/* Add more nav items if needed */}
                        </ul>
                    </div>
                )}
            </nav>
            <div className="max-w-4xl mx-auto px-4 py-6">
                <header className="text-center mb-6">
                    {token && (
                        <form onSubmit={searchTopItems} className="mt-6">
                            <div className="mb-4">
                                <label htmlFor="type" className="block text-lg mb-2">Select Type:</label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={handleTypeChange}
                                    className="border p-2 bg-gray-800 text-gray-200 rounded-lg"
                                >
                                    <option value="tracks">Top Tracks</option>
                                    <option value="artists">Top Artists</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="timeRange" className="block text-lg mb-2">Select Time Range:</label>
                                <select
                                    id="timeRange"
                                    value={timeRange}
                                    onChange={handleTimeRangeChange}
                                    className="border p-2 bg-gray-800 text-gray-200 rounded-lg"
                                >
                                    <option value="short_term">Last 4 weeks</option>
                                    <option value="medium_term">Last 6 months</option>
                                    <option value="long_term">All time</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                            >
                                Get {type === 'tracks' ? 'Top Tracks' : 'Top Artists'}
                            </button>
                        </form>
                    )}

                    {!token && <h2 className="text-2xl mt-4">Please login</h2>}
                </header>

                <div className="space-y-4">
                    {renderData()}
                </div>
            </div>
        </div>
    );
}

export default App;
