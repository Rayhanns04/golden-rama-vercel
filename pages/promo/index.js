import {
  Alert,
  AlertTitle,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Layout from "../../src/components/layout";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomDivider } from "../../src/components/divider";
import { SearchFilters } from "../../src/components/search";
import { Field, Formik } from "formik";
import { CustomCheckboxFill } from "../../src/components/checkbox";
import { useQuery } from "@tanstack/react-query";
import { getPromoListUsingPage } from "../../src/services/promo.service";
import { getProductCategoryList } from "../../src/services/product_category.service";
import { getDiscounts } from "../../src/services/discount.service";
import { useRouter } from "next/router";
import { PromoItems } from "../../src/components/card";

const Promo = (props) => {
  const [sorting, setSorting] = useState(false);
  const { data } = props;
  const router = useRouter();

  const FormPromo = ({ handleChanges, category, promos, totalPromo }) => {
    const FormPromoFilters = () => {
      return (
        <>
          {/* <Stack spacing={"24px"} py={"24px"}> */}
          {/* <Heading fontSize={"md"}>Rentang Harga</Heading> */}
          {/* <FormPrice /> */}
          {/* </Stack> */}
          {/* <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} /> */}
          <Stack spacing={"24px"} py={"24px"}>
            <Heading fontSize={"md"}>Kategori Layanan</Heading>
            <Wrap spacingY={"16px"} spacingX={"6px"}>
              {category.data?.map((item, index) => {
                return (
                  <Field
                    key={index}
                    name="service_category"
                    value={item.id}
                    type="checkbox"
                  >
                    {({ field, form }) => (
                      <>
                        <CustomCheckboxFill
                          form={form}
                          field={field}
                          value={item.id}
                          label={item.attributes?.name}
                        />
                        {/* <CustomCheckbox field={field} item={item} /> */}
                      </>
                    )}
                  </Field>
                );
              })}
            </Wrap>
          </Stack>
          <Stack spacing={"24px"} py={"24px"}>
            <Heading fontSize={"md"}>Kategori Promo</Heading>
            <Wrap spacingY={"16px"} spacingX={"6px"}>
              {promos.data?.map((item, index) => {
                return (
                  <Field
                    key={index}
                    name="promo_category"
                    value={item.attributes?.code}
                    type="checkbox"
                  >
                    {({ field, form }) => (
                      <>
                        <CustomCheckboxFill
                          field={field}
                          value={item.attributes?.code}
                          form={form}
                          label={item.attributes?.name}
                        />
                      </>
                    )}
                  </Field>
                );
              })}
            </Wrap>
          </Stack>
        </>
      );
    };

    const initialValues = {
      sort: "",
      max_price: 32000,
      min_price: 0,
      service_category: [],
      promo_category: [],
    };

    const handleSubmit = (values, actions) => {
      handleChanges(values);
      actions.setSubmitting(false);
      // router.replace({ pathname: "/promo/", query: values }, undefined, {
      //   shallow: false,
      // });
    };

    return (
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <SearchFilters
          title={"Promo"}
          totalData={totalPromo}
          isLoading={false}
          filter={<FormPromoFilters />}
          sort={data.sort}
        />
      </Formik>
    );
  };

  const getList = async ({ pageParam = 1 }) => {
    const response = await getPromoListUsingPage(pageParam, true, sorting);
    return response;
  };

  const getListPromo = async ({ pageParam = 1 }) => {
    const response = await getPromoListUsingPage(pageParam, false, sorting);
    return response;
  };

  const specialPromoQuery = useQuery(["getPromo", sorting], getList);

  const { data: specialpromo } = specialPromoQuery;

  const generalPromo = useQuery(["getPromoBiasa", sorting], getListPromo);

  const { data: promo } = generalPromo;

  const handleChanges = (newValue) => {
    setSorting(newValue);
  };

  const getProductCategory = useQuery(["getProductCategory"], async () => {
    const response = await getProductCategoryList();
    return Promise.resolve(response);
  });

  const getPromoCategory = useQuery(["getPromoCategory"], async () => {
    const response = await getDiscounts();
    return Promise.resolve(response);
  });

  const getPromo = useQuery(["getPromo"], async () => {
    try {
      const response = await getPromoList(false);
      return Promise.resolve(response);
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  });

  return (
    <Layout type="nested" pagetitle={"Semua Promo"}>
      <FormPromo
        service={data.service}
        promo={data.promo}
        handleChanges={handleChanges}
        category={getProductCategory}
        promos={getPromoCategory}
        totalPromo={specialpromo?.data.length}
      />
      <CustomDivider />
      <Box
        bg={"brand.blue.100"}
        as={"section"}
        mx={"-24px"}
        alignItems="flex-start"
      >
        <Box hidden={specialPromoQuery?.data?.length === 0} pb={30} px={"24px"}>
          <Box bg={"white"} mx={"-24px"} px={"24px"}>
            <VStack
              mx={"auto"}
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              py={"24px"}
              // px={{ base: "24px", lg: 0 }}
              alignItems={"flex-start"}
            >
              <HStack
                // px={{ base: "24px", lg: "0" }}
                alignSelf={"stretch"}
                justifyContent={"space-between"}
              >
                <Skeleton isLoaded={!specialPromoQuery.isLoading}>
                  <Heading color={"brand.blue.600"} as={"h3"} size={"md"}>
                    Promo Khusus
                  </Heading>
                </Skeleton>
              </HStack>
              <HStack
                hidden
                // px={{ base: "24px", xl: 0 }}
                alignSelf={"stretch"}
                spacing={3}
              >
                <Flex flex={"none"}>
                  <Skeleton isLoaded={!specialPromoQuery.isLoading}>
                    <Text color={"neutral.text.medium"} fontSize={"sm"}>
                      Berakhir dalam
                    </Text>
                  </Skeleton>
                </Flex>
                <Box>
                  <Skeleton isLoaded={!specialPromoQuery.isLoading}>
                    <Alert
                      bg={"alert.failed"}
                      textColor={"white"}
                      py={1}
                      px={2}
                      rounded={"full"}
                    >
                      <HStack spacing={2}>
                        <Icon
                          width="4"
                          height="4"
                          viewBox="0 0 16 16"
                          textColor={"white"}
                        >
                          <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8 5.33333V8L10 10M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.0241 13.2417 10.2961 13.5433C9.56815 13.8448 8.78793 14 8 14C7.21207 14 6.43185 13.8448 5.7039 13.5433C4.97595 13.2417 4.31451 12.7998 3.75736 12.2426C3.20021 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.5913 2 11.1174 2.63214 12.2426 3.75736C13.3679 4.88258 14 6.4087 14 8Z"
                              stroke="white"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Icon>
                        <AlertTitle fontSize={"sm"} fontWeight={"normal"}>
                          01:58:17
                        </AlertTitle>
                      </HStack>
                    </Alert>
                  </Skeleton>
                </Box>
                <Box
                  borderTop={1}
                  borderColor="neutral.color.line.secondary"
                  borderStyle={"dashed"}
                  w={"full"}
                />
              </HStack>
              {/* <Text>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </Text> */}
            </VStack>
          </Box>
          <Box
            alignItems={"center"}
            spacing={12}
            mx={"auto"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mt={"42px"}
          >
            <Stack alignItems={"center"} spacing={"16px"}>
              <PromoItems query={specialPromoQuery} />
              {specialPromoQuery.hasNextPage && (
                <CustomOrangeFullWidthButton
                  maxW={"400px"}
                  isLoading={specialPromoQuery.isFetchingNextPage}
                  onClick={specialPromoQuery.fetchNextPage}
                >
                  Lihat Lebih Banyak
                </CustomOrangeFullWidthButton>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
      {/* <CustomDivider /> */}
      <Box
        bg={"brand.blue.100"}
        as={"section"}
        mx={"-24px"}
        alignItems="flex-start"
      >
        <Box hidden={generalPromo?.data?.length === 0} pb={30} px={"24px"}>
          <Box bg={"white"} px={"24px"} mx={"-24px"}>
            <VStack
              mx={"auto"}
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              py={"24px"}
              alignItems={"flex-start"}
            >
              <HStack
                // px={{ base: "24px", xl: 0 }}
                alignSelf={"stretch"}
                justifyContent={"space-between"}
              >
                <Skeleton isLoaded={!generalPromo.isLoading}>
                  <Heading color={"brand.blue.600"} as={"h3"} size={"md"}>
                    Promo Lainnya
                  </Heading>
                </Skeleton>
              </HStack>
              {/* <Text>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </Text> */}
            </VStack>
          </Box>
          <Box
            mx={"auto"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mt={"42px"}
          >
            <Stack alignItems={"center"} spacing={"16px"}>
              <PromoItems query={generalPromo} />
              {generalPromo.hasNextPage && (
                <CustomOrangeFullWidthButton
                  maxW={"400px"}
                  isLoading={generalPromo.isFetchingNextPage}
                  onClick={generalPromo.fetchNextPage}
                >
                  Lihat Lebih Banyak
                </CustomOrangeFullWidthButton>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const service = [
    { id: 1, name: "Tour" },
    { id: 2, name: "Hotel" },
  ];
  const promo = ["Discount", "Early Bird"];
  const sort = [
    { label: "Update Terbaru", value: "ASC" },
    { label: "Update Terlama", value: "DESC" },
  ];
  return {
    props: {
      data: { service, promo, sort },
    },
  };
};

export default Promo;
