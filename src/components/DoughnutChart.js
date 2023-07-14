import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

const DoughnutChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");
        const pieChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: data.title,
                        data: data.values,
                        backgroundColor: data.colors,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "right",
                        align: "start",
                    },
                    title: {
                        display: true,
                        text: data.title,
                    },
                },
            },
        });

        return () => {
            pieChart.destroy();
        };
    }, [data]);

    return <canvas ref={chartRef} />;
};

export default DoughnutChart;
