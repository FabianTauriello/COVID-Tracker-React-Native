import React from "react";
import * as d3 from "d3";
import { formatYTickLabel } from "../utils/helperFunctions";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Path, Svg, G, Line, Text as SvgText } from "react-native-svg";

function getDayOfMonth(date) {
  const d = new Date(date);
  return d.getDate();
}

export default function LineChart(props) {
  // set up data
  // 31 objects passed into props so I can calculate the difference between each day,
  // and insert them into a new data array with 30 objects
  const newCases = [];
  props.data.forEach((item, index) => {
    // skip first day
    if (index != 0) {
      newCases.push({
        date: item.Date,
        // calculate the difference between current day and previous day
        cases: Math.abs(props.data[index - 1].Cases - item.Cases),
      });
    }
  });

  const data = [];
  newCases.forEach((value, index, array) => {
    if (index >= 6) {
      // calculate 7-day average for chart
      const sum =
        value.cases +
        array[index - 1].cases +
        array[index - 2].cases +
        array[index - 3].cases +
        array[index - 4].cases +
        array[index - 5].cases +
        array[index - 6].cases;
      const avg = Math.round(sum / 7);
      data.push({
        date: value.date,
        cases: avg,
      });
    }
  });

  // set up dimensions
  const SVGWidth = Dimensions.get("window").width;
  const SVGHeight = 175;
  const graphWidth = Dimensions.get("window").width - 70;
  const graphHeight = 150;

  // X scale
  const xDomain = data.map(item => item.date);
  const xRange = [0, graphWidth];
  const xScale = d3.scaleBand().domain(xDomain).range(xRange);

  // Y scale
  const minTemp = d3.min(data, d => d.cases);
  const numberToDeduct = minTemp * 0.1;
  const min = minTemp - numberToDeduct; // minus 10% from min instead of starting domain at 0
  const max = d3.max(data, d => d.cases) * 1.1; // add 10% to leave some room above highest bar
  const yDomain = [min, max];
  const yRange = [graphHeight, 0];
  const yScale = d3.scaleLinear().domain(yDomain).range(yRange);

  // ticks
  const yTicks = d3.ticks(min, max, 5);
  // create custom ticks for x axis
  const xTicks = [];
  for (let i = 2; i < data.length; i += 4) {
    xTicks.push(data[i]);
  }

  // path function
  const line = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.cases));

  return (
    <View style={{ zIndex: 1 }}>
      <Text style={[styles.title, { zIndex: 1 }]}>
        Daily New Cases for 30 days
      </Text>
      <Svg width={SVGWidth} height={SVGHeight} style={{ zIndex: 10 }}>
        <G y={0} x={50} fill="black">
          {/* y axis ticks */}
          {yTicks.map(tick => {
            return (
              <Line
                key={tick}
                x1={-5}
                x2={-2}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="black"
                strokeWidth={1}
              />
            );
          })}
          {/* y axis tick labels */}
          {yTicks.map(tick => {
            return (
              <SvgText
                key={tick}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                x={-22}
                y={yScale(tick) + 3}
              >
                {formatYTickLabel(tick)}
              </SvgText>
            );
          })}
          {/* path line */}
          <Path
            data={data}
            d={line(data)}
            fill="transparent"
            stroke="#5682ae"
            stroke-width="5"
          />
          {/* x axis line */}
          <Line
            x1={0}
            x2={graphWidth}
            y1={graphHeight}
            y2={graphHeight}
            stroke="black"
            strokeWidth={1}
          />
          {/* x axis labels */}
          {xTicks.map((item, index) => {
            return (
              <SvgText
                key={item.date}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                x={xScale(item.date)}
                y={graphHeight + 20}
              >
                {getDayOfMonth(item.date)}
              </SvgText>
            );
          })}
          {/* x axis ticks */}
          {xTicks.map((item, index) => {
            return (
              <Line
                key={item.date}
                x1={xScale(item.date)}
                x2={xScale(item.date)}
                y1={graphHeight + 2}
                y2={graphHeight + 6}
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
