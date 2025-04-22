import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "@mui/material/utils";
import { CityLoationInfo, getCitys } from "../../apis";

const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const fetch = debounce(
  async (
    input: string,
    callback: (results?: readonly CityLoationInfo[]) => void
  ) => {
    try {
      const citys = await getCitys(input);

      callback(citys);
    } catch (err) {
      throw err;
    }
  },
  400
);

const emptyOptions = [] as CityLoationInfo[];

interface ICitySelectProps {
  value: CityLoationInfo;
  onChange: (value: CityLoationInfo) => void;
}

const CitySelect: React.FunctionComponent<ICitySelectProps> = ({
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState(value.name);
  const [options, setOptions] = React.useState<readonly CityLoationInfo[]>([]);

  useEnhancedEffect(() => {
    if (inputValue === "") {
      setOptions(value ? [value] : emptyOptions);
      return undefined;
    }

    let active = true;

    fetch(inputValue, (results) => {
      if (!active) {
        return;
      }
      setOptions(results || []);
    });

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  return (
    <Autocomplete
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      filterSelectedOptions
      value={value}
      disableClearable
      noOptionsText="No locations"
      onChange={(_, newValue: CityLoationInfo | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onChange(newValue as CityLoationInfo);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} fullWidth />}
    />
  );
};

export default CitySelect;
