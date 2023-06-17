import {useEffect, useState} from "react";
import {
    getCurrentUserPlaylists,
    getCurrentUserProfile,
    getCurrentUserTopArtists,
    getCurrentUserTopTracks
} from "../spotify";
import {catchErrors} from "../utils";
import {StyledHeader} from "../styles/StyledHeader";
import {StyledSection} from "../styles/StyledSection";
import {SectionWrapper} from "../components/SectionWrapper";
import {ArtistsGrid} from "../components/ArtistsGrid";
import {TrackList} from "../components/TrackList";
import {PlaylistsGrid} from "../components/PlaylistsGrid";
import {Loader} from "../components/Loader";
import {RequestForm} from "../components/RequestForm";

export const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUserProfileData = async () => {
            const userProfile = await getCurrentUserProfile();
            setProfile(userProfile.data);

            const userPlaylists = await getCurrentUserPlaylists();
            setPlaylists(userPlaylists.data);

            const userTopArtists = await getCurrentUserTopArtists();
            setTopArtists(userTopArtists.data);

            const userTopTracks = await getCurrentUserTopTracks();
            setTopTracks(userTopTracks.data);
        };
        let err = catchErrors(fetchUserProfileData, setError, []);
    }, []);
    if (error) {
        return (
            <>
                <StyledHeader/>
                <RequestForm/>
            </>
        )
    }
    return (<>
        {profile && (<StyledHeader type="user">
            <div className="header__inner">
                {profile.images.length && profile.images[0].url && (
                    <img className="header__img" src={profile.images[0].url} alt="Avatar"/>)}
                <div>
                    <div className="header__overline">Profile</div>
                    <h1 className="header__name">{profile.display_name}</h1>
                    <p className="header__meta">
                        {playlists && (
                            <span>{playlists.total} Playlists</span>
                        )}
                        <span>{profile.followers.total} Followers</span>
                    </p>
                </div>
            </div>
        </StyledHeader>)}
        {(topArtists && topTracks && playlists) ? (
            <main>
                <SectionWrapper title="Top Artists this month" seeAllLink="/top-artists">
                    <ArtistsGrid artists={topArtists.items.slice(0, 5)}/>
                </SectionWrapper>
                <SectionWrapper title="Top Tracks this month" seeAllLink="/top-tracks">
                    <TrackList tracks={topTracks.items.slice(0, 5)}/>
                </SectionWrapper>
                <SectionWrapper title="Playlists" seeAllLink="/playlists">
                    <PlaylistsGrid playlists={playlists.items.slice(0, 5)}/>
                </SectionWrapper>
            </main>
        ) : (<Loader/>)}
    </>)
};