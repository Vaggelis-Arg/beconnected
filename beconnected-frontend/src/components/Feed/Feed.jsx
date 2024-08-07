import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { API_URL, refreshToken } from '../../api/Api';
import './feed.css';

const Feed = () => {
    const [feed, setFeed] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeed = async () => {
            const userId = sessionStorage.getItem('user_id');

            try {
                const response = await axios.get(`${API_URL}/feed`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                    },
                });

                console.log('API response data:', response.data);

                if (Array.isArray(response.data)) {
                    setFeed(response.data);
                } else {
                    setError('Unexpected feed data format.');
                    console.error('Feed data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching feed:', error);
                if (error.response && error.response.status === 401) {
                    try {
                        const newAccessToken = await refreshToken();
                        const retryResponse = await axios.get('${API_URL}/feed', {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        });

                        // Log retry response data
                        console.log('Retry API response data:', retryResponse.data);

                        if (Array.isArray(retryResponse.data)) {
                            setFeed(retryResponse.data);
                        } else {
                            setError('Unexpected feed data format.');
                            console.error('Retry feed data is not an array:', retryResponse.data);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        setError('Your session has expired. Please log in again.');
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('refresh_token');
                        navigate('/login');
                    }
                } else {
                    setError('Failed to fetch feed data. Please try again.');
                }
            }
        };

        fetchFeed();
    }, [navigate]);


    if (error) return <div>{error}</div>;

    return (
        <div className="feed-page">
            <Navbar/>
            <h1>Your Feed</h1>
            <ul>
                {feed.map((item, index) => (
                    <li key={index}>{item.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default Feed;
