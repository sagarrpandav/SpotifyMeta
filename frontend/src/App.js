import {useEffect, useState} from "react";
import {getAccessAndRefreshTokens, getCurrentUserProfile, logout} from "./spotify";
import {catchErrors} from "./utils";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, Routes,
    useLocation
} from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";
import {Login} from "./pages/Login";
import {GlobalStyle} from "./styles/GlobalStyle";
import {Profile} from "./pages/Profile";
import {TopArtists} from "./pages/TopArtists";
import {TopTracks} from "./pages/TopTracks";
import {Playlist} from "./pages/Playlist";
import {Track} from "./pages/Track";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    const [accessToken, setAccessToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [availableSongs, setAvailableSongs] = useState({});

    useEffect(() => {
        const access_token = getAccessAndRefreshTokens();
        setAccessToken(access_token);
    }, []);

    return (
        <div className="App">
            <GlobalStyle/>
            <header className="App-header">
                {!accessToken ? (<Login/>) : (
                    <>
                        <StyledLogoutButton onClick={logout}>Logout</StyledLogoutButton>
                        <Router>
                            <ScrollToTop/>
                            <Switch>
                                <Route path="/top-artists">
                                    <TopArtists/>
                                </Route>
                                <Route path="/top-tracks">
                                    <TopTracks/>
                                </Route>
                                <Route path="/playlists/:id">
                                    <Playlist/>
                                </Route>
                                <Route path="/playlists">
                                    <h1>Playlists</h1>
                                </Route>
                                <Route path="/track/:id">
                                    <Track availableSongs={availableSongs} setAvailableSongs={setAvailableSongs}/>
                                </Route>
                                <Route path="/">
                                    <Profile/>
                                </Route>
                            </Switch>
                        </Router>
                    </>
                )}
            </header>
        </div>
    );
}

export default App;
