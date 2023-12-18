import {
  chakra,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Radio,
  Stack,
  Text,
} from "@chakra-ui/react";
import { addDays } from "date-fns";
import { Field, Form, Formik, useFormikContext } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import CustomCalendar from "../../src/components/calendar";
import { CustomRadioFill } from "../../src/components/checkbox";
import { CustomDropdown } from "../../src/components/dropdown";
import { FormInsuranceSearch, FormRangeDate } from "../../src/components/form";
import Layout from "../../src/components/layout";
import { SelectForm } from "../../src/components/person";
import * as Yup from "yup";
import date from "../../src/helpers/date";

const Insurances = (props) => {
  const router = useRouter();

  const handleSubmit = (values) => {
    // setShownItems(9);
    // alert(JSON.stringify(values, null, 2));
    // values.travel_end_date = date(values.travel_end_date, "yyyy-MM-dd");
    values.travel_start_date = values.package_type === "Yearly 180" || values.package_type === "Yearly 90" ? date(values.travel_yearly_start_date, "yyyy-MM-dd") : date(values.travel_start_date, "yyyy-MM-dd");
    //add 1 year to end date if yearly
    values.travel_end_date = values.package_type === "Yearly 180" || values.package_type === "Yearly 90" ? date(addDays(values.travel_yearly_start_date, 365), "yyyy-MM-dd") : date(values.travel_end_date, "yyyy-MM-dd");
    // setHistory([values, ...history]);
    // console.log(values);
    router.push({ pathname: `/insurances/search`, query: values }, undefined, {
      shallow: true,
    });
  };

  return (
    <Layout
      pagetitle={"Insurances"}
      bgheader="/svg/insurance/header-bg.svg"
      type={"alt"}
    >
      <Box
        py={"24px"}
        mx={"auto"}
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        as="section"
      >
        <FormInsuranceSearch handleSubmit={handleSubmit} />
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      data: null,
      meta: {
        title: "Insurances",
      },
    },
  };
};

export default Insurances;
