import {useState, useEffect} from "react";
import {getCurrentUserTopArtists} from "../spotify";
import {catchErrors} from "../utils";
import {SectionWrapper} from "../components/SectionWrapper";
import {ArtistsGrid} from "../components/ArtistsGrid";
import {TimeRangeButtons} from "../components/TimeRangeButtons";
import {Loader} from "../components/Loader";

export const TopArtists = () => {
    const [topArtists, setTopArtists] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {
            const {data} = await getCurrentUserTopArtists(`${activeRange}_term`);
            setTopArtists(data);
        };

        catchErrors(fetchData,null, []);
    }, [activeRange]);

    return (
        <main>
            <SectionWrapper title="Top Artists" breadcrumb={true}>
                <TimeRangeButtons
                    activeRange={activeRange}
                    setActiveRange={setActiveRange}
                />

                {topArtists && topArtists.items ? (
                    <ArtistsGrid artists={topArtists.items}/>
                ) : (<Loader/>)}
            </SectionWrapper>
        </main>
    );
};
