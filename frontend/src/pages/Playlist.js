import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {getAudioFeaturesForMultipleTracks, getMoreTracks, getPlaylistById} from "../spotify";
import {catchErrors} from "../utils";
import {StyledHeader} from "../styles/StyledHeader";
import axios from "axios";
import {SectionWrapper} from "../components/SectionWrapper";
import {TrackList} from "../components/TrackList";
import {StyledDropdown} from "../styles/StyledDropDown";
import {Loader} from "../components/Loader";

export const Playlist = () => {
    const {id} = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [tracks, setTracks] = useState(null);
    const [audioFeatures, setAudioFeatures] = useState(null);
    const [sortValue, setSortValue] = useState('');
    const sortOptions = ['danceability', 'tempo', 'energy'];

    useEffect(() => {
        const fetchData = async () => {
            const {data} = await getPlaylistById(id);
            setPlaylist(data);
            setTracksData(data.tracks);
        };

        catchErrors(fetchData, null, []);
    }, []);


    useEffect(() => {
        if (!tracksData) return;
        const fetchMoreTracks = async () => {
            if (tracksData.next) {
                const {data} = await getMoreTracks(tracksData.next);
                setTracksData(data);
            }
        };

        setTracks(tracks => ([
            ...tracks ? tracks : [],
            ...tracksData.items
        ]));

        catchErrors(fetchMoreTracks, null, []);

        const fetchAudioFeatures = async () => {
            const ids = tracksData.items.map(({track}) => track.id).join(',');
            const {data} = await getAudioFeaturesForMultipleTracks(ids);
            setAudioFeatures(audioFeatures => ([
                ...audioFeatures ? audioFeatures : [],
                ...data['audio_features']
            ]));
        };

        catchErrors(fetchAudioFeatures, null, []);
    }, [tracksData])

    const tracksForTrackListWithAurioFeatures = useMemo(() => {
        if (!tracks || !audioFeatures) return;

        return tracks.map(({track}) => {
            const trackToAdd = track;
            if (!trackToAdd.audio_feautures) {
                const audioFeaturesObj = audioFeatures.find(item => {
                    if (!item || !track) return null;
                    return item.id === track.id;
                })
                trackToAdd['audio_features'] = audioFeaturesObj;
            }
            return trackToAdd;
        })
        return tracks.map(({track}) => track);
    }, [tracks, audioFeatures]);

    const sortedTracks = useMemo(() => {
        if (!tracksForTrackListWithAurioFeatures) return null;

        return [...tracksForTrackListWithAurioFeatures].sort((a,b) => {
            const aFeatures = a['audio_features'];
            const bFeatures = b['audio_features'];

            if (!aFeatures || !bFeatures) return false;
            return bFeatures[sortValue] - aFeatures[sortValue];
        })
    }, [sortValue, tracksForTrackListWithAurioFeatures])
    return (
        <>
            {playlist && (
                <>
                    <StyledHeader>
                        <div className="header__inner">
                            {playlist.images.length && playlist.images[0].url && (
                                <img className="header__img" src={playlist.images[0].url} alt="Playlist Artwork"/>
                            )}
                            <div>
                                <div className="header__overline">Playlist</div>
                                <h1 className="header__name">{playlist.name}</h1>
                                <p className="header__meta">
                                    {playlist.followers.total ? (
                                        <span>{playlist.followers.total} {`follower${playlist.followers.total !== 1 ? 's' : ''}`}</span>
                                    ) : null}
                                    <span>{playlist.tracks.total} {`song${playlist.tracks.total !== 1 ? 's' : ''}`}</span>
                                </p>
                            </div>
                        </div>
                    </StyledHeader>
                    <main>
                        <SectionWrapper title="Playlist" breadcrumb={true}>
                            <StyledDropdown active={!!sortValue}>
                                <label className="sr-only" htmlFor="order-select">Sort Tracks</label>
                                <select name="track-order" id="order-select"
                                        onChange={e => setSortValue(e.target.value)}>
                                    <option value="">Sort Tracks</option>
                                    {sortOptions.map((option, idx) => (
                                        <option value={option} key={idx}>
                                            {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                                        </option>
                                    ))}
                                </select>
                            </StyledDropdown>
                            {tracks ? (
                                <TrackList tracks={sortedTracks}/>
                            ) : (<Loader/>)}
                        </SectionWrapper>
                    </main>
                </>
            )}
        </>
    )
};