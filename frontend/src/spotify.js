import axios from "axios";

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

const LOCAL_STORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp',
};

const LOCAL_STORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCAL_STORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCAL_STORAGE_KEYS.timestamp),
}

export const getAccessAndRefreshTokens = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
        [LOCAL_STORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCAL_STORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCAL_STORAGE_KEYS.expireTime]: EXPIRATION_TIME,
    };
    const hasError = urlParams.get('error');

    // If there's an error OR the token in localStorage has expired, refresh the token
    if (hasError || hasTokenExpired() || LOCAL_STORAGE_VALUES.accessToken === 'undefined') {
        refreshToken();
    }

    // If there is a valid access token in localStorage, use that
    if (LOCAL_STORAGE_VALUES.accessToken && LOCAL_STORAGE_VALUES.accessToken !== 'undefined') {
        return LOCAL_STORAGE_VALUES.accessToken;
    }

    // If there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCAL_STORAGE_KEYS.accessToken]) {
        // Store the query params in localStorage
        for (const property in queryParams) {
            window.localStorage.setItem(property, queryParams[property]);
        }
        // Set timestamp
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.timestamp, Date.now());
        // Return access token from query params
        return queryParams[LOCAL_STORAGE_KEYS.accessToken];
    }

    // We should never get here!
    return false;
};

const hasTokenExpired = () => {
    const {accessToken, timestamp, expireTime} = LOCAL_STORAGE_VALUES;
    if (!accessToken || !timestamp) {
        return false;
    }
    const millisElapsed = Date.now() - timestamp;
    return (millisElapsed / 1000) > expireTime;
};

const refreshToken = async () => {
    try {
        if (!LOCAL_STORAGE_VALUES.refreshToken ||
            LOCAL_STORAGE_VALUES.refreshToken === 'undefined' ||
            (Date.now() - Number(LOCAL_STORAGE_VALUES.timestamp) / 1000) < 1000
        ) {
            console.error('No refresh token available');
            logout();
        }

        const {data} = await axios.get(`/refresh_token?refresh_token=${LOCAL_STORAGE_KEYS.refreshToken}`);

        window.localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, data.access_token);
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.timestamp, Date.now());

        window.location.reload();

    } catch (e) {
        console.error(e);
    }
};

export const logout = () => {
    for (const property in LOCAL_STORAGE_KEYS) {

        window.localStorage.removeItem(LOCAL_STORAGE_KEYS[property]);
    }

    window.location = window.location.origin;
};

const SPOTIFY_HEADERS = {
    Authorization: `Bearer ${getAccessAndRefreshTokens()}`,
    'Content-Type': 'application/json'
};

export const getCurrentUserProfile = () => {
    return axios({
        method: 'get',
        url: SPOTIFY_BASE_URL + '/me',
        headers: SPOTIFY_HEADERS
    });
};

export const getCurrentUserPlaylists = (limit = 20) => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/me/playlists?limit=${limit}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getCurrentUserTopArtists = (time_range = 'medium_term') => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/me/top/artists?time_range=${time_range}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getCurrentUserTopTracks = (time_range = 'medium_term') => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/me/top/tracks?time_range=${time_range}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getPlaylistById = (playlist_id) => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/playlists/${playlist_id}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getMoreTracks = (url) => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/${url}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getAudioFeaturesForMultipleTracks = ids => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/audio-features?ids=${ids}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getTrackAudioAnalysis = trackId => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/audio-analysis/${trackId}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getTrackData = trackId => {
    return axios({
        method: 'get',
        url: `${SPOTIFY_BASE_URL}/tracks/${trackId}`,
        headers: SPOTIFY_HEADERS
    });
};

export const getAllTrackInfo = trackId => axios
    .all([getTrackData(trackId), getTrackAudioAnalysis(trackId), getAudioFeaturesForMultipleTracks([trackId])])
    .then(
        axios.spread((track, audioAnalysis, audioFeatures) => ({
            track: track.data,
            audioAnalysis: audioAnalysis.data,
            audioFeatures: audioFeatures.data,
        })),
    );
