import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomDivider } from "../../src/components/divider";
import {
  AttractionSearchForm,
  FormAttractionFilter,
} from "../../src/components/form";
import Layout from "../../src/components/layout";
import { SearchFilters } from "../../src/components/search";
import EditIcon from "../../public/svg/icons/edit.svg";
import ActivityIcon from "../../public/png/Activity.png";
import AttractionIcon from "../../public/png/Attraction.png";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  getAttractions,
  getAttractionsType,
  getStateById,
} from "../../src/services/attraction.service";
import { useLocalStorage } from "../../src/hooks";
import { AttractionListItem } from "../../src/components/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { convertToArray } from "../../src/helpers";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

const AttractionsSearch = (props) => {
  const router = useRouter();
  const { popular, types } = props;
  const { query } = router;

  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );

  const [total, setTotal] = useState(0);
  const { ref: trigger, inView } = useInView();
  useEffect(() => {
    if (inView) {
      showMoreItems();
    }
  }, [inView]);

  const initialValues = {
    max_price: query.max_price ?? 16000000,
    min_price: query.min_price ?? 0,
    places: query.places ?? "",
    places_type: query.places_type ?? "",
    type: query.type ?? "",
    categories: query.categories ?? "",
    transport: convertToArray(query.transport) ?? [],
    attraction: convertToArray(query.attraction) ?? [],
  };

  const [history, setHistory] = useLocalStorage("attraction_search", []);

  const handleSubmit = (values) => {
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    if (values.places_type == "attractionList") {
      router.push({ pathname: `/attractions/${values.places}` });
    } else {
      router.replace({ pathname: "/attractions/search", query: values }, undefined, { shallow: true });
    }
  };
  const handleSubmitSearch = (values) => {
    values = {
      ...values,
      places: query.places,
      places_type: query.places_type,
    }
    setHistory((history) => {
      return _.uniq([values, ...history]);
    });
    if (values.places_type == "attractionList") {
      router.push({ pathname: `/attractions/${values.places}` });
    } else {
      router.replace({ pathname: "/attractions/search", query: values }, undefined, { shallow: true });
    }
  }
  const attractionsLabel = useQuery(
    ["getAttractionsLabel", query.places],
    async () => {
      try {
        const response = await getStateById(query.places);
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }
  );

  const attractions = useInfiniteQuery(
    ["getAttractionsSearch", query],
    async ({ pageParam = 1 }) => {
      try {
        const response = getAttractions({
          queryFilter: query,
          pageParam: pageParam,
        });
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
        Promise.reject(error);
      }
    },
    {
      getNextPageParam: (lastpage) => {
        try {
          if (lastpage) {
            if (lastpage.pagination.pageCount === 0) return undefined;
            if (
              lastpage.pagination.page !==
              lastpage.pagination.pageCount
            ) {
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

  const { isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    attractions;

  const showMoreItems = () => {
    fetchNextPage();
  };

  const EditSearch = ({
    selected,
    totalData,
    isLoading,
    // airlines,
    ...props
  }) => {
    const {
      tour_type,
      airlines,
      area,
      destination,
      sort,
      // totalData,
    } = props.data;
    const data = {
      tour_type,
      area,
      destination,
    };
    const { isOpen, onToggle } = useDisclosure();

    const tour_duration = [
      { label: "< 1 Week", value: "1" },
      { label: "> 1 Week", value: "2" },
    ];

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
            Temukan Atraksi
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
                  <Skeleton isLoaded={!attractionsLabel.isLoading}>
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
                        {query.places
                          ? attractionsLabel.data &&
                          attractionsLabel.data?.data?.map((item) => {
                            return (
                              item.attributes.name ?? item.attributes.title
                            );
                          })
                          : "Semua atraksi"}
                        {/* {selected.area} */}
                      </Text>
                      &quot;
                    </Text>
                  </Skeleton>
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
                    <AttractionSearchForm
                      history={history}
                      types={types}
                      actionButton={<ActionButton />}
                      popular={popular}
                    />
                  )}
                </Stack>
              </Collapse>
            </Box>
            <CustomDivider />
            <SearchFilters
              isLoading={isLoading}
              filter={
                <FormAttractionFilter
                  tour_type={tour_type}
                  airlines={airlines}
                  tour_duration={tour_duration}
                />
              }
              title={"Atraksi dan Hiburan"}
              result={attractions}
              airlines={airlines}
              data={data}
              totalData={totalData}
              sort={sort}
            />
          </Form>
        </Formik>
      </Box>
    );
  };

  return (
    <Layout
      type="nested"
      metatitle={`Hasil Pencarian Atraksi ke ${!attractionsLabel.isLoading
        ? attractionsLabel.data || "Semua Tujuan"
        : "..."
        }, ${query.period_month} ${query.period_year}`}
      pagetitle={"Hasil Pencarian Atraksi"}
    >
      <EditSearch
        isLoading={isLoading}
        selected={query}
        totalData={
          (attractions.data && attractions.data.pages[0].pagination.total) ?? 0
        }
        data={props}
        // airlines={airlines}
        handleSubmit={handleSubmit}
      />
      <Box as={"section"} px={{ md: "24px" }} bg={"white"} mx={"-24px"}>
        <Formik initialValues={initialValues} onSubmit={handleSubmitSearch}>
          <Form>
            <Field name={"type"}>
              {({ field, form }) => (
                <Box pb="24px">
                  <Swiper
                    spaceBetween={isDesktop ? 0 : 32}
                    slidesOffsetBefore={isDesktop ? 0 : 24}
                    slidesOffsetAfter={isDesktop ? 0 : 24}
                    slidesPerView={isDesktop ? types.length : 5}
                    // width={70}
                    style={{ width: "auto", height: "100%", paddingLeft: isDesktop && "7em" }}

                  >
                    {types.map((item, index) => (
                      <SwiperSlide key={index}>
                        <LinkBox
                          w="70px"
                          key={index}
                          flexDir="column"
                          display={"flex"}
                          alignItems="center"
                        >
                          <Flex
                            bg={
                              query[field.name] === item.uuid &&
                              "brand.blue.400"
                            }
                            // maxw="50px"
                            // maxh="50px"
                            rounded={"lg"}
                            p="12px"
                          >
                            <Button
                              color={
                                query[field.name] === item.uuid
                                  ? "white"
                                  : "dark.50"
                              }
                              variant="unstyled"
                            >
                              <Image
                                src={`/png/${item.name}.png`}
                                alt={item.name}
                                width="35px"
                                height="35px"
                              />
                            </Button>
                          </Flex>
                          <LinkOverlay
                            onClick={() => {
                              form.setFieldValue(field.name, item.uuid, false);
                              form.handleSubmit();
                            }}
                            href="#"
                            fontSize="12px"
                            py={"5px"}
                            color={
                              query[field.name] === item.uuid
                                ? "brand.blue.400"
                                : "neutral.text.low"
                            }
                            textAlign={"center"}
                          >
                            {item.name}
                          </LinkOverlay>
                        </LinkBox>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              )}
            </Field>
          </Form>
        </Formik>
      </Box>
      <CustomDivider />
      <Box as={"section"} px={"24px"} bg={"brand.blue.100"} mx={"-24px"}>
        <Stack
          spacing={"16px"}
          py={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <AttractionListItem query={attractions} />
          {hasNextPage && (
            <Center mt={4}>
              <Spinner ref={trigger}></Spinner>
            </Center>
          )}
          {/* <CustomOrangeFullWidthButton
            hidden={!hasNextPage}
            onClick={fetchNextPage}
            isLoading={isFetchingNextPage}
          >
            Lihat Lebih Banyak
          </CustomOrangeFullWidthButton> */}
        </Stack>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async () => {
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

  const types = await getAttractionsType();

  return {
    props: {
      popular,
      types,
      meta: {
        title: "Hasil Pencarian Atraksi",
      },
    },
  };
};

export default AttractionsSearch;
