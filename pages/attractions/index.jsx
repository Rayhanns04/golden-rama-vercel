import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { AttractionSearchForm } from "../../src/components/form";
import Layout from "../../src/components/layout";
import { useLocalStorage } from "../../src/hooks";
import * as Yup from "yup";
import { useRouter } from "next/router";
import {
  AttractionHistory,
  AttractionListItem,
} from "../../src/components/card";
import {
  getAttractions,
  getAttractionsType,
} from "../../src/services/attraction.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetDataTour } from "../../src/state/tour/tour.slice";
import { resetDataFlight } from "../../src/state/order/order.slice";
import { resetDataAttraction } from "../../src/state/attraction/attraction.slice";
import { useInView } from "react-intersection-observer";

const Attractions = (props) => {
  const { popular, types } = props;
  const form = {
    places_type: "",
    places: "",
    type: "",
  };
  const dispatch = useDispatch();
  const [history, setHistory] = useLocalStorage("attraction_search", []);

  useEffect(() => {
    dispatch(resetDataTour({}));
    dispatch(resetDataFlight({}));
    dispatch(resetDataAttraction({}));
  }, []);

  const router = useRouter();
  const handleSubmit = (values) => {
    // console.log(values)
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    if (values.places_type == "attractionList") {
      router.push({ pathname: `/attractions/${values.places}` });
    } else {
      router.push({ pathname: "/attractions/search", query: values });
    }
  };

  const AttractionItems = () => {
    const { ref: trigger, inView } = useInView();
    useEffect(() => {
      if (inView) {
        showMoreItems();
      }
    }, [inView]);
    const attractions = useInfiniteQuery(
      ["getAttractions", {}],
      getAttractions,
      {
        getNextPageParam: (lastpage) => {
          try {
            if (lastpage) {
              if (lastpage.pagination.pageCount === 0) return undefined;
              if (lastpage.pagination.page !== lastpage.pagination.pageCount) {
                return lastpage.pagination.page + 1;
              } else return undefined;
            }
          } catch (error) {
            console.error(error);
            return undefined;
          }
        },
      }
    );

    const showMoreItems = () => {
      attractions.fetchNextPage();
    };
    return (
      <Stack spacing="16px">
        <AttractionListItem query={attractions} />
        <Center mt={4}>
          {attractions.hasNextPage && <Spinner ref={trigger}></Spinner>}
        </Center>
        {/* <CustomOrangeFullWidthButton
          hidden={!attractions.hasNextPage}
          onClick={() => attractions.fetchNextPage()}
          isLoading={attractions.isFetchingNextPage}
        >
          Lihat Lebih Banyak
        </CustomOrangeFullWidthButton>{" "} */}
      </Stack>
    );
  };
  return (
    <Layout
      bgheader={"/svg/attractions/header-bg.svg"}
      pagetitle={"Atraksi"}
      type={"alt"}
    >
      <Box as={"section"} py={"24px"}>
        <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
          <Formik
            initialValues={form}
            onSubmit={handleSubmit}
            validationSchema={() =>
              Yup.object().shape({
                places: Yup.string().notRequired("Lokasi wajib diisi"),
                type: Yup.string().notRequired("Tipe atraksi wajib diisi"),
              })
            }
          >
            <Form>
              <AttractionSearchForm
                types={types}
                history={history}
                popular={popular}
              />
            </Form>
          </Formik>
        </Box>
      </Box>
      {history.length > 0 && (
        <Box mx={"-24px"} py={"24px"} bg={"brand.blue.100"} as={"section"}>
          <SimpleGrid columns={1} spacing={"16px"}>
            <Box
              w={"full"}
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              px={{ base: "24px", md: 0 }}
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
              <AttractionHistory
                item={history}
                places={popular}
                types={types}
                handleClick={handleSubmit}
                setItem={setHistory}
                // area={area}
                // destination={allDestination}
              />
            </Stack>
          </SimpleGrid>
        </Box>
      )}
      <Box as="section">
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx="auto"
          py="24px"
        >
          <Heading color={"neutral.text.high"} fontSize={"md"}>
            Trending Atraksi dan Hiburan
          </Heading>
          <Text fontSize="sm">
            Habiskan liburanmu dengan mengunjungi atraksi dan hiburan trending
            ini
          </Text>
        </Box>
        <Box mx="-24px" p={"24px"} bg="brand.blue.100">
          <Box mx="auto" maxW={{ lg: "container.lg", xl: "container.xl" }}>
            <AttractionItems />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  try {
    const types = await getAttractionsType();
    const popular = [
      {
        matchingScore: 0.1,
        country: "Indonesia",
        name: "Bali",
        type: "cityList",
        uuid: "ccb6876e-0686-5db9-aa73-a3104a3d27a3",
      },
      {
        matchingScore: 0.1,
        country: "Indonesia",
        name: "Lombok",
        type: "cityList",
        uuid: "a65ebd1e-7bea-58a3-b61d-2754b8a28e25",
      },
      {
        matchingScore: 0.1,
        name: "Jakarta",
        country: "Indonesia",
        type: "cityList",
        uuid: "c4d76b37-c800-5d59-8488-26daf0e60478",
      },
      {
        matchingScore: 0.1,
        name: "Singapore",
        type: "countryList",
        uuid: "885e90a3-a83d-56d3-b5e8-040b4017c825",
      },
      {
        matchingScore: 0.1,
        name: "Bangkok",
        country: "Thailand",
        type: "cityList",
        uuid: "13a674ac-14be-5a55-98b2-1bd09f78edfa",
      },
    ];

    return {
      props: {
        popular,
        types: [{ name: "All", uuid: "" }, ...types],
        meta: {
          title: "Atraksi",
        },
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Attractions;
