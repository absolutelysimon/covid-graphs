import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Graph from "./Graph";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import {
  TextField,
  Grid,
  Chip,
  Checkbox,
  Slider,
  Tooltip,
  ListItem,
} from "@material-ui/core/";
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab/";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    background: "#72777d",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  navBar: {
    display: "flex",
    flexGrow: 1,
    font: "Roboto",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    padding: 10,
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    padding: 0,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  graphHeight: {
    display: "flex",
  },
}));

export default function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [thedata, setThedata] = useState(false);
  const [countries, setCountries] = useState(["Canada"]);
  const [countryCount, setCountryCount] = useState(0);
  const [dataCategory, setDataCategory] = useState("DEATHS");
  const [timeshift, setTimeshift] = useState(false);
  const [deaths, setDeaths] = useState(true);
  const [cases, setCases] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [predictions, setPredictions] = useState(false);
  const [dateMax, setDateMax] = useState(
    Math.floor((new Date() - new Date("01/22/20")) / 86400000) - 1
  );
  const [dateMin, setDateMin] = useState(5);
  const [mode, setMode] = useState("NATIONS");
  const [logarithmic, setLogarithmic] = useState(false);
  const usaURL = "https://covidtracking.com/api/states/daily";
  const proxyUrl = "https://floating-headland-43054.herokuapp.com/",
    targetUrl = "https://corona.lmao.ninja/v2/historical?lastdays=all";
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const graphPaper = clsx(classes.paper, classes.graphHeight);
  if (thedata) {
    let countries_list = [];
    for (let i in thedata) {
      if (!countries_list.includes(thedata[i].country)) {
        countries_list.push(thedata[i].country);
      }
    }
    // console.log(thedata);
    // debugger;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <img src="https://www.fuseinsurance.ca/wp-content/uploads/2018/08/white_cutout-e1534099842420.png" />
            <Box className={clsx(classes.navBar)}>
              <ListItem>Home</ListItem>
              <ListItem>Get Quote</ListItem>
              <ListItem>Knowledge Center</ListItem>
              <ListItem>About</ListItem>
              <ListItem>Contact Us</ListItem>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Grid>
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
              renderInput={(params) => (
                <TextField {...params} label="Add a country" margin="normal" />
              )}
            />
            {countries.map((ele) => (
              <Chip
                label={ele}
                value={ele}
                onDelete={(evt) => {
                  setCountries(countries.filter((e) => e !== ele));
                }}
              />
            ))}
          </Grid>
          <Grid>
            {/* <ListItem>
              Logarithmic
              <Checkbox
                checked={logarithmic}
                onChange={(evt) => console.log(evt.target.checked)}
                label="Logarithmic"
              />
            </ListItem> */}
            <ListItem>
              Cases
              <Checkbox
                checked={cases}
                onChange={(evt) => setCases(evt.target.checked)}
                label="Total Cases"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </ListItem>
            <ListItem>
              Deaths
              <Checkbox
                checked={deaths}
                onChange={(evt) => setDeaths(evt.target.checked)}
                label="Deaths"
              />
            </ListItem>
            <ListItem>
              Active
              <Checkbox
                checked={recovered}
                onChange={(evt) => setRecovered(evt.target.checked)}
                label="Active Cases"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </ListItem>
          </Grid>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
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
              logarithmic={logarithmic}
              dateMax={dateMax}
              dateMin={dateMin}
            />
            <Grid>
              Date Range
              <Slider
                min={0}
                max={Math.floor((new Date() - new Date("01/22/20")) / 86400000)}
                defaultValue={[
                  0,
                  Math.floor((new Date() - new Date("01/22/20")) / 86400000),
                ]}
                marks={Object.keys(
                  thedata[0].timeline.cases
                ).map((ele, index) =>
                  index % 20 === 0 ? { label: ele, value: index } : {}
                )}
                aria-label="custom thumb label"
                onChangeCommitted={(evt, value) => {
                  if (dateMin !== value[0]) {
                    setDateMin(value[0]);
                  }
                  if (dateMax !== value[1]) {
                    setDateMax(value[1]);
                  }
                }}
                ValueLabelComponent={({ children, open, value }) => (
                  <Tooltip
                    open={open}
                    enterTouchDelay={0}
                    placement="top"
                    title={value}
                  >
                    {children}
                  </Tooltip>
                )}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                valueLabelFormat={(value) => {
                  return Object.keys(thedata[0].timeline.cases)[value];
                }}
              />
              <div>
                DateMin:{dateMin}Max:{dateMax}
              </div>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    );
  } else {
    fetch(proxyUrl + targetUrl)
      .then((blob) => blob.json())
      .then((data) => {
        // console.table(data);
        // console.log(data);
        // debugger;
        // let new_data = ProcessData(data.data);
        setThedata(data);
        let c_idx = 0;
        let temp_arr = [];
        for (let p of data) {
          if (!temp_arr.find((ele) => ele.country === p.country)) {
            temp_arr.push({ country: p.country, index: c_idx });
          }
          c_idx += 1;
        }
        // debugger;
        return {};
      })
      .catch((e) => {
        console.log(e);
        return e;
      });
    return <div>Waiting...</div>;
  }
}
