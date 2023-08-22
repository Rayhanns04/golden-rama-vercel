import {
  Box,
  Collapse,
  HStack,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomDivider } from "../../src/components/divider";
import EditIcon from "../../public/svg/icons/edit.svg";
import Layout from "../../src/components/layout";
import {
  getAttractions,
  getStateById,
} from "../../src/services/attraction.service";
import { InsuranceListItem } from "../../src/components/card";
import { Form, Formik, useFormikContext } from "formik";
import { FormInsuranceSearch } from "../../src/components/form";
import { getInsuranceProducts } from "../../src/services/insurance.service";
import date from "../../src/helpers/date";

const InsurancesSearch = (props) => {
  const router = useRouter();
  const { result } = props;
  const { query } = router;
  const insuranceLabel = useQuery(
    ["getInsurancesLabel", query.package_type],
    async () => {
      try {
        const response = await getStateById(query.package_type);
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }
  );
  const insurances = useQuery(
    ["getInsurancesSearch", query],
    async ({ pageParam = 1 }) => {
      try {
        const result = await getInsuranceProducts({ query });
        return Promise.resolve(result);
      } catch (error) {
        console.error(error);
        Promise.reject(error);
      }
    }
  );
  const handleSubmit = (values) => {
    try {
      values.travel_end_date = date(
        new Date(values.travel_end_date),
        "yyyy-MM-dd"
      );
      values.travel_start_date = date(
        new Date(values.travel_start_date),
        "yyyy-MM-dd"
      );
      router.replace(
        { pathname: `/insurances/search`, query: values },
        undefined,
        {
          shallow: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const EditSearch = ({
    selected,
    totalData,
    isLoading,
    // airlines,
    ...props
  }) => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

    const initialValues = {
      origins: query.origins ?? "",
      regions: query.regions ?? "",
      RegionID: query.RegionID ?? "",
      destinations: query.destinations ?? "",
      DestinationID: query.DestinationID ?? "",
      package_type: query.package_type ?? "",
      PackageTypeID: query.PackageTypeID ?? "",
      isFamily: query.isFamily ? true : false,
      participants: {
        adults: parseInt(query?.adults) || 1,
        children: parseInt(query?.children) || 0,
      },
      travel_start_date: query.travel_start_date
        ? new Date(query.travel_start_date)
        : new Date(),
      travel_end_date: query.travel_end_date
        ? new Date(query.travel_end_date)
        : addDays(new Date(), 3),
    };
    const ActionButton = () => {
      const formik = useFormikContext();
      return (
        <SimpleGrid
          columns={2}
          direction={"row"}
          pt={"24px"}
          alignItems={"center"}
          spacing={6}
        >
          <CustomOrangeFullWidthButton
            mt={0}
            isoutlined
            onClick={() => {
              onToggle();
              formik.handleReset();
            }}
          >
            Batal
          </CustomOrangeFullWidthButton>
          <CustomOrangeFullWidthButton
            // type="submit"
            isLoading={formik.isSubmitting}
            onClick={formik.handleSubmit}
            mt={0}
          >
            Temukan Asuransi
          </CustomOrangeFullWidthButton>
        </SimpleGrid>
      );
    };
    return (
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={(val) => handleSubmit(val)}
        >
          <Form>
            <Box
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              as={"section"}
              bg={"white"}
              // mx={"-24px"}
            >
              <Collapse in={!isOpen}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  // px={"24px"}
                  py={"16px"}
                >
                  <Text
                    display={"flex"}
                    alignSelf={"center"}
                    color={"neutral.text.high"}
                    fontSize={"sm"}
                  >
                    Hasil Pencarian &quot;
                    <Text
                      as={"span"}
                      fontWeight={"bold"}
                      color={"brand.blue.400"}
                    >
                      Semua Asuransi
                    </Text>
                    &quot;
                  </Text>
                  <IconButton
                    size={"sm"}
                    onClick={onToggle}
                    variant={"unstyled"}
                    icon={<EditIcon width={20} height={20} />}
                  />
                </Stack>
              </Collapse>
              <Collapse in={isOpen}>
                <Stack py={6}>
                  {props.data && (
                    <FormInsuranceSearch
                      actionButton={<ActionButton />}
                      handleSubmit={handleSubmit}
                    />
                  )}
                </Stack>
              </Collapse>
            </Box>
            <CustomDivider />
            <Box as={"section"} py={"24px"}>
              <HStack
                mx={"auto"}
                maxW={{ lg: "container.lg", xl: "container.xl" }}
                justifyContent={"space-between"}
              >
                <Text
                  color={"neutral.text.medium"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {/* {totalData ?? "-"} {title ?? ""} Tersedia */}
                  {insurances.data?.length} Paket Tersedia
                </Text>
              </HStack>
            </Box>
          </Form>
        </Formik>
      </Box>
    );
  };
  const { isLoading, data } = insurances;
  return (
    <Layout
      type="nested"
      metatitle={`Hasil Pencarian Asuransi ke ${
        !insuranceLabel?.isLoading
          ? insuranceLabel?.data || "Semua Tujuan"
          : "..."
      }, ${query.travel_start_date} - ${query.travel_end_date}`}
      pagetitle={"Hasil Pencarian Asuransi"}
    >
      <EditSearch
        isLoading={isLoading}
        selected={query}
        totalData={insurances.data?.length ?? 0}
        data={props}
        // airlines={airlines}
        handleSubmit={handleSubmit}
      />
      <CustomDivider />
      <Box as={"section"} px={"24px"} bg={"brand.blue.100"} mx={"-24px"}>
        <Stack
          spacing={"16px"}
          py={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <InsuranceListItem query={insurances} />
          {/* Insurances List Item */}
        </Stack>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const result = await getInsuranceProducts({ query: ctx.query });
  return {
    props: {
      result,
      meta: {
        title: "Hasil Pencarian Asuransi",
      },
    },
  };
};

export default InsurancesSearch;
