import {
  Box,
  Checkbox,
  HStack,
  Text,
  Skeleton,
  Button,
  Radio,
  Stack,
  useDisclosure,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import Image from "next/image";
import React, { useRef } from "react";
import { CustomDrawer } from "../drawer";
import SortIcon from "../../../public/svg/icons/sort.svg";
import ConfigIcon from "../../../public/svg/icons/config.svg";
import DateIcon from "../../../public/svg/icons/calendar.svg";
import { CustomFilterButton, CustomOrangeFullWidthButton } from "../button";

export const SearchFilters = ({
  title,
  totalData,
  // isLoading,
  filter,
  data = null,
  result,
  sort,
  ...props
}) => {
  const isLoading = false;
  const MonthButton = () => {
    // date-fns get array of 4 months from current month
    const month_name = [
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
    const period_month = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return `${month_name[date.getMonth()]} ${date.getFullYear()}`;
    });
    var min = new Date().getFullYear();
    var max = min + 2;
    var years = [];

    for (var i = min; i <= max; i++) {
      years.push(i);
    }
    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const formik = useFormikContext();
    return (
      <>
        <Skeleton isLoaded={!isLoading}>
          <Button
            variant={"link"}
            colorScheme={"brand.blue"}
            fontWeight={"normal"}
            size={{ base: "xs", md: "sm" }}
            onClick={onOpen}
            leftIcon={<DateIcon />}
          >
            Bulan
          </Button>
        </Skeleton>
        <CustomFilterButton
          drawer={drawerRef}
          isOpen={isOpen}
          onClose={onClose}
          footer={
            <SimpleGrid columns={2} w={"full"} spacing={6}>
              <CustomOrangeFullWidthButton
                isoutlined
                onClick={() => {
                  onClose();
                  formik.handleReset();
                }}
                mt={0}
              >
                Batal
              </CustomOrangeFullWidthButton>
              <CustomOrangeFullWidthButton
                isLoading={formik.isSubmitting}
                onClick={formik.handleSubmit}
                mt={0}
              >
                Terapkan
              </CustomOrangeFullWidthButton>
            </SimpleGrid>
          }
          title={"Pilih Bulan"}
          size={"sm"}
        >
          <Box>
            <Stack spacing={4}>
              <Stack py="16px" spacing={"24px"}>
                <Button
                  variant={"link"}
                  color="brand.blue.400"
                  onClick={() => formik.setFieldValue("period_month", [], true)}
                  fontSize={"sm"}
                  justifyContent={"flex-start"}
                  w={"min-content"}
                  alignSelf={"flex-end"}
                  fontWeight={"normal"}
                  // mb={2}
                >
                  Reset
                </Button>
                <Stack spacing={"24px"}>
                  <Field name={"period_month"} type={"select"}>
                    {({ field, form }) => (
                      <>
                        {period_month.map((month, index) => (
                          <Checkbox
                            {...field}
                            flexDirection={"row-reverse"}
                            colorScheme={"brand.blue"}
                            isChecked={form.values.period_month?.includes(
                              month
                            )}
                            justifyContent={"space-between"}
                            key={index}
                            value={month}
                          >
                            {month}
                          </Checkbox>
                        ))}
                      </>
                    )}
                  </Field>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </CustomFilterButton>
      </>
    );
  };
  const SortButton = () => {
    let data;
    if (title === "Hotel") {
      data = [
        { label: "Direkomendasikan", value: "RECOMMENDED" },
        { label: "Harga Terendah", value: "PRICE_ASC" },
        { label: "Harga Tertinggi", value: "PRICE_DESC" },
        { label: "Rangking Terendah", value: "RANK_ASC" },
        { label: "Rangking Tertinggi", value: "RANK_DESC" },
      ];
    }
    if (title === "Atraksi dan Hiburan") {
      data = [
        { label: "Harga Terendah", value: "ASC" },
        { label: "Harga Tertinggi", value: "DESC" },
      ];
    } else if (title !== "Hotel" && title !== "Atraksi dan Hiburan") {
      data = [
        // { label: "Harga Terendah", value: "ASC" },
        // { label: "Harga Tertinggi", value: "DESC" },
        { label: "Durasi Tersingkat", value: "ASC" },
        { label: "Durasi Terlama", value: "DESC" },
      ];
    }

    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const formik = useFormikContext();
    return (
      <>
        <Skeleton isLoaded={!isLoading}>
          <Button
            variant={"link"}
            colorScheme={"brand.blue"}
            fontWeight={"normal"}
            size={{ base: "xs", md: "sm" }}
            onClick={onOpen}
            leftIcon={<SortIcon />}
          >
            Urutkan
          </Button>
        </Skeleton>
        <CustomFilterButton
          drawer={drawerRef}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          title={"Urutkan"}
          footer={
            <SimpleGrid columns={2} w={"full"} spacing={6}>
              <CustomOrangeFullWidthButton
                isoutlined
                onClick={() => {
                  onClose();
                  formik.handleReset();
                }}
                mt={0}
              >
                Batal
              </CustomOrangeFullWidthButton>
              <CustomOrangeFullWidthButton
                isLoading={formik.isSubmitting}
                onClick={formik.handleSubmit}
                mt={0}
              >
                Terapkan
              </CustomOrangeFullWidthButton>
            </SimpleGrid>
          }
        >
          <Stack spacing={5} py={5}>
            <Button
              variant={"link"}
              color="brand.blue.400"
              onClick={() => formik.setFieldValue("sort", "", true)}
              fontSize={"sm"}
              justifyContent={"flex-start"}
              w={"min-content"}
              alignSelf={"flex-end"}
              fontWeight={"normal"}
              // mb={2}
            >
              Reset
            </Button>
            <Field name={"sort"}>
              {({ field, form }) =>
                !sort
                  ? data?.map((item, index) => (
                      <Radio
                        {...field}
                        flexDirection={"row-reverse"}
                        colorScheme={"brand.blue"}
                        isChecked={form.values.sort === item.value}
                        justifyContent={"space-between"}
                        key={index}
                        value={item.value}
                      >
                        {item.label}
                      </Radio>
                    ))
                  : sort?.map((item, index) => (
                      <Radio
                        {...field}
                        flexDirection={"row-reverse"}
                        colorScheme={"brand.blue"}
                        isChecked={form.values.sort === item.value}
                        justifyContent={"space-between"}
                        key={index}
                        value={item.value}
                      >
                        {item.label}
                      </Radio>
                    ))
              }
            </Field>
          </Stack>
        </CustomFilterButton>
      </>
    );
  };
  const FilterButton = () => {
    const drawerRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const formik = useFormikContext();
    console.log("value", formik.values);
    return (
      <Box>
        <Skeleton isLoaded={!isLoading}>
          <Button
            variant={"link"}
            colorScheme={"brand.blue"}
            fontWeight={"normal"}
            size={{ base: "xs", md: "sm" }}
            leftIcon={<ConfigIcon />}
            onClick={onOpen}
          >
            Filter
          </Button>
        </Skeleton>
        {!isLoading && (
          <CustomFilterButton
            drawer={drawerRef}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            title={"Filter"}
            footer={
              <SimpleGrid columns={2} w={"full"} spacing={6}>
                <CustomOrangeFullWidthButton
                  isoutlined
                  onClick={() => {
                    onClose();
                    formik.handleReset();
                  }}
                  mt={0}
                >
                  Batal
                </CustomOrangeFullWidthButton>
                <CustomOrangeFullWidthButton
                  isLoading={formik.isSubmitting}
                  onClick={formik.handleSubmit}
                  mt={0}
                >
                  Terapkan
                </CustomOrangeFullWidthButton>
              </SimpleGrid>
            }
            notrounded
            // footer={"mmtea"}
          >
            {filter ?? ""}
          </CustomFilterButton>
        )}
      </Box>
    );
  };

  return (
    <Box
      as={"section"}
      py={"24px"}
      px={{ md: "24px" }}
      // maxW={{ lg: "container.lg", xl: "container.xl" }}
    >
      <HStack
        mx={"auto"}
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        justifyContent={"space-between"}
      >
        <Skeleton isLoaded={(result && !result.isLoading) ?? true}>
          {title !== "Hotel" && (
            <Text
              color={"neutral.text.medium"}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {totalData ?? "-"} {title ?? ""} Tersedia
            </Text>
          )}
        </Skeleton>
        <Box>
          <HStack spacing={"20px"}>
            {result && result.isLoading ? (
              <Box
                position="relative"
                justifySelf={"flex-end"}
                w={"74px"}
                h={"45px"}
              >
                <Image
                  src="/png/Loading.gif"
                  alt="loading"
                  layout="fill"
                  objectFit="contain"
                  className="scale-up-image"
                />
              </Box>
            ) : (
              <Flex>
                {title === "Tour" ? <MonthButton /> : <></>}
                <FilterButton />
                <SortButton />
              </Flex>
            )}
          </HStack>
          {/* <Image layout="" width={75} height={75} src="/png/loading.png" /> */}
        </Box>
      </HStack>
    </Box>
  );
};
