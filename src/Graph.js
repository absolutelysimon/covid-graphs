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
  function ProcessData(thedata, countries) {
    countries.forEach(ele => {});
  }

  return (
    <>
      <div style={{ width: "90%", height: 600 }}>
        <ResponsiveContainer>
          <LineChart
            data={new_chart_data}
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
            <YAxis domain={[0, parseInt(y_max)]} />
            <Tooltip />
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
                dataKey={country}
                stroke={getRandomColor()}
              />
            ))}
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
