import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

import Paper from "@mui/material/Paper";

import dayjs from "dayjs";
import {
  City7DayWeather,
  CityLoationInfo,
  CityNowWeather,
  getNowWeather,
  getPre7DayWeather,
} from "../../apis";
import CitySelect from "../city-select";

const Weeks = ["日", "一", "二", "三", "四", "五", "六"];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const defaultCity: CityLoationInfo = {
  name: "上海",
  id: "101020100",
  lat: "31.23171",
  lon: "121.47264",
  adm2: "上海",
  adm1: "上海市",
  country: "中国",
  tz: "Asia/Shanghai",
  utcOffset: "+08:00",
  isDst: "0",
  type: "city",
  rank: "11",
  fxLink: "https://www.qweather.com/weather/shanghai-101020100.html",
};

export default function BasicCard() {
  const [city, setCity] = React.useState(defaultCity);
  const [nowWeather, setNowWeather] = React.useState<CityNowWeather>();
  const [sevenWeather, setSevenWeather] = React.useState<City7DayWeather>();

  const initData = React.useCallback(async () => {
    const nowWeatherRes = await getNowWeather(city.id);
    const sevenWeatherRes = await getPre7DayWeather(city.id);

    setNowWeather(nowWeatherRes);
    setSevenWeather(sevenWeatherRes);
  }, [city]);

  React.useEffect(() => {
    initData();
  }, [initData]);

  return (
    <Card
      sx={{
        minWidth: 700,
        textAlign: "left",
      }}
    >
      <CitySelect
        value={city}
        onChange={(v) => {
          setCity(v);
        }}
      ></CitySelect>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flex: "1 0 auto", alignItems: "center" }}>
            <i
              style={{ fontSize: "50px" }}
              className={`qi-${nowWeather?.now.icon}`}
            ></i>
            <Box>
              <Typography
                variant="h2"
                component="div"
                sx={{ display: "flex" }}
                mr={2}
              >
                {nowWeather?.now.temp}
                <Box sx={{ display: "inline-block" }}>
                  <Typography variant="h5">&#176;C</Typography>
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                湿度：{nowWeather?.now.humidity}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                风速：{nowWeather?.now.windSpeed} 公里/时
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" component="div">
              天气
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {dayjs().format("YYYY-MM-DD HH:mm")} 星期{Weeks[dayjs().day()]}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {nowWeather?.now.text}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardContent>
        <Box>
          <Grid container spacing={1} columns={7}>
            {sevenWeather?.daily.map((i) => {
              return (
                <Grid size={1} key={i.fxDate}>
                  <Item>
                    <Typography>
                      {dayjs(new Date(i.fxDate)).format("MM-DD")}
                    </Typography>
                    <i
                      className={`qi-${i.iconDay}`}
                      style={{ fontSize: "35px" }}
                    ></i>
                    <Typography>
                      {i.tempMin}&#176; ~ {i.tempMax}&#176;
                    </Typography>
                  </Item>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
