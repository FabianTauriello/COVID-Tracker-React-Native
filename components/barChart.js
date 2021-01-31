import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Svg, G, Rect, Line, Text as SvgText } from "react-native-svg";
import * as d3 from "d3";
import { formatYTickLabel } from "../utils/helperFunctions";

function called(item) {
  console.log("called for item...");
  console.log(item);
}

// retrieve the first 3 letters from a date
function getDayOfWeek(item) {
  const d = new Date(item.reportDate);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekday[d.getDay()];
}

// d3 graph for displaying new cases (worldwide) over the last 7 days
export default function BarChart({ data }) {
  // set up dimensions
  const SVGWidth = Dimensions.get("window").width;
  const SVGHeight = 165;
  const graphWidth = Dimensions.get("window").width - 25;
  const graphHeight = 140;
  const graphBarWidth = 40;

  // X scale
  const xDomain = data.map((item) => item.reportDate);
  const xRange = [0, graphWidth];
  const xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(1);

  // Y scale
  const minTemp = d3.min(data, (d) => d.deltaConfirmed);
  const numberToDeduct = minTemp * 0.1;
  const min = minTemp - numberToDeduct; // minus 10% from min instead of starting domain at 0
  const max = d3.max(data, (d) => d.deltaConfirmed) * 1.1; // add 10% to leave some room above highest bar
  const yDomain = [min, max];
  const yRange = [0, graphHeight];
  const yScale = d3.scaleLinear().domain(yDomain).range(yRange).nice(5);

  // ticks for y axis
  const ticks = d3.ticks(min, max, 5);

  return (
    <View>
      <Text style={styles.title}>Daily New Cases for past week</Text>
      <Svg width={SVGWidth} height={SVGHeight}>
        <G y={graphHeight} x={30} fill="black">
          {/* y axis ticks */}
          {ticks.map((tick) => {
            return (
              <Line
                key={tick}
                x1={16}
                x2={20}
                y1={yScale(tick) * -1}
                y2={yScale(tick) * -1}
                stroke="black"
                strokeWidth={1}
              />
            );
          })}
          {/* y axis tick labels */}
          {ticks.map((tick) => {
            return (
              <SvgText
                key={tick}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                x={0}
                y={yScale(tick) * -1 + 3}
              >
                {formatYTickLabel(tick)}
              </SvgText>
            );
          })}
          {/* bars */}
          {data.map((item, index) => {
            return (
              <Rect
                key={item.reportDate}
                x={xScale(item.reportDate) - graphBarWidth / 2}
                y={yScale(item.deltaConfirmed) * -1}
                width={graphBarWidth}
                height={yScale(item.deltaConfirmed)}
                fill="#5481b0"
              />
            );
          })}
          {/* x axis line */}
          <Line
            x1={23}
            x2={graphWidth - 23}
            y1={0}
            y2={0}
            stroke="black"
            strokeWidth={1}
          />
          {/* x axis labels */}
          {data.map((item) => {
            return (
              <SvgText
                key={item.reportDate}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                x={xScale(item.reportDate)}
                y={18}
              >
                {getDayOfWeek(item)}
              </SvgText>
            );
          })}
          {/* x axis ticks */}
          {data.map((item) => {
            return (
              <Line
                key={item.reportDate}
                x1={xScale(item.reportDate)}
                x2={xScale(item.reportDate)}
                y1={2}
                y2={6}
                stroke="black"
                strokeWidth={1}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginStart: 10,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 17,
  },
});
