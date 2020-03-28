import React, { useState } from "react";
import logo from "./logo.svg";
import Graph from "./Graph";
import "./App.css";
import countries_list from "./countries_list";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Grid,
  FormControl,
  OutlinedInput,
  Chip,
  Checkbox
} from "@material-ui/core/";
import { Autocomplete } from "@material-ui/lab/";
import ProcessData from "./ProcessData";

function App() {
  const [thedata, setThedata] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryCount, setCountryCount] = useState(0);
  const [allCountries, setAllCountries] = useState([]);
  const [dataCategory, setDataCategory] = useState("DEATHS");
  const [timeshift, setTimeshift] = useState(false);
  const [deaths, setDeaths] = useState(true);
  const [cases, setCases] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const usaURL = "https://covidtracking.com/api/states/daily";
  const proxyUrl = "https://floating-headland-43054.herokuapp.com/",
    targetUrl = "https://corona.lmao.ninja/v2/historical";
  // debugger;

  if (thedata) {
    // console.log(thedata);
    // debugger;
    return (
      <>
        <Grid>
          <Grid item xs={5}>
            <Graph
              thedata={thedata}
              countries={countries}
              countryCount={countryCount}
              allCountries={countries_list}
              dataCategory={dataCategory}
              timeshift={timeshift}
              deaths={deaths}
              cases={cases}
              recoverd={recovered}
            />
          </Grid>
          <Grid item xs={2}>
            <Autocomplete
              options={countries_list}
              clearOnEscape
              id="timeshift"
              debug
              onInputChange={(evt, newValue) =>
                setCountries([...countries, newValue])
              }
              renderInput={params => (
                <TextField {...params} label="Add a country" margin="normal" />
              )}
            />
            {countries.map(ele => (
              <Chip
                label={ele}
                onDelete={(evt, oldValue) =>
                  setCountries(countries.indexOf(oldValue), 1)
                }
              />
            ))}

            <Checkbox
              checked={cases}
              onChange={setCases(evt => evt.target.checked)}
              label="Cases"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            <Checkbox
              checked={cases}
              onChange={setDeaths(evt => evt.target.checked)}
              label="Deaths"
            />
            <Checkbox
              checked={cases}
              label="Recoveries"
              onChange={setRecovered(evt => evt.target.checked)}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Grid>
        </Grid>
        <Button
          onClick={() =>
            setCountries(countries => {
              // debugger;
              return [
                ...countries,
                allCountries[Math.floor(Math.random() * allCountries.length)]
                  .country
              ];
            })
          }
        >
          Random Country
        </Button>
        <Select onChange={evt => setDataCategory(evt.target.value)}>
          <MenuItem value={"CASES"}>Total Cases</MenuItem>
          <MenuItem value={"RECOVERED"}>Recovered</MenuItem>
          <MenuItem value={"DEATHS"}>Deaths</MenuItem>
          <MenuItem></MenuItem>
        </Select>
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
        setAllCountries(temp_arr.sort((a, b) => a.country > b.country));
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
        */
