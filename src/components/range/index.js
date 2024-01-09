import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import React from "react";

export const CustomRangeSlider = (props) => {
  const { handleChange, value, min, max } = props;
  return (
    <RangeSlider
      colorScheme={"brand.blue"}
      aria-label={["min", "max"]}
      onChange={handleChange}
      value={value ?? []}
      // defaultValue={[0, 10000]}
      min={min ?? 0}
      max={max ?? 3200000}
      step={100}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <RangeSliderThumb bgColor={"brand.blue.400"} boxSize={"22px"} index={0} />
      <RangeSliderThumb bgColor={"brand.blue.400"} boxSize={"22px"} index={1} />
    </RangeSlider>
  );
};
