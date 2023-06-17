import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllTrackInfo, getAudioFeaturesForMultipleTracks} from "../spotify";
import {Loader} from "../components/Loader";
import {StyledHeader} from "../styles/StyledHeader";
import {FeatureChart} from "../components/FeatureChart";
import {formatDuration, getYear} from "../utils";
import {
    Artwork,
    Info,
    TrackContainer,
    ArtistName,
    Album,
    PlayTrackButton,
    Title,
    Features,
    Feature,
    FeatureText,
    FeatureLabel
} from "../styles/TrackStyle";
import {SectionWrapper} from "../components/SectionWrapper";
import {parsePitchClass} from "../utils";

export const Track = ({availableSongs, setAvailableSongs}) => {
    const {id} = useParams();
    const [track, setTrack] = useState(null);
    const [trackAudioFeatures, setTrackAudioFeatures] = useState(null);
    const [trackAudioAnalysis, setTrackAudioAnalysis] = useState(null);

    useEffect(() => {
        const fetchTrackData = async () => {
            const {
                track, audioAnalysis, audioFeatures
            } = await getAllTrackInfo(id);
            setAvailableSongs(prev => {
                const newObj = {};
                Object.keys(prev).forEach(key => {
                    newObj[key] = prev[key];
                });
                newObj[id] = {track, audioAnalysis, audioFeatures};
                return newObj;
            })
            setTrack(track);
            setTrackAudioAnalysis(audioAnalysis);
            setTrackAudioFeatures(audioFeatures.audio_features[0]);
        }
        if (availableSongs.hasOwnProperty(id)) {
            const {track, audioAnalysis, audioFeatures} = availableSongs[id];
            setTrack(track);
            setTrackAudioAnalysis(audioAnalysis);
            setTrackAudioFeatures(audioFeatures.audio_features[0]);
        }
        else {
            fetchTrackData();
        }

    }, [])

    return (<>
            {track ? (<>
                    <StyledHeader style={{justifyContent: "center"}}>
                        <TrackContainer>
                            <Artwork>
                                <img src={track.album.images[0].url} alt="Album Artwork"/>
                            </Artwork>
                            <Info>
                                <Title>{track.name}</Title>
                                <ArtistName>
                                    {track.artists && track.artists.map(({name}, i) => (<span key={i}>
                      {name}
                                            {track.artists.length > 0 && i === track.artists.length - 1 ? '' : ','}
                                            &nbsp;
                    </span>))}
                                </ArtistName>
                                <Album>
                                    <a
                                        href={track.album.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {track.album.name}
                                    </a>{' '}
                                    &middot; {getYear(track.album.release_date)}
                                </Album>
                                <PlayTrackButton
                                    href={track.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Play on Spotify
                                </PlayTrackButton>
                            </Info>
                        </TrackContainer>
                    </StyledHeader>
                    <SectionWrapper breadcrumb={true}>
                        {trackAudioAnalysis && trackAudioFeatures ? (<>
                                <Features>
                                    <Feature>
                                        <FeatureText>{formatDuration(trackAudioFeatures.duration_ms)}</FeatureText>
                                        <FeatureLabel>Duration</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{parsePitchClass(trackAudioFeatures.key)}</FeatureText>
                                        <FeatureLabel>Key</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{trackAudioFeatures.mode === 1 ? 'Major' : 'Minor'}</FeatureText>
                                        <FeatureLabel>Modality</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{trackAudioFeatures.time_signature}</FeatureText>
                                        <FeatureLabel>Time Signature</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{Math.round(trackAudioFeatures.tempo)}</FeatureText>
                                        <FeatureLabel>Tempo (BPM)</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{track.popularity}%</FeatureText>
                                        <FeatureLabel>Popularity</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{trackAudioAnalysis.bars.length}</FeatureText>
                                        <FeatureLabel>Bars</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{trackAudioAnalysis.beats.length}</FeatureText>
                                        <FeatureLabel>Beats</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{trackAudioAnalysis.sections.length}</FeatureText>
                                        <FeatureLabel>Sections</FeatureLabel>
                                    </Feature>
                                    <Feature>
                                        <FeatureText>{trackAudioAnalysis.segments.length}</FeatureText>
                                        <FeatureLabel>Segments</FeatureLabel>
                                    </Feature>
                                </Features>
                                <FeatureChart features={trackAudioFeatures} type=""/>
                            </>) : (<Loader/>)}
                    </SectionWrapper>
                </>) : <Loader/>}
        </>)
}