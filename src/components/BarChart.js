import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

const BarChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");
        const pieChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.location
                    ? data.location.map((url) =>
                          url._id ? String(url._id).split(";")[2] : "Null"
                      )
                    : [],
                datasets: [
                    {
                        label: "Locations",
                        data: data.location
                            ? data.location.map((url) =>
                                  url.count ? url.count : "Null"
                              )
                            : [],
                        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
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

export default BarChart;
