import { chakra, Box, Heading, Stack } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { CustomOrangeFullWidthButton } from "../src/components/button";
import { ErrorPage } from "../src/components/card";
import Layout from "../src/components/layout";

const InternalError = () => {
  return (
    <Layout>
      <ErrorPage errorCode={500} errorMessage={"Internal Server Error"} />
    </Layout>
  );
};

export default InternalError;
