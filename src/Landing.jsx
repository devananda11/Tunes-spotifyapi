import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const CLIENT_ID = "010841a0f9904a25b4789f977225c34e";
    const REDIRECT_URI = "http://localhost:5173";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = "user-top-read";
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.localStorage.setItem("token", token);
            window.location.hash = "";
            navigate('/content'); // Redirect to /content after setting the token
        } else if (token) {
            navigate('/content'); // Redirect to /content if token already exists
        }

        setToken(token);
    }, [navigate]);

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 flex items-center justify-center">
            <div className="p-9 w-[420px] text-center bg-white rounded-2xl">
                <h2 className="text-[#2f2d2f] text-2xl mb-4">
                    Welcome to <span className="text-green-800 font-bold">Tunes</span>!
                </h2>
                <a
                    className="cursor-pointer text-white py-3 px-4 rounded-lg inline-block mt-5 bg-green-600"
                    href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
                >
                    Login With Spotify
                </a>
            </div>
        </div>
    );
}

export default Landing;
