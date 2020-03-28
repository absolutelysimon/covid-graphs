////////////////////////////////////////////////////////
//
//              Object Structure
//
/* */

// let data = [
//   { country: { outbreak_startdate: "DATEFORMAT", cases, deaths, recovered } }
// ];

export default function ProcessData(data) {
  debugger;
  let the_countries = [];
  data.forEach(ele => {
    if (!the_countries.includes(ele.region.iso)) {
      the_countries.push(ele.region.iso);
    }
  });

  debugger;
  for (let i of the_countries) {
    debugger;
  }
}
