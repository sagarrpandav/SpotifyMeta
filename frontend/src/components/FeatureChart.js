import styled from "styled-components";
import {Bar} from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";

const properties = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'speechiness', 'valence',];
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const FeatureChart = ({features}) => {

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    const createDataset = features => {
        const dataset = {};
        properties.forEach(prop => {
            dataset[prop] = features.length ? avg(features.map(feat => feat && feat[prop])) : features[prop];
        });
        return dataset;
    };

    const data = createDataset(features);
    return (<Container>
        <Bar style={{margin: '0 auto', marginTop: '-30px', height: '25vw'}}
             data={{
                 labels: properties.map(i => i.charAt(0).toUpperCase() + i.slice(1,)), datasets: [{
                     label: "Values",
                     data: Object.values(data),
                     backgroundColor: ['rgba(255, 99, 132, 0.3)', 'rgba(255, 159, 64, 0.3)', 'rgba(255, 206, 86, 0.3)', 'rgba(75, 192, 192, 0.3)', 'rgba(54, 162, 235, 0.3)', 'rgba(104, 132, 245, 0.3)', 'rgba(153, 102, 255, 0.3)',],
                     borderColor: ['rgba(255,99,132,1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(104, 132, 245, 1)', 'rgba(153, 102, 255, 1)',],
                     borderWidth: 1,
                 }]
             }}
             options={{
                 plugins: {
                     legend: false, title: {
                         display: true, text: `Audio Features`, fontSize: 18, fontColor: '#ffffff', padding: 30,
                     },
                 }, scales: {
                     xAxes: [{

                         ticks: {
                             fontSize: 12,
                         },
                     },], yAxes: [{
                         ticks: {
                             beginAtZero: true, fontSize: 12,
                         },
                     },]
                 }
             }}/>
    </Container>);
};