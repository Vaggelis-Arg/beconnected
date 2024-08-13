import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { API_URL, refreshToken } from '../../api/Api';

const Feed = () => {
    return (
        <div className="feed-page">
            <Navbar/>
            <h1>Your Feed</h1>
        </div>
    );
};

export default Feed;
