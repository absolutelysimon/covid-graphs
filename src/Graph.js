import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import regression from "regression";

// function findCountry(thedata, country) {
//   return thedata.filter(ent => ent.country === country);
// }

export default function Graph({
  thedata,
  countries,
  countryCount,
  allCountries,
  dataCategory,
  timeshift = false
}) {
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function ProcessData(thedata, countries) {
    // debugger;
    let new_chart_data = [];
    let found = false;
    countries.forEach(country => {
      thedata.forEach(dataset => {
        if (dataset.country === country && dataset.province === null) {
          // debugger;
          found = true;
          new_chart_data[country] = {
            deaths: dataset.timeline.deaths,
            cases: dataset.timeline.cases
          };
        } else if (dataset.country === country) {
          new_chart_data[country]["provinces"] = [
            ...new_chart_data[country]["provinces"],
            dataset.province
          ];
        }
      });
      if (!found) {
        //Do other stuff
      }
    });
    // debugger;
    return new_chart_data;
  }

  function ProcessProjection(thedata, chart_data, countries) {
    let data_array = [];
    let regression_results = [];
    let idx = 0;
    let filled_data_length = chart_data.length;
    // debugger;
    for (let h = 0; h < 14; h++) {
      let date = new Date(chart_data[chart_data.length - 1]["Date"]);
      chart_data.push({ Date: new Date(date.setDate(date.getDate() + 1)) });
    }
    for (const entry_index in chart_data) {
      const entry = chart_data[entry_index]; // entry = {date:01/24/16,country1-deaths:423}
      for (const country_data_index in entry) {
        if (country_data_index !== "Date") {
          if (!data_array[country_data_index]) {
            data_array[country_data_index] = [];
          }
          data_array[country_data_index].push([
            idx,
            parseInt(entry[country_data_index])
          ]);
        }
      }
      idx += 1;
    }
    let new_array = [];

    for (let data_idx in data_array) {
      console.log("Beginning " + data_idx);
      let shifted_idx = 0;
      while (data_array[data_idx][shifted_idx][1] === 0) {
        shifted_idx += 1;
      }
      new_array[data_idx] = JSON.parse(JSON.stringify(data_array[data_idx]));
      // debugger;
      for (let i in data_array[data_idx]) {
        i = parseInt(i);
        // console.log(
        //   "Array length: " +
        //     data_array[data_idx].length +
        //     " i: " +
        //     i +
        //     "shifted_idx: " +
        //     shifted_idx
        // );
        // console.log(
        //   "Therefore: " + (data_array[data_idx].length > i + shifted_idx + 1)
        // );
        // debugger;
        // console.log(
        //   "Hey javascript, is " +
        //     data_array[data_idx].length +
        //     " greater than " +
        //     (i + shifted_idx + 1) +
        //     "? " +
        //     (data_array[data_idx].length > i + shifted_idx + 1 ? "Yes" : "No")
        // );
        if (data_array[data_idx].length > i + shifted_idx + 1) {
          new_array[data_idx][i][1] =
            new_array[data_idx][i + shifted_idx + 1][1];
        } else {
          new_array[data_idx] = new_array[data_idx].splice(
            0,
            new_array[data_idx].length - shifted_idx - 1
          );
          break;
        }
      }

      //if the first bunch of values are zero
      //     find where it stops being zero
      //     shift the data to this point
      //     regress on the new shifted data
    }

    for (const entry in new_array) {
      const predict = regression.exponential(new_array[entry]).predict;
      let prediction_array = [];
      for (let h = 0; h < 14; h++) {
        chart_data[filled_data_length + h][entry + " - prediction"] = predict(
          new_array[entry].length + h + 1
        )[1];
        prediction_array.push(predict(new_array[entry].length + h + 1));
      }
      let shifted_idx = 0;
      while (data_array[entry][shifted_idx][1] === 0) {
        shifted_idx += 1;
      }
      // debugger;
      regression_results[entry] = regression.exponential(new_array[entry]);
    }
    return chart_data;
  }

  let instance_data = ProcessData(thedata, countries);
  let chart_data = [];
  let y_max = 0;
  for (const ele in instance_data) {
    //chart_data = [{date:01/24/16,country1:}]
    let idx = 0;
    for (const date in instance_data[ele].deaths) {
      // debugger;
      if (parseInt(instance_data[ele].deaths[date]) > y_max) {
        y_max = parseInt(instance_data[ele].deaths[date]);
      }
      // parseInt(value) > y_max ? (y_max = parseInt(value)) : null;
      if (chart_data[idx]) {
        chart_data[idx][ele] = instance_data[ele].deaths[date];
      } else {
        chart_data[idx] = {};
        chart_data[idx]["Date"] = new Date(date);
        chart_data[idx][ele + " - deaths"] = instance_data[ele].deaths[date];
      }
      idx += 1;
    }
    idx = 0;
    for (const date in instance_data[ele].cases) {
      // debugger;
      if (parseInt(instance_data[ele].cases[date]) > y_max) {
        y_max = parseInt(instance_data[ele].cases[date]);
      }
      // parseInt(value) > y_max ? (y_max = parseInt(value)) : null;
      if (chart_data[idx]) {
        chart_data[idx][ele] = instance_data[ele].cases[date];
      } else {
        chart_data[idx] = {};
        chart_data[idx]["Date"] = new Date(date);
        chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
      }
      idx += 1;
    }
  }
  chart_data = ProcessProjection(thedata, chart_data, countries);
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  // debugger;
  return (
    <>
      <div style={{ width: "90%", height: 600 }}>
        <ResponsiveContainer>
          <LineChart
            data={chart_data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" label="Date" />
            {console.log("Setting max to " + y_max)}
            <YAxis domain={[0, 100000]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active) {
                  // debugger;
                  return (
                    <div className="custom-tooltip">
                      <p className="desc">
                        {payload[0].payload.Date.toDateString()} :{" "}
                        {formatNumber(parseInt(payload[0].value))}
                      </p>
                    </div>
                  );
                }
                return "";
              }}
            />
            <Legend />
            {timeshift ? (
              <Line
                key={timeshift}
                type="monotone"
                dataKey={timeshift}
                stroke={getRandomColor()}
              />
            ) : (
              ""
            )}
            {countries.map(country => (
              <Line
                key={country}
                type="monotone"
                dataKey={country + " - deaths"}
                stroke={getRandomColor()}
              />
            ))}
            <Line
              key={"yaaaay"}
              type="monotone"
              dataKey={"usa - deaths - prediction"}
              stroke={getRandomColor()}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

//   let new_chart_data = initializeDates();
//   let y_max = 0;
//   let shifted_startdate = 0;

//   function initializeDates() {
//     let temp_arr = [];
//     for (const [key, value] of Object.entries(thedata[0].timeline.cases)) {
//       temp_arr.push({ date: new Date(key) });
//     }
//     return temp_arr;
//   }

//   function randomCountry() {
//     addCountry(allCountries[Math.floor(Math.random() * 100)].country);
//   }

//   function addCountry(country, shift = 0) {
//     console.log("Adding " + country + " with a shift of " + shift);
//     // debugger;
//     let idx = 0;

//     switch (dataCategory) {
//       case "CASES":
//         for (const [key, value] of Object.entries(
//           thedata.find(ele => ele.country === country).timeline.cases
//         )) {
//           if (parseInt(value) > y_max) {
//             y_max = value;
//           }
//           if (idx - shift > -1 && idx - shift < new_chart_data.length) {
//             new_chart_data[idx - shift][country] = value;
//           }
//           idx += 1;
//         }
//         break;
//       case "DEATHS":
//         for (const [key, value] of Object.entries(
//           thedata.find(ele => ele.country === country).timeline.deaths
//         )) {
//           if (parseInt(value) > y_max) {
//             y_max = value;
//           }
//           // debugger;

//           if (idx - shift > -1 && idx - shift < new_chart_data.length) {
//             new_chart_data[idx - shift][country] = value;
//           }
//           idx += 1;
//         }
//         break;
//       case "RECOVERED":
//         for (const [key, value] of Object.entries(
//           thedata.find(ele => ele.country === country).timeline.recovered
//         )) {
//           if (parseInt(value) > y_max) {
//             y_max = value;
//           }

//           if (idx - shift > -1 && idx - shift < new_chart_data.length) {
//             new_chart_data[idx - shift][country] = value;
//           }
//           idx += 1;
//         }
//         break;
//       default:
//         console.log("It's none");
//         break;
//     }
//   }
//   function getRandomColor() {
//     var letters = "0123456789ABCDEF";
//     var color = "#";
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

//   function calculateShift(timeshift) {
//     // debugger;
//     let idx = 0;
//     for (const [key, value] of Object.entries(
//       thedata.find(ele => ele.country === timeshift).timeline.deaths
//     )) {
//       if (value > 10) {
//         return idx;
//       }
//       idx += 1;
//     }
//   }

//   function getCountriesData() {
//     // debugger;
//     if (timeshift) {
//       shifted_startdate = calculateShift(timeshift);
//       addCountry(timeshift);
//       for (let i of countries) {
//         addCountry(i, calculateShift(i) - shifted_startdate);
//       }
//     } else {
//       for (let i of countries) {
//         // debugger;
//         addCountry(i);
//       }
//     }
//     console.table(new_chart_data);
//   }

//   // debugger;
//   getCountriesData();
//   console.log(thedata);
//   return (
//     <>
//       <div style={{ width: "90%", height: 600 }}>
//         <ResponsiveContainer>
//           <LineChart
//             data={new_chart_data}
//             margin={{
//               top: 5,
//               right: 30,
//               left: 20,
//               bottom: 5
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" label="Date" />
//             {console.log("Setting max to " + y_max)}
//             <YAxis domain={[0, parseInt(y_max)]} />
//             <Tooltip />
//             <Legend />
//             {timeshift ? (
//               <Line
//                 key={timeshift}
//                 type="monotone"
//                 dataKey={timeshift}
//                 stroke={getRandomColor()}
//               />
//             ) : (
//               ""
//             )}
//             {countries.map(country => (
//               <Line
//                 key={country}
//                 type="monotone"
//                 dataKey={country}
//                 stroke={getRandomColor()}
//               />
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </>
//   );
// }
