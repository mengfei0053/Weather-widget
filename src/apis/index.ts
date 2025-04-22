import axios from "axios";

export const API_KEY = "db161d1e8e3e453ca8ef5f55edcc0bdf";

const request = axios.create({
  params: {
    key: API_KEY,
  },
});

export interface CityLoationInfo {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
  tz: string;
  utcOffset: string;
  isDst: string;
  type: string;
  rank: string;
  fxLink: string;
}

export interface CityInfo {
  code: string;
  location: CityLoationInfo[];
  refer: {
    sources: string[];
    license: string[];
  };
}

export const getCitys = async (search: string) => {
  const res = await request.get(
    `https://n24nmrg49r.re.qweatherapi.com/geo/v2/city/lookup?location=${search}`
  );
  const data = res.data as CityInfo;
  if (data.code === "200" && data.location.length > 0) {
    return data.location;
  }
  throw new Error("获取城市信息失败");
};

export const getCityLocationId = async (city: string): Promise<string> => {
  const res = await request.get(
    `https://n24nmrg49r.re.qweatherapi.com/geo/v2/city/lookup?location=${city}`
  );
  const data = res.data as CityInfo;
  if (data.code === "200" && data.location.length > 0) {
    return data.location[0].id;
  }
  throw new Error("获取城市ID失败");
};

export interface CityNowWeather {
  code: string;
  updateTime: string;
  fxLink: string;
  now: {
    obsTime: string;
    temp: string;
    feelsLike: string;
    icon: string;
    text: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud: string;
    dew: string;
  };
  refer: {
    sources: string[];
    license: string[];
  };
}

export const getNowWeather = async (cityLocationId: string) => {
  const res = await request.get(
    `https://n24nmrg49r.re.qweatherapi.com/v7/weather/now?location=${cityLocationId}`
  );
  return res.data as CityNowWeather;
};

export interface City7DayWeather {
  code: string;
  updateTime: string;
  fxLink: string;
  daily: {
    fxDate: string;
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moonPhase: string;
    moonPhaseIcon: string;
    tempMax: string;
    tempMin: string;
    iconDay: string;
    textDay: string;
    iconNight: string;
    textNight: string;
    wind360Day: string;
    windDirDay: string;
    windScaleDay: string;
    windSpeedDay: string;
    wind360Night: string;
    windDirNight: string;
    windScaleNight: string;
    windSpeedNight: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud: string;
    uvIndex: string;
  }[];
  refer: {
    sources: string[];
    license: string[];
  };
}

export const getPre7DayWeather = async (cityLocationId: string) => {
  const res = await request.get(
    `https://n24nmrg49r.re.qweatherapi.com/v7/weather/7d?location=${cityLocationId}`
  );
  return res.data as City7DayWeather;
};
