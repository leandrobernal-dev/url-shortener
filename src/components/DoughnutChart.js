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
                        labels: {
                            generateLabels: (chart) => {
                                let data = chart.data;
                                if (
                                    data.labels.length &&
                                    data.datasets.length
                                ) {
                                    return data.labels.map(function (
                                        label,
                                        index
                                    ) {
                                        let dataset = data.datasets[0];
                                        let currentValue = dataset.data[index];
                                        return {
                                            text: label + ": " + currentValue,
                                            fillStyle:
                                                dataset.backgroundColor[index],
                                            hidden: chart.getDatasetMeta(0)
                                                .data[index].hidden,
                                            lineCap: "round",
                                            lineDash: [],
                                            lineDashOffset: 0,
                                            lineJoin: "round",
                                            lineWidth: 0,
                                            strokeStyle: dataset.borderColor,
                                            pointStyle: dataset.pointStyle,
                                            rotation: 0,
                                            fontColor: "gray",
                                        };
                                    });
                                }
                                return [];
                            },
                        },
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
