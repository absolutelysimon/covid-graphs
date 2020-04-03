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
  deaths,
  cases,
  recovered,
  predictions,
  timeshift = false
}) {
  // let all_countries = [];
  // for (let i in thedata) {
  //   if (!all_countries.includes(thedata[i].country)) {
  //     all_countries.push(thedata[i].country);
  //   }
  // }
  // console.log(JSON.stringify(all_countries));
  // debugger;
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
    // debugger;
    countries.forEach(country => {
      new_chart_data[country] = [];
      thedata.forEach(dataset => {
        if (dataset.country === country && dataset.province === null) {
          found = true;
          new_chart_data[country] = {
            deaths: dataset.timeline.deaths,
            cases: dataset.timeline.cases,
            recovered: dataset.timeline.recovered
          };
        } else if (dataset.country === country) {
          if (new_chart_data[country]["provinces"]) {
            new_chart_data[country]["provinces"].push({
              province: dataset.province,
              deaths: dataset.timeline.deaths,
              cases: dataset.timeline.cases,
              recovered: dataset.timeline.recovered
            });
          } else {
            new_chart_data[country]["provinces"] = [
              {
                province: dataset.province,
                deaths: dataset.timeline.deaths,
                cases: dataset.timeline.cases,
                recovered: dataset.timeline.recovered
              }
            ];
            // debugger;
          }
        }
      });
      if (!found) {
        // debugger;
        for (let country in new_chart_data) {
          if (!new_chart_data[country]["deaths"]) {
            let total_deaths = [];
            let total_cases = [];
            let total_recovered = [];
            // debugger;
            for (let province in new_chart_data[country]["provinces"]) {
              let province_data =
                new_chart_data[country]["provinces"][province];
              for (let death_date in province_data.deaths) {
                if (total_deaths[death_date]) {
                  total_cases[death_date] += parseInt(
                    province_data.cases[death_date]
                  );
                  total_deaths[death_date] += parseInt(
                    province_data.deaths[death_date]
                  );
                  total_recovered[death_date] += parseInt(
                    province_data.recovered[death_date]
                  );
                } else {
                  total_deaths[death_date] = parseInt(
                    province_data.deaths[death_date]
                  );
                  total_cases[death_date] = parseInt(
                    province_data.cases[death_date]
                  );
                  total_recovered[death_date] = parseInt(
                    province_data.recovered[death_date]
                  );
                }
              }
            }
            // debugger;
            new_chart_data[country]["deaths"] = total_deaths;
            new_chart_data[country]["cases"] = total_cases;
            new_chart_data[country]["recovered"] = total_recovered;
          }
        }
      }
      found = false;
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
  for (const ele in instance_data) {
    //chart_data = [{date:01/24/16,country1:}]
    let idx = 0;
    for (const date in instance_data[ele].deaths) {
      // debugger;
      // if (parseInt(instance_data[ele].deaths[date]) > y_max) {
      //   y_max = parseInt(instance_data[ele].deaths[date]);
      // }
      // parseInt(value) > y_max ? (y_max = parseInt(value)) : null;
      if (chart_data[idx]) {
        if (deaths) {
          chart_data[idx][ele + " - deaths"] = instance_data[ele].deaths[date];
        }
        if (cases) {
          chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
        }
        if (recovered) {
          chart_data[idx][ele + " - active cases"] =
            instance_data[ele].cases[date] - instance_data[ele].recovered[date];
        }
      } else {
        chart_data[idx] = {};
        chart_data[idx]["Date"] = new Date(date);
        if (deaths) {
          chart_data[idx][ele + " - deaths"] = instance_data[ele].deaths[date];
        }
        if (cases) {
          chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
        }
        if (recovered) {
          chart_data[idx][ele + " - active cases"] =
            instance_data[ele].cases[date] - instance_data[ele].recovered[date];
        }
      }
      idx += 1;
    }
    idx = 0;
    // for (const date in instance_data[ele].cases) {
    //   // debugger;
    //   // if (parseInt(instance_data[ele].cases[date]) > y_max) {
    //   //   y_max = parseInt(instance_data[ele].cases[date]);
    //   // }
    //   // parseInt(value) > y_max ? (y_max = parseInt(value)) : null;
    //   if (chart_data[idx]) {
    //     chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
    //   } else {
    //     chart_data[idx] = {};
    //     chart_data[idx]["Date"] = new Date(date);
    //     chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
    //   }
    //   idx += 1;
    // }
    // idx = 0;
    // for (const date in instance_data[ele].cases) {
    //   // debugger;
    //   // if (parseInt(instance_data[ele].cases[date]) > y_max) {
    //   //   y_max = parseInt(instance_data[ele].cases[date]);
    //   // }
    //   // parseInt(value) > y_max ? (y_max = parseInt(value)) : null;
    //   if (chart_data[idx]) {
    //     chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
    //   } else {
    //     chart_data[idx] = {};
    //     chart_data[idx]["Date"] = new Date(date);
    //     chart_data[idx][ele + " - cases"] = instance_data[ele].cases[date];
    //   }
    //   idx += 1;
    // }
  }
  if (predictions) {
    chart_data = ProcessProjection(thedata, chart_data, countries);
  }
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  let y_max = 0;
  for (let line in chart_data) {
    for (let entry in chart_data[line]) {
      // debugger;
      if (
        entry !== "Date" &&
        parseInt(chart_data[line][entry]) > y_max &&
        ((entry.includes("deaths") && deaths) ||
          (entry.includes("cases") && (cases || recovered)))
      ) {
        y_max = chart_data[line][entry];
      }
    }
  }
  y_max = y_max * 1.1;
  y_max = Math.ceil(y_max / 10) * 10;
  for (let h = 0; h < 7; h++) {
    let date = new Date(chart_data[chart_data.length - 1]["Date"]);
    chart_data.push({ Date: new Date(date.setDate(date.getDate() + 1)) });
  }
  // console.log("Ymax: " + y_max);
  // y_max = y_max * 1.1;
  // console.log(y_max);
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
            {/* {console.log("Setting max to " + y_max)} */}
            <YAxis domain={[0, parseInt(y_max)]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload[0]) {
                  // debugger;
                  return (
                    <div className="custom-tooltip">
                      <h3>{payload[0].payload.Date.toDateString()}</h3>
                      {payload.map(ele => (
                        <div>
                          {ele.name} - {formatNumber(parseInt(ele.value))}
                        </div>
                      ))}
                    </div>
                  );
                }
                return "";
              }}
            />
            <Legend />
            {countries.map(country => {
              let jsx_bundle = [];
              if (deaths) {
                jsx_bundle.push(
                  <Line
                    key={country + " - deaths"}
                    type="monotone"
                    dataKey={country + " - deaths"}
                    stroke={getRandomColor()}
                  />
                );
              }
              if (cases) {
                // debugger;
                jsx_bundle.push(
                  <Line
                    key={country + " - cases"}
                    type="monotone"
                    dataKey={country + " - cases"}
                    stroke={getRandomColor()}
                  />
                );
              }
              if (recovered) {
                jsx_bundle.push(
                  <Line
                    key={country + " - active cases"}
                    type="monotone"
                    dataKey={country + " - active cases"}
                    stroke={getRandomColor()}
                  />
                );
              }
              if (predictions) {
                if (deaths) {
                  jsx_bundle.push(
                    <Line
                      key={country + " - deaths - prediction"}
                      type="monotone"
                      dataKey={country + " - deaths - prediction"}
                      stroke={getRandomColor()}
                    />
                  );
                }
                if (cases) {
                  jsx_bundle.push(
                    <Line
                      key={country + " - cases - prediction"}
                      type="monotone"
                      dataKey={country + " - cases - prediction"}
                      stroke={getRandomColor()}
                    />
                  );
                }
                if (recovered) {
                  jsx_bundle.push(
                    <Line
                      key={country + " - active cases - prediction"}
                      type="monotone"
                      dataKey={country + " - active cases - prediction"}
                      stroke={getRandomColor()}
                    />
                  );
                }
              }
              return jsx_bundle;
            })}
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
