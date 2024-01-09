import {
  Box,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef } from "react";
import Layout from "../../src/components/layout";
import ChevronLeft from "../../public/svg/chevron-left-primary.svg";
import SearchIcon from "../../public/svg/header-search.svg";
import { CustomDivider } from "../../src/components/divider";
import { useLocalStorage } from "../../src/hooks";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFastSearch } from "../../src/services/search.service";
import { NoResults } from "../../src/components/card";
import NextLink from "next/link";
import _ from "underscore";
import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import debounce from "lodash.debounce";
import * as Yup from "yup";
const Search = ({ meta }) => {
  const [history, setHistory] = useLocalStorage("gr_global_search", []);
  const router = useRouter();
  const inputRef = useRef();
  const handleBack = () => {
    return router.back();
  };
  const handleSubmit = (values, action) => {
    setHistory((history) => {
      return _.uniq([values.search, ...history]);
    });
  };
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    validationSchema: Yup.object({
      search: Yup.string().required("Harus diisi"),
    }),
    onSubmit: handleSubmit,
  });
  const fastSearch = useQuery(
    ["global-fast-search", formik.values.search],
    () => {
      if (formik.values.search.length !== 0)
        return getFastSearch(formik.values.search);
      else return null;
    }
  );
  const debouncedResults = useMemo(() => {
    return debounce((e) => formik.setFieldValue("search", e.target.value), 300);
  }, []);

  useEffect(() => {
    inputRef.current.focus();
    return () => {
      debouncedResults.cancel();
    };
  }, []);

  const isDesktop = useBreakpointValue({ base: 24, md: 0 }, { ssr: false });
  return (
    <Layout
      pagetitle={"Cari"}
      // bgheader="/svg/package/header-bg.svg"
      type={"search"}
      meta={meta}
    >
      <Box minH={"100vh"}>
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          as={"section"}
          py={"15px"}
          mx={"auto"}
        >
          <form onSubmit={formik.handleSubmit}>
            <HStack gap={"24px"}>
              <IconButton
                color={"neutral.text.high"}
                variant={"unstyled"}
                aria-label={"Open Navigation"}
                icon={<ChevronLeft />}
                onClick={handleBack}
              />
              <InputGroup size="md">
                <Input
                  ref={inputRef}
                  // {...field}
                  name={"search"}
                  // value={formik.values.search}
                  onChange={debouncedResults}
                  onBlur={formik.handleBlur}
                  placeholder="Cari"
                  p={"15px"}
                  variant={"filled"}
                />
                <InputRightElement pointerEvents={"none"}>
                  <SearchIcon />
                </InputRightElement>
              </InputGroup>
              <Input type="submit" hidden />
            </HStack>
          </form>
        </Box>
        <Divider variant="solid" mx={"-24px"} px={"24px"} />
        {formik.values.search.length !== 0 ? (
          <>
            <Stack
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              spacing="32px"
              mx={"auto"}
              as={"section"}
              py={"24px"}
            >
              <Link
                onClick={() => {
                  formik.handleSubmit();
                }}
                as={HStack}
                fontSize={"sm"}
              >
                <Center
                  bg={"brand.blue.100"}
                  w={"32px"}
                  h={"32px"}
                  // p={"7px"}
                  rounded={"md"}
                >
                  <SearchIcon w={"18px"} h={"18px"} />
                </Center>
                <Text color="brand.blue.400">{formik.values.search}</Text>
              </Link>
            </Stack>
            <CustomDivider />
          </>
        ) : (
          <></>
        )}
        {formik.values.search.length !== 0 &&
          (fastSearch.isLoading ? (
            <Center py={"24px"}>
              <Spinner />
            </Center>
          ) : !fastSearch.data.data.length === 0 ? (
            <NoResults />
          ) : (
            <Tabs
              m={"-24px"}
              pt={"24px"}
              variant="solid-rounded"
              colorScheme="brand.blue"
              isLazy
              // display={"flex"}
              // flexDir={"column"}
            >
              <TabList
                maxW={{ lg: "container.lg", xl: "container.xl" }}
                mx={"auto"}
                pt={"24px"}
              >
                <Swiper
                  spaceBetween={12}
                  slidesOffsetBefore={isDesktop}
                  slidesOffsetAfter={24}
                  slidesPerView={"auto"}
                  style={{ width: "100%", height: "100%" }}
                >
                  <SwiperSlide style={{ width: "fit-content" }}>
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
                      Semua
                    </Tab>
                  </SwiperSlide>
                  {!fastSearch.isLoading &&
                    Object.keys(fastSearch.data?.grouping).map(
                      (item, index) => (
                        <SwiperSlide
                          style={{ width: "fit-content" }}
                          key={index}
                        >
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
                            {item}
                          </Tab>
                        </SwiperSlide>
                      )
                    )}
                </Swiper>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack
                    maxW={{ lg: "container.lg", xl: "container.xl" }}
                    mx={"auto"}
                    spacing="24px"
                    as={"section"}
                    py={"24px"}
                  >
                    {fastSearch.data.data.map((item, index) => {
                      return (
                        <Link
                          key={index}
                          onClick={() => {
                            formik.handleSubmit();
                            router.push(`/${item.type}/${item.slug}`);
                          }}
                          gap={"16px"}
                          as={HStack}
                          fontSize={"sm"}
                        >
                          <Center
                            bg={"brand.blue.100"}
                            w={"44px"}
                            h={"44px"}
                            // p={"7px"}
                            rounded={"md"}
                            // position={"relative"}
                          >
                            <Image
                              alt={item.label}
                              src={item.icon}
                              // layout="fill"
                              width="24px"
                              height={"24px"}
                              objectFit="contain"
                            />
                            {/* <SearchIcon w={"18px"} h={"18px"} /> */}
                          </Center>
                          <Stack>
                            <Text fontWeight={"bold"} color="neutral.text.high">
                              {item.title}
                            </Text>
                            <Text>{item.label ?? ""}</Text>
                          </Stack>
                        </Link>
                      );
                    })}
                  </Stack>
                </TabPanel>
                {Object.keys(fastSearch.data?.grouping).map((item, index) => {
                  return (
                    <TabPanel key={index}>
                      <Stack
                        maxW={{ lg: "container.lg", xl: "container.xl" }}
                        mx={"auto"}
                        spacing="24px"
                        as={"section"}
                        py={"24px"}
                      >
                        {fastSearch.data.grouping[item].map((item, index) => {
                          return (
                            <Link
                              key={index}
                              onClick={() => {
                                formik.handleSubmit();
                                router.push(`/${item.type}/${item.slug}`);
                              }}
                              gap={"16px"}
                              as={HStack}
                              fontSize={"sm"}
                            >
                              <Center
                                bg={"brand.blue.100"}
                                w={"44px"}
                                h={"44px"}
                                // p={"7px"}
                                rounded={"md"}
                                // position={"relative"}
                              >
                                <Image
                                  alt={item.label}
                                  src={item.icon}
                                  // layout="fill"
                                  width="24px"
                                  height={"24px"}
                                  objectFit="contain"
                                />
                                {/* <SearchIcon w={"18px"} h={"18px"} /> */}
                              </Center>
                              <Stack>
                                <Text
                                  fontWeight={"bold"}
                                  color="neutral.text.high"
                                >
                                  {item.title}
                                </Text>
                                <Text>{item.label ?? ""}</Text>
                              </Stack>
                            </Link>
                          );
                        })}
                      </Stack>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </Tabs>
          ))}
        <Stack
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          hidden
          spacing={"32px"}
          as={"section"}
          py={"24px"}
        >
          <Heading fontSize={"md"}>Kata Kunci Populer</Heading>
          <Wrap spacing={"10px"}>
            {Array.from({ length: 9 }).map((item, i) => {
              return (
                <Link
                  as={WrapItem}
                  key={i}
                  bg={"gray.100"}
                  rounded={"full"}
                  fontSize={"md"}
                  color={"brand.blue.400"}
                  px={"16px"}
                  py={"6px"}
                >
                  Tour Eropa Barat
                </Link>
              );
            })}
          </Wrap>
        </Stack>
        <CustomDivider hidden />
        <Stack
          spacing={"32px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          as={"section"}
          py={"24px"}
        >
          <Heading fontSize={"md"}>Riwayat Pencarian</Heading>
          {history.length !== 0 ? (
            <Stack spacing={"16px"}>
              {history.slice(0, 5).map((item, i) => {
                return (
                  <Link
                    onClick={() => {
                      formik.setFieldValue("search", item);
                      formik.handleSubmit();
                    }}
                    as={HStack}
                    fontSize={"sm"}
                    key={i}
                  >
                    <Center
                      bg={"brand.blue.100"}
                      w={"32px"}
                      h={"32px"}
                      // p={"7px"}
                      rounded={"md"}
                    >
                      <SearchIcon w={"18px"} h={"18px"} />
                    </Center>
                    <Text>{item}</Text>
                  </Link>
                );
              })}
            </Stack>
          ) : (
            <Center>
              <Text fontSize={"sm"}>Tidak ada riwayat pencarian</Text>
            </Center>
          )}
        </Stack>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
      meta: {
        title: "Cari",
      },
    },
  };
};

export default Search;
