import React, { useState } from "react";
import logo from "./logo.svg";
import Graph from "./Graph";
import "./App.css";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Grid,
  FormControl,
  OutlinedInput,
  Chip,
  Checkbox,
  Slider
} from "@material-ui/core/";
import { Autocomplete } from "@material-ui/lab/";
import ProcessData from "./ProcessData";

function App() {
  const [thedata, setThedata] = useState(false);
  const [countries, setCountries] = useState(["Canada"]);
  const [countryCount, setCountryCount] = useState(0);
  const [dataCategory, setDataCategory] = useState("DEATHS");
  const [timeshift, setTimeshift] = useState(false);
  const [deaths, setDeaths] = useState(true);
  const [cases, setCases] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [predictions, setPredictions] = useState(false);
  const [dateMax, setDateMax] = useState(0);
  const [dateMin, setDateMin] = useState(50);
  const usaURL = "https://covidtracking.com/api/states/daily";
  const proxyUrl = "https://floating-headland-43054.herokuapp.com/",
    targetUrl = "https://corona.lmao.ninja/v2/historical";
  // debugger;

  if (thedata) {
    let countries_list = [];
    for (let i in thedata) {
      if (!countries_list.includes(thedata[i].country)) {
        countries_list.push(thedata[i].country);
      }
    }
    // console.log(thedata);
    debugger;
    let temp_date_min = dateMin;
    let temp_date_max = dateMax;
    return (
      <>
        <Grid>
          <Grid item xs={12}>
            <Graph
              thedata={thedata}
              countries={countries}
              countryCount={countryCount}
              allCountries={countries_list}
              dataCategory={dataCategory}
              timeshift={timeshift}
              deaths={deaths}
              cases={cases}
              recovered={recovered}
              predictions={predictions}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={countries_list}
              clearOnEscape
              id="timeshift"
              debug
              onChange={(evt, newValue) => {
                if (newValue) {
                  setCountries([...countries, newValue]);
                }
              }}
              renderInput={params => (
                <TextField {...params} label="Add a country" margin="normal" />
              )}
            />
            {countries.map(ele => (
              <Chip
                label={ele}
                value={ele}
                onDelete={evt => {
                  setCountries(countries.filter(e => e !== ele));
                }}
              />
            ))}
          </Grid>
          <Grid item xs={6}>
            Cases
            <Checkbox
              checked={cases}
              onChange={evt => setCases(evt.target.checked)}
              label="Total Cases"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            Deaths
            <Checkbox
              checked={deaths}
              onChange={evt => setDeaths(evt.target.checked)}
              label="Deaths"
            />
            Active
            <Checkbox
              checked={recovered}
              onChange={evt => setRecovered(evt.target.checked)}
              label="Active Cases"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Grid>
          <Grid item xs={6}>
            Date Range
            <Slider
              defaultValue={[
                0,
                Math.floor((new Date() - new Date("01/22/20")) / 86400000) - 1
              ]}
              marks={Object.keys(thedata[0].timeline.cases).map((ele, index) =>
                index % 20 === 0 ? { label: ele, value: index } : {}
              )}
              onChangeCommitted={(evt, value) => {
                if (dateMin !== value[0]) {
                  setDateMin(value[0]);
                }
                if (dateMax !== value[1]) {
                  setDateMax(value[1]);
                }
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              valueLabelFormat={value => {
                return Object.keys(thedata[0].timeline.cases)[value];
              }}
            />
            <Slider
              defaultValue={20}
              aria-labelledby="discrete-slider-custom"
              step={10}
              valueLabelDisplay="auto"
            />
            <div>
              DateMin:{dateMin}Max:{dateMax}
            </div>
          </Grid>
        </Grid>
      </>
    );
  } else {
    fetch(proxyUrl + targetUrl)
      .then(blob => blob.json())
      .then(data => {
        // console.table(data);
        // console.log(data);
        // debugger;
        // let new_data = ProcessData(data.data);
        setThedata(data);
        let c_idx = 0;
        let temp_arr = [];
        for (let p of data) {
          if (!temp_arr.find(ele => ele.country === p.country)) {
            temp_arr.push({ country: p.country, index: c_idx });
          }
          c_idx += 1;
        }
        // debugger;
        return {};
      })
      .catch(e => {
        console.log(e);
        return e;
      });
    return <div>Waiting...</div>;
  }
}

export default App;

/*
        <Autocomplete
          multiple
          id="tags-standard"
          options={top100Films}
          getOptionLabel={option => option.title}
          defaultValue={[top100Films[13]]}
          renderInput={params => (
            <TextField
              {...params}
              variant="standard"
              label="Multiple values"
              placeholder="Favorites"
            />
          )}
        />

        
        <Select onChange={evt => setDataCategory(evt.target.value)}>
          <MenuItem value={"CASES"}>Total Cases</MenuItem>
          <MenuItem value={"RECOVERED"}>Recovered</MenuItem>
          <MenuItem value={"DEATHS"}>Deaths</MenuItem>
          <MenuItem></MenuItem>
        </Select>
        */
