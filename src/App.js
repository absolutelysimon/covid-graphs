import React, { useState } from "react";
import logo from "./logo.svg";
import Graph from "./Graph";
import "./App.css";
import { Button, MenuItem, Select, TextField } from "@material-ui/core/";
import { Autocomplete } from "@material-ui/lab/";

function App() {
  const [thedata, setThedata] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryCount, setCountryCount] = useState(0);
  const [allCountries, setAllCountries] = useState([]);
  const [dataCategory, setDataCategory] = useState("DEATHS");
  const [timeshift, setTimeshift] = useState(false);
  const proxyUrl = "https://floating-headland-43054.herokuapp.com/",
    targetUrl = "https://corona.lmao.ninja/historical";

  if (thedata) {
    // console.log("Res array: " + res_arr);
    // debugger;
    return (
      <>
        <Graph
          thedata={thedata}
          countries={countries}
          countryCount={countryCount}
          allCountries={allCountries}
          dataCategory={dataCategory}
          timeshift={timeshift}
        />
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

        <Autocomplete
          options={allCountries}
          getOptionLabel={option => option.country}
          id="timeshift"
          debug
          onChange={(evt, newValue) => setTimeshift(newValue.country)}
          renderInput={params => (
            <TextField {...params} label="Timeshift Base" margin="normal" />
          )}
        />
        <Autocomplete
          options={allCountries}
          getOptionLabel={option => option.country}
          id="comparison"
          debug
          onChange={(evt, newValue) =>
            setCountries([...countries, newValue.country])
          }
          renderInput={params => (
            <TextField {...params} label="Compare against" margin="normal" />
          )}
        />
      </>
    );
  } else {
    fetch(proxyUrl + targetUrl)
      .then(blob => blob.json())
      .then(data => {
        // console.table(data);
        // console.log(data);
        setThedata(data);
        let c_idx = 0;
        let temp_arr = [];
        for (let p of data) {
          if (!temp_arr.find(ele => ele.country === p.country)) {
            temp_arr.push({ country: p.country, index: c_idx });
          }
          c_idx += 1;
        }
        setAllCountries(temp_arr);
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
