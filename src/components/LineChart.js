import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

const LineChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");
        const pieChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: "2023",
                        data: data.values,
                        backgroundColor: data.colors,
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            },
        });

        return () => {
            pieChart.destroy();
        };
    }, [data]);

    return <canvas id="pie-chart-canvas" ref={chartRef} />;
};

export default LineChart;
