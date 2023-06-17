import {useState, useEffect} from "react";
import {catchErrors} from "../utils";
import {getCurrentUserTopTracks} from "../spotify";
import {SectionWrapper} from "../components/SectionWrapper";
import {TimeRangeButtons} from "../components/TimeRangeButtons";
import {TrackList} from "../components/TrackList";
import {Loader} from "../components/Loader";

export const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {
            const {data} = await getCurrentUserTopTracks(`${activeRange}_term`);
            setTopTracks(data);
        };

        catchErrors(fetchData,null, []);
    }, [activeRange]);

    return (
        <main>
            <SectionWrapper title="Top Tracks" breadcrumb={true}>
                <TimeRangeButtons
                    activeRange={activeRange}
                    setActiveRange={setActiveRange}
                />

                {topTracks && topTracks.items ? (
                    <TrackList tracks={topTracks.items}/>
                ) : (<Loader/>)}
            </SectionWrapper>
        </main>
    );
};