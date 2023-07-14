import { useEffect } from "react";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

function MapChart({ data }) {
    useEffect(() => {
        // Apply the animated theme
        am4core.useTheme(am4themes_animated);

        // Create the map chart instance
        const chart = am4core.create("chartdiv", am4maps.MapChart);
        chart.geodata = am4geodata_worldLow;

        // Disable map interactions only when the cursor is over the map
        chart.chartContainer.events.on("wheel", (event) => {
            event.event.stopPropagation();
        });
        // chart.interactionsEnabled = false;
        chart.seriesContainer.draggable = false;
        chart.seriesContainer.hoverable = true;
        chart.maxZoomLevel = 1;

        // Set the projection
        chart.projection = new am4maps.projections.Miller();

        // Create the polygon series for displaying regions
        const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;

        // Configure the polygon series
        polygonSeries.calculateVisualCenter = true;
        polygonSeries.exclude = ["AQ"]; // Exclude Antarctica from the map

        // Add data to the polygon series
        polygonSeries.data = data;

        // Configure the polygon template
        const polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}: {count}";
        polygonTemplate.nonScalingStroke = true;

        // Disable hover on regions with 0 values
        polygonSeries.mapPolygons.template.events.on("over", (event) => {
            const { dataItem } = event.target;
            if (!dataItem.dataContext.count) {
                // event.preventDefault();
                event.target.isHover = false;
            }
        });

        // Customize the region color based on count
        polygonSeries.mapPolygons.template.adapter.add(
            "fill",
            (fill, target) => {
                const { dataItem } = target;
                if (dataItem.dataContext) {
                    if (dataItem.dataContext.count) {
                        return am4core.color("#005F74"); //#414141 Darker color for regions with views
                    } else {
                        return am4core.color("#20A6B9"); //#CFCFCF Light gray color for regions with no views
                    }
                }
                return fill;
            }
        );

        return () => {
            // Cleanup
            chart.dispose();
        };
    }, [data]);

    return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;
}

export default MapChart;
