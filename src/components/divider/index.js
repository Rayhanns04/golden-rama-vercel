import { Box } from "@chakra-ui/react";
import React from "react";

export const CustomDivider = (props) => {
  return (
    <Box
      as={props.as ?? "hr"}
      h={props.h ?? 2}
      mx={props.mx ?? "-24px"}
      bg={props.bg ?? "brand.blue.100"}
      {...props}
    />
  );
};
