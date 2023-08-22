import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import Layout from "../../src/components/layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { FormPackageSearch } from "../../src/components/form";
import { useQuery } from "@tanstack/react-query";
import {
  getPackageCountry,
  getPackageCategories,
  getPackageGroupsV2,
} from "../../src/services/package.service";
import { CustomPackagesTabs } from "../../src/components/tab";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
// import { resetDataPackage } from "../../src/state/package/package.slice";
// import { resetDataFlight } from "../../src/state/order/order.slice";
import * as Yup from "yup";
import { useLocalStorage } from "../../src/hooks";
import { PackageHistory } from "../../src/components/card";

const Packages = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { package_type, area, period_month, period_year, allDestination } =
    props;

  const [history, setHistory] = useLocalStorage("package_search", []);
  const search = ["Europe Barat", "New York", "Jepang"];

  const handleSubmit = (values, actions) => {
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    router.push({ pathname: "/packages/search", query: values });
  };

  const package_tags = useQuery(["getPackageTags"], async () => {
    const response = [
      {
        isDomestic: true,
        id: 1,
        name: "Domestik",
      },
      {
        isDomestic: false,
        id: 2,
        name: "Internasional",
      },
    ];
    return Promise.resolve(response);
  });

  const form = {
    isDomestic: true,
    destination: "",
    period_month: "",
    period_year: new Date().getFullYear().toString(),
  };

  // useEffect(() => {
  //   dispatch(resetDataPackage({}));
  //   dispatch(resetDataFlight({}));
  // }, []);

  return (
    <Layout
      pagetitle={"Package"}
      bgheader="/svg/package/header-bg.svg"
      type={"alt"}
    >
      <Box as={"section"} py={"24px"}>
        <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
          <Formik
            initialValues={form}
            validationSchema={() =>
              Yup.object().shape({
                period_year: Yup.string().required("Tahun wajib diisi"),
                period_month: Yup.string().required("Bulan wajib diisi"),
              })
            }
            onSubmit={handleSubmit}
          >
            <Form>
              <FormPackageSearch
                package_tags={package_tags}
                package_type={package_type}
                area={area}
                period_month={period_month}
                period_year={period_year}
                handleSubmit={handleSubmit}
              />
            </Form>
          </Formik>
        </Box>
      </Box>
      <Box mx={"-24px"} py={"24px"} bg={"brand.blue.100"} as={"section"}>
        <SimpleGrid columns={1} spacing={"16px"}>
          <Box
            w={"full"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            px={{ base: "24px", xl: "0" }}
          >
            <Heading color={"neutral.text.high"} fontSize={"md"}>
              Pencarian Terakhir
            </Heading>
          </Box>
          <Stack
            justifyContent={"stretch"}
            mx={"auto"}
            w={"full"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
          >
            <PackageHistory
              item={history}
              handleClick={handleSubmit}
              setItem={setHistory}
              area={area}
              destination={allDestination}
            />
          </Stack>
        </SimpleGrid>
      </Box>
      <Box py={"24px"} as={"section"}>
        <Stack maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
          <Heading color={"neutral.text.high"} fontSize={"md"}>
            Trending Package
          </Heading>
          <Text fontSize={"sm"} color={"neutral.text.medium"}>
            Mulai perjalanan Anda dengan menjelajah destinasi yang sering
            dikunjungi banyak orang
          </Text>
        </Stack>
        <Tabs
          m={"-24px"}
          py={"24px"}
          variant="solid-rounded"
          colorScheme="brand.blue"
          isLazy
          // display={"flex"}
          // flexDir={"column"}
        >
          <TabList
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            py={"24px"}
          >
            <Swiper
              spaceBetween={12}
              slidesOffsetBefore={useBreakpointValue(
                { base: 24, md: 0 },
                { ssr: false }
              )}
              slidesOffsetAfter={24}
              slidesPerView={"auto"}
              style={{ width: "100%", height: "100%" }}
            >
              {!package_tags.isLoading &&
                package_tags.data?.map((item, index) => (
                  <SwiperSlide style={{ width: "fit-content" }} key={index}>
                    <Tab
                      display={"flex"}
                      width={"max-content"}
                      px={"16px"}
                      py={"8px"}
                      fontSize={"sm"}
                      fontWeight="normal"
                      bgColor={"neutral.color.bg.secondary"}
                      color={"neutral.text.medium"}
                      _selected={{
                        bgColor: "brand.blue.400",
                        color: "brand.blue.100",
                      }}
                    >
                      {item.name}
                    </Tab>
                  </SwiperSlide>
                ))}
            </Swiper>
          </TabList>
          <TabPanels bg={"brand.blue.100"}>
            {!package_tags.isLoading &&
              package_tags.data?.map((item, index) => (
                <TabPanel key={index}>
                  <CustomPackagesTabs item={item} />
                </TabPanel>
              ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async (context) => {
  const package_type = await getPackageCategories();
  const period_month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var min = new Date().getFullYear();
  var max = min + 2;
  var years = [];

  for (var i = min; i <= max; i++) {
    years.push(i);
  }

  return {
    props: {
      package_type,
      period_month,
      period_year: years,
      meta: {
        title: "Package",
      },
    },
    revalidate: 10,
  };
};
export default Packages;
