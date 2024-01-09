import {
  Box,
  Collapse,
  IconButton,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { PackageListItem } from "../../src/components/card";
import EditIcon from "../../public/svg/icons/edit.svg";
import Layout from "../../src/components/layout";
import * as Yup from "yup";
import {
  getPackages,
  getPackageCategories,
} from "../../src/services/package.service";
import {
  FormPackageSearch,
  FormPackagesFilter,
} from "../../src/components/form";
import { CustomDivider } from "../../src/components/divider";
import { SearchFilters } from "../../src/components/search";
import { convertToArray } from "../../src/helpers";

const PackagesSearch = (props) => {
  const router = useRouter();
  const { package_duration, sort, package_type, period_month, period_year } =
    props;
  const { query } = router;
  const packages = useInfiniteQuery(
    ["getPackages", query],
    ({ pageParam = 1 }) => getPackages(query, pageParam),
    {
      getNextPageParam: (lastPage) => {
        try {
          if (lastPage) {
            if (lastPage.meta.pagination.pageCount === 0) return undefined;
            if (
              lastPage.meta.pagination.page !==
              lastPage.meta.pagination.pageCount
            ) {
              return lastPage.meta.pagination.page + 1;
            } else return undefined;
          }
        } catch (error) {
          console.error(error);
          return undefined;
        }
      },
    }
  );
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = packages;
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
  const handleSubmit = (values, actions) => {
    // setShownItems(9);
    router.replace({ pathname: `/packages/search`, query: values }, undefined, {
      shallow: true,
    });
  };
  const EditSearch = () => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
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
            Terapkan
          </CustomOrangeFullWidthButton>
        </SimpleGrid>
      );
    };
    return (
      <Box>
        <Formik
          initialValues={{
            sort: query.sort ?? "LOWEST_PRICE",
            isDomestic: query.isDomestic === "false" ? false : true,
            destination: query.destination ?? "Sura",
            period_month: query.period_month ?? "",
            period_year: query.period_year ?? "",
            max_price: query.max_price ?? 999999999,
            min_price: query.min_price ?? 0,
            duration: query.duration ?? "",
            category: convertToArray(query.category) ?? [],
          }}
          validationSchema={() =>
            Yup.object().shape({
              period_year: Yup.string().required("Tahun wajib diisi"),
              period_month: Yup.string().required("Bulan wajib diisi"),
            })
          }
          onSubmit={(val) => handleSubmit(val)}
        >
          <Form>
            <Box
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx={"auto"}
              as={"section"}
              bg={"white"}
            >
              <Collapse in={!isOpen}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  // px={"24px"}
                  py={"16px"}
                >
                  <Skeleton isLoaded={!packages.isLoading}>
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
                        {query.destination || "Semua Paket"}
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
                  <FormPackageSearch
                    package_tags={package_tags}
                    package_type={package_type}
                    period_month={period_month}
                    period_year={period_year}
                    actionButton={<ActionButton />}
                    handleSubmit={handleSubmit}
                  />
                </Stack>
              </Collapse>
            </Box>
            <CustomDivider />
            <SearchFilters
              isLoading={packages.isLoading}
              title={"Paket"}
              filter={
                <FormPackagesFilter
                  duration={package_duration}
                  package_type={package_type}
                />
              }
              result={packages}
              data={packages.data}
              totalData={packages.data?.pages[0]?.meta?.pagination?.total}
              sort={sort}
            />
          </Form>
        </Formik>
      </Box>
    );
  };
  return (
    <Layout
      type={"nested"}
      metatitle={`Hasil Pencarian Paket ke ${
        query.destination || "Semua Tujuan"
      }, ${query.period_month} ${query.period_year}`}
      pagetitle={"Hasil Pencarian Paket"}
    >
      {/* Edit Search */}
      <EditSearch />
      <Box as={"section"} px={"24px"} bg={"brand.blue.100"} mx={"-24px"}>
        <Stack
          spacing={"16px"}
          py={"24px"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
        >
          <PackageListItem query={packages} />
          <CustomOrangeFullWidthButton
            hidden={!hasNextPage}
            onClick={fetchNextPage}
            isLoading={isFetchingNextPage}
          >
            Lihat Lebih Banyak
          </CustomOrangeFullWidthButton>
        </Stack>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
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
  const package_type = await getPackageCategories();
  const sort = [
    { label: "Harga Terendah", value: "LOWEST_PRICE" },
    { label: "Harga Tertinggi", value: "HIGHEST_PRICE" },
    { label: "Durasi Tersingkat", value: "SHORTEST_DURATION" },
    { label: "Durasi Terlama", value: "LONGEST_DURATION" },
  ];
  const package_duration = [
    { label: "< 1 Week", value: "1" },
    { label: "> 1 Week", value: "2" },
  ];

  var min = new Date().getFullYear();
  var max = min + 2;
  var years = [];

  for (var i = min; i <= max; i++) {
    years.push(i);
  }

  return {
    props: {
      sort,
      package_duration,
      package_type,
      period_month,
      period_year: years,
      meta: {
        title: "Hasil Pencarian Paket",
      },
    },
  };
};

export default PackagesSearch;
