// ProgressChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ProgressChartProps {
    labels: string[]; // Dates
    data: number[]; // Corresponding weights or reps
}

const ProgressChart: React.FC<ProgressChartProps> = ({ labels, data }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Max Weight Lifted',
                data,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(0, 117, 216, 0.8)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(75, 192, 192)',
                pointHoverBackgroundColor: 'rgb(75, 192, 192)',
                pointHoverBorderColor: 'white',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHitRadius: 10,
            },
        ],
    };

    const options: any = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                },
                ticks: {
                    color: 'gray',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'gray',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top', // Ensure this is either 'top', 'left', 'bottom', or 'right'
                labels: {
                    color: 'blue',
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
            },
        },
    };


    return <Line data={chartData} options={options} />;
};

export default ProgressChart;
