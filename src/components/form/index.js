import {
  Badge,
  Box,
  Button,
  chakra,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  VStack,
  Text,
  Wrap,
  FormHelperText,
  Divider,
  Circle,
  Spinner,
  InputLeftElement,
  SimpleGrid,
  useDisclosure,
  Icon,
  Grid,
  GridItem,
  Center,
  Checkbox,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  Accordion,
  TabPanel,
  TabPanels,
  Tabs,
  TabList,
  Tab,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikProvider,
  useFormikContext,
} from "formik";
import Image from "next/image";
import _, { result } from "underscore";
import HotelIcon from "../../../public/svg/icons/location.svg";
import PersonIcon from "../../../public/svg/flights/person.svg";
import RoomIcon from "../../../public/svg/icons/room.svg";
import ChevronFilledDown from "../../../public/svg/icons/chevron-filled-down.svg";
import ExpandArrowIcon from "../../../public/svg/icons/expand-arrow.svg";
import DateIcon from "../../../public/svg/icons/date.svg";
import Calendar from "react-calendar";
import MailIcon from "../../../public/svg/icons/mail.svg";
import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  addDaysWithMonthName,
  commaSeparatedValues,
  convertDate,
  convertDateWithMonthName,
  convertRupiah,
} from "../../helpers";
import { CustomOrangeFullWidthButton } from "../button";
import {
  CustomCheckbox,
  CustomCheckboxFill,
  CustomRadioFill,
} from "../checkbox";
import { CustomDropdown } from "../dropdown";
import { CustomRangeSlider } from "../range";
import GlobalForm, { CalendarForm } from "../person";
import DropIcon from "../../../public/svg/icons/drop.svg";
import { useQuery } from "@tanstack/react-query";
import {
  getAirports,
  getRecommendedAirports,
} from "../../services/flight.service";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { checkoutData } from "../../state/tour/tour.slice";
import { useRouter } from "next/router";
import { getTourCountryV2 } from "../../services/tour.service";
import date from "../../helpers/date";
import CustomCalendar from "../calendar";
import { SelectForm } from "../person";
import {
  getAttractions,
  getAttractionsArea,
  getAttractionsCategory,
  getAttractionsGroupCategories,
  getStateById,
} from "../../services/attraction.service";
import { searchForm } from "../../services/hotel.service";
import { capitalizeFirstLetter } from "../../helpers/capitalizeFirstLetter";
import countries from "../../mocks/countries.json";
import { addDays, addYears } from "date-fns";
import {
  getDestinations,
  getDestinationsRegions,
  getPackageType,
} from "../../services/insurance.service";

export const FormTourSearch = ({ period_month, period_year, actionButton }) => {
  // const PeriodMonthForm = ({ field, item, form }) => {
  //   return (
  //     <>
  //       <CustomDropdown
  //         title={"Pilih Bulan"}
  //         placeholder={"Pilih Bulan"}
  //         value={form.values.period_month}
  //         // notrounded
  //         label={item?.map((item) => {
  //           if (form.values.period_month == item) return item;
  //         })}
  //       >
  //         <Stack spacing={5} py={5}>
  //           {item &&
  //             item?.map((item, index) => (
  //               <Radio
  //                 {...field}
  //                 flexDirection={"row-reverse"}
  //                 colorScheme={"brand.blue"}
  //                 justifyContent={"space-between"}
  //                 key={index}
  //                 isChecked={form.values.period_month == item}
  //                 value={item}
  //               >
  //                 {item}
  //               </Radio>
  //             ))}
  //         </Stack>
  //       </CustomDropdown>
  //     </>
  //   );
  // };
  // const PeriodYearForm = ({ field, item, form }) => {
  //   return (
  //     <>
  //       <CustomDropdown
  //         title={"Pilih Tahun"}
  //         placeholder={"Pilih Tahun"}
  //         value={form.values.period_year}
  //         label={item?.map((item) => {
  //           if (form.values.period_year == item) return item;
  //         })}
  //       >
  //         <RadioGroup
  //           {...field}
  //           value={form.values.period_year}
  //           onChange={(value) => {
  //             form.setFieldValue(field.name, value, false);
  //             form.setFieldValue("period_month", "", false);
  //           }}
  //         >
  //           <Stack spacing={5} py={5}>
  //             {item &&
  //               item?.map((item, index) => (
  //                 <Radio
  //                   flexDirection={"row-reverse"}
  //                   colorScheme={"brand.blue"}
  //                   justifyContent={"space-between"}
  //                   key={index}
  //                   // isChecked={field.value == item}
  //                   value={item.toString()}
  //                 >
  //                   {item}
  //                 </Radio>
  //               ))}
  //           </Stack>
  //         </RadioGroup>
  //       </CustomDropdown>
  //     </>
  //   );
  // };

  const FormikActionButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        type="submit"
      >
        Cari Tour
      </CustomOrangeFullWidthButton>
    );
  };

  return (
    <>
      <Stack spacing={"16px"}>
        {/* <Field name="area">
          {({ field, form }) => (
            <FormControl
              isRequired
              isInvalid={form.errors.area && form.touched.area}
            >
              <FormLabel
                fontSize={{ base: "sm", md: "md" }}
                color={"neutral.text.medium"}
              >
                Wilayah
              </FormLabel>
              <AreaForm field={field} form={form} item={area} />
              <FormErrorMessage>{form.errors.area}</FormErrorMessage>
            </FormControl>
          )}
        </Field> */}
        {/* <Field name="tour_type" type="radio">
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.tour_type && form.touched.tour_type}
            >
              <FormLabel fontSize={{base: "sm", md: 'md'}} color={"neutral.text.medium"}>
                Jenis Tour
              </FormLabel>
              <TourTypeForm field={field} form={form} item={tour_type} />
              <FormErrorMessage>{form.errors.tour_type}</FormErrorMessage>
            </FormControl>
          )}
        </Field> */}
        {/* <Field name="destination" type="checkbox">
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.destination && form.touched.destination}
            >
              <FormLabel
                fontSize={{ base: "sm", md: "md" }}
                color={"neutral.text.medium"}
              >
                Destinasi
              </FormLabel>
              <DestinationForm field={field} form={form} items={destination} />
              <FormErrorMessage>{form.errors.destination}</FormErrorMessage>
            </FormControl>
          )}
        </Field> */}
        <Field name="destination" type="select">
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.destination && form.touched.destination}
            >
              {/* <FormLabel
                fontSize={{ base: "sm", md: "md" }}
                color={"neutral.text.medium"}
              >
                Negara Tujuan
              </FormLabel> */}
              <SelectForm
                onChange={({ value }) => {
                  form.setFieldValue(field.name, value, false);
                  form.setFieldValue("airlines", [], false);
                  form.submitForm();
                }}
                isRequired
                isTour
                form={form}
                field={field}
                name="destination"
                placeholder="Negara Tujuan"
              />
              <FormErrorMessage>{form.errors.destination}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        {/* <HStack>
          <Field name="period_month" type="radio">
            {({ field, form }) => (
              <FormControl
                isInvalid={
                  form.errors.period_month && form.touched.period_month
                }
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Periode Bulan
                </FormLabel>
                <PeriodMonthForm
                  field={field}
                  form={form}
                  item={
                    form.values.period_year ==
                    new Date().getFullYear().toString()
                      ? period_month &&
                        period_month.slice(new Date().getMonth())
                      : period_month
                  }
                />
                <FormErrorMessage>{form.errors.period_month}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="period_year" type="radio">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.period_year && form.touched.period_year}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Periode Tahun
                </FormLabel>
                <PeriodYearForm field={field} form={form} item={period_year} />
                <FormErrorMessage>{form.errors.period_year}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </HStack> */}
      </Stack>
      {/* {actionButton ?? <FormikActionButton />} */}
    </>
  );
};
export const FormPackageSearch = ({
  package_tags,
  period_month,
  period_year,
  actionButton,
}) => {
  const PeriodMonthForm = ({ field, item, form }) => {
    const label = item?.map((item) => {
      if (form.values.period_month == item) return item;
    });
    return (
      <>
        <CustomDropdown
          title={"Pilih Bulan"}
          placeholder={"Pilih Bulan"}
          value={form.values.period_month}
          // notrounded
          label={label}
        >
          <Stack spacing={5} py={5}>
            {item &&
              item?.map((item, index) => (
                <Radio
                  {...field}
                  flexDirection={"row-reverse"}
                  colorScheme={"brand.blue"}
                  justifyContent={"space-between"}
                  key={index}
                  isChecked={form.values.period_month == item}
                  value={item}
                >
                  {item}
                </Radio>
              ))}
          </Stack>
        </CustomDropdown>
      </>
    );
  };
  const PeriodYearForm = ({ field, item, form }) => {
    return (
      <>
        <CustomDropdown
          title={"Pilih Tahun"}
          placeholder={"Pilih Tahun"}
          value={form.values.period_year}
          label={item?.map((item) => {
            if (form.values.period_year == item) return item;
          })}
        >
          <RadioGroup
            {...field}
            value={form.values.period_year}
            onChange={(value) => {
              form.setFieldValue(field.name, value, false);
              form.setFieldValue("period_month", "", false);
            }}
          >
            <Stack spacing={5} py={5}>
              {item &&
                item?.map((item, index) => (
                  <Radio
                    flexDirection={"row-reverse"}
                    colorScheme={"brand.blue"}
                    justifyContent={"space-between"}
                    key={index}
                    // isChecked={field.value == item}
                    value={item.toString()}
                  >
                    {item}
                  </Radio>
                ))}
            </Stack>
          </RadioGroup>
        </CustomDropdown>
      </>
    );
  };

  const FormikActionButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        type="submit"
      >
        Cari Paket
      </CustomOrangeFullWidthButton>
    );
  };

  const formik = useFormikContext();

  return (
    <>
      <Stack spacing={"16px"}>
        <FormControl
          isRequired
          isInvalid={formik.errors.isDomestic && formik.touched.isDomestic}
        >
          <FormLabel
            fontSize={{ base: "sm", md: "md" }}
            color={"neutral.text.medium"}
          >
            Pilih Paket
          </FormLabel>
          <Flex gap={"12px"}>
            {package_tags.data?.map((item, index) => (
              <Field
                name="isDomestic"
                key={index}
                value={item.isDomestic}
                type={"radio"}
              >
                {({ field, form }) => (
                  <CustomRadioFill
                    onClick={() => {
                      form.setFieldValue(field.name, field.value, false);
                      form.setFieldValue("destination", "", false);
                    }}
                    form={form}
                    key={index}
                    label={item.name}
                    field={field}
                  />
                )}
              </Field>
            ))}
          </Flex>
        </FormControl>
        <Field name="destination" type="select">
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.destination && form.touched.destination}
            >
              <FormLabel
                fontSize={{ base: "sm", md: "md" }}
                color={"neutral.text.medium"}
              >
                Pilih Destinasi
              </FormLabel>
              <SelectForm
                isPackage
                isRequired
                form={form}
                field={field}
                name={field.name}
                placeholder="Destinasi"
                selected={field.value}
              />
              <FormErrorMessage>{form.errors.destination}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        <HStack>
          <Field name="period_month" type="radio">
            {({ field, form }) => (
              <FormControl
                isInvalid={
                  form.errors.period_month && form.touched.period_month
                }
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Periode Bulan
                </FormLabel>
                <PeriodMonthForm
                  field={field}
                  form={form}
                  item={
                    form.values.period_year ==
                    new Date().getFullYear().toString()
                      ? period_month &&
                        period_month.slice(new Date().getMonth())
                      : period_month
                  }
                />
                <FormErrorMessage>{form.errors.period_month}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="period_year" type="radio">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.period_year && form.touched.period_year}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Periode Tahun
                </FormLabel>
                <PeriodYearForm field={field} form={form} item={period_year} />
                <FormErrorMessage>{form.errors.period_year}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </HStack>
      </Stack>
      {actionButton ?? <FormikActionButton />}
    </>
  );
};
export const FormInsuranceSearch = ({ handleSubmit, actionButton = null }) => {
  const router = useRouter();
  const { query } = router;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchRef = React.useRef();
  const [regions, setRegions] = useState(query.RegionID || ""),
    [search, setSearch] = useState("");

  const { data: destination_region } = useQuery(["destination_region"], () =>
    getDestinationsRegions()
  );

  const { data: packageType } = useQuery(["packageType"], () =>
    getPackageType()
  );

  const destination = useQuery(["destination", search, regions], async () => {
    let result = await getDestinations(regions, search);
    return Promise.resolve(result);
  });

  function handleSearch(value) {
    setSearch(value);
  }

  const SubmitButton = () => {
    const formik = useFormikContext();
    setRegions(formik.values.RegionID);
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        onClick={formik.submitForm}
      >
        Temukan Asuransi
      </CustomOrangeFullWidthButton>
    );
  };

  return (
    <Formik
      initialValues={{
        origins: query.origins ?? "",
        regions: query.regions ?? "",
        RegionID: query.RegionID ?? "",
        destinations: query.destinations ?? "",
        DestinationID: query.DestinationID ?? "",
        package_type: query.package_type ?? "",
        PackageTypeID: query.PackageTypeID ?? "",
        // DateOfBirth: query.DateOfBirth ? new Date(query.DateOfBirth) : addYears(new Date(), -24),
        adults: parseInt(query?.adults) || 1,
        children: parseInt(query?.children) || 0,
        isFamily: query.isFamily ? true : false,
        travel_start_date: query.travel_start_date
          ? new Date(query.travel_start_date)
          : new Date(),
        travel_end_date: query.travel_end_date
          ? new Date(query.travel_end_date)
          : addDays(new Date(), 3),
        travel_yearly_start_date: query.travel_yearly_start_date ?? "",
      }}
      onSubmit={(val) => handleSubmit(val)}
      validationSchema={() =>
        Yup.object().shape({
          travel_end_date: Yup.string().required("Tanggal Pulang harap diisi"),
          travel_start_date: Yup.string().required(
            "Tanggal Keberangkatan harap diisi"
          ),

          package_type: Yup.string().required("Jenis Perlindungan harap diisi"),
          //travel_yearly_start_date required when choose package_type Yearly
          travel_yearly_start_date: Yup.string().when("package_type", {
            is: (val) => val === "Yearly 90" || val === "Yearly 180",
            then: Yup.string().required(
              "Tanggal Mulai Perlindungan harap diisi"
            ),
          }),
          origins: Yup.string().required("Kota Asal harap diisi"),
          destinations: Yup.string().required("Tujuan harap diisi"),
          // DateOfBirth: Yup.string().required("Tanggal Lahir harap diisi"),
          regions: Yup.string().required("Wilayah harap diisi"),
          //adults tidak boleh lebih dari 10
          adults: Yup.string().test(
            "adults",
            "Jumlah Dewasa tidak boleh lebih dari 10",
            (value) => {
              return value <= 10;
            }
          ),
          children: Yup.string().when("adults", {
            is: (val) => val < 1,
            then: Yup.string().test(
              "children",
              "Jumlah Dewasa harus lebih dari 0",
              (value) => {
                // console.log(value > 0);
                return value == 0;
              }
            ),
          }),
        })
      }
    >
      <Form>
        <Stack spacing={"16px"}>
          <Field name="origins">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
              >
                <>
                  <FormLabel
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.medium"}
                  >
                    Kota Asal
                  </FormLabel>
                  <SelectForm
                    isRequired
                    isInsurance
                    form={form}
                    field={field}
                    name={field.name}
                    placeholder="Kota Asal"
                    selected={field.value}
                  />
                  <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                </>
              </FormControl>
            )}
          </Field>
          <Field name="regions">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
              >
                <>
                  <FormLabel
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.medium"}
                  >
                    Pilih Wilayah
                  </FormLabel>
                  <CustomDropdown
                    title={"Pilih Wilayah"}
                    placeholder={"Pilih Wilayah"}
                    value={form.values.regions}
                  >
                    <Stack spacing={5} py={5}>
                      {destination_region &&
                        destination_region?.map((item, index) => (
                          <Radio
                            {...field}
                            flexDirection={"row-reverse"}
                            colorScheme={"brand.blue"}
                            justifyContent={"space-between"}
                            key={index}
                            isChecked={
                              form.values.origins == item.attributes.name
                            }
                            value={item.attributes.name}
                            onChange={(e) => {
                              form.setFieldValue("regions", e.target.value);
                              form.setFieldValue(
                                "RegionID",
                                item.attributes.regionId
                              );
                            }}
                          >
                            {item.attributes.name}
                          </Radio>
                        ))}
                    </Stack>
                  </CustomDropdown>
                  {/* shhow warning if choose domestic */}
                  {form.values.regions == "DOMESTIC" && (
                    <Text fontSize={"sm"} color={"yellow.500"} mt={2} mb={2}>
                      *Untuk tujuan domestik, asuransi hanya mencover minimum
                      100 KM dari kota asal.
                    </Text>
                  )}
                  <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                </>
              </FormControl>
            )}
          </Field>
          <Field name="destinations">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Pilih Tujuan
                </FormLabel>
                <CustomDropdown
                  title={"Pilih Tujuan"}
                  placeholder={"Pilih Tujuan"}
                  value={form.values.destinations}
                  initialFocusRef={searchRef}
                  innerbutton={
                    <HStack
                      justify={"space-between"}
                      w={"full"}
                      alignItems={"center"}
                    >
                      <HStack>
                        <Text
                          color={
                            !form.values.destinations && "neutral.text.low"
                          }
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {form.values.destinations || "Pilih Tujuan"}
                        </Text>
                      </HStack>
                    </HStack>
                  }
                >
                  <InputGroup mb={"16px"}>
                    <Input
                      ref={searchRef}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Cari"
                      value={search}
                      variant="filled"
                    />
                    <InputRightElement pointerEvents="none">
                      <Image
                        src="/svg/header-search.svg"
                        alt="search"
                        width={16}
                        height={16}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Box>
                    <Box
                      mx={"-24px"}
                      px={"24px"}
                      py={"12px"}
                      bg={"brand.blue.100"}
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight={"semibold"}
                        color={"brand.blue.500"}
                      >
                        {search ? "Hasil pencarian " + search : "Pilih Tujuan"}
                      </Text>
                    </Box>
                    <Stack py={5} mx={"-24px"}>
                      {/* TODO: Integrate data using useQuery for search feature */}

                      {!destination.isLoading && destination.data.length > 0 ? (
                        destination?.data.map((item, index) => (
                          <Flex
                            py={"6px"}
                            px={"24px"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            key={index}
                            cursor="pointer"
                            onClick={() => {
                              form.setFieldValue(
                                "destinations",
                                item.attributes.name
                              );
                              form.setFieldValue(
                                "DestinationID",
                                item.attributes.destinationId
                              );
                              onClose();
                            }}
                            bg={
                              form.values.destinations === item.attributes.name
                                ? "brand.blue.100"
                                : "transparent"
                            }
                            _hover={{ bg: "brand.blue.100" }}
                          >
                            <VStack alignItems={"start"}>
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                fontWeight={"semibold"}
                              >
                                {item.attributes.name}
                              </Text>
                            </VStack>
                          </Flex>
                        ))
                      ) : !destination.isLoading &&
                        destination.data.length == 0 ? (
                        <Flex
                          py={"6px"}
                          px={"24px"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <VStack alignItems={"start"}>
                            <Text
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight={"semibold"}
                            >
                              Silahkan Pilih Wilayah Terlebih Dahulu
                            </Text>
                          </VStack>
                        </Flex>
                      ) : (
                        <Center>
                          <Spinner />
                        </Center>
                      )}
                    </Stack>
                  </Box>
                </CustomDropdown>
                <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Stack flexGrow={1}>
            <Stack direction={"row"} spacing={"18px"}>
              <Field name={"adults"}>
                {({ form }) => (
                  <FormControl
                    isInvalid={form.errors?.adults && form.touched.adults}
                  >
                    <FormLabel
                      fontSize={{ base: "sm", md: "md" }}
                      color={"neutral.text.low"}
                    >
                      Dewasa
                    </FormLabel>
                    <CustomDropdown
                      footer={"Pilih"}
                      title="Jumlah Orang"
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Person"
                            width={24}
                            height={24}
                            src="/svg/flights/person.svg"
                          />
                          <Text>{form.values.adults}</Text>
                        </Flex>
                      }
                    >
                      <Stack spacing={5} py={5}>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Dewasa"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              {`(18 tahun ke atas)`}
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.adults === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.adults > 0) {
                                  form.setFieldValue(
                                    "adults",
                                    form.values.adults - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.adults}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "adults",
                                  form.values.adults + 1,
                                  false
                                );
                                // setAdult(form.values.participants.adults + 1);
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Anak"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              {`(< 17 tahun)`}
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.children === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.children > 0) {
                                  form.setFieldValue(
                                    "children",
                                    form.values.children - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.children}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "children",
                                  form.values.children + 1,
                                  false
                                );
                                // setChild(form.values.children + 1);
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    </CustomDropdown>
                    <FormErrorMessage>{form.errors?.adults}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"children"}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors?.children && form.touched.children}
                  >
                    <FormLabel
                      fontSize={{ base: "sm", md: "md" }}
                      color={"neutral.text.low"}
                    >
                      Anak-anak
                    </FormLabel>
                    <CustomDropdown
                      footer={"Pilih"}
                      title="Jumlah Orang"
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Person"
                            width={24}
                            height={24}
                            src="/svg/flights/person.svg"
                          />
                          <Text>{form.values[field.name]}</Text>
                        </Flex>
                      }
                    >
                      <Stack spacing={5} py={5}>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="neutraltext.high"
                          >
                            {"Dewasa"}
                          </Text>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.adults === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.adults > 0) {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.adults - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.adults}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.adults",
                                  form.values.adults + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Anak"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              {`(< 17 tahun)`}
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.children === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.children > 0) {
                                  form.setFieldValue(
                                    "children",
                                    form.values.children - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.children}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "children",
                                  form.values.children + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    </CustomDropdown>
                    <FormErrorMessage>{form.errors?.children}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Stack>
          </Stack>
          <Field name="package_type">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Pilih Jenis Perlindungan
                </FormLabel>
                <CustomDropdown
                  title={"Pilih Jenis Perlindungan"}
                  placeholder={"Pilih Jenis Perlindungan"}
                  value={form.values[field.name]}
                >
                  <Stack spacing={5} py={5}>
                    {packageType &&
                      packageType?.map((item, index) => (
                        <Radio
                          {...field}
                          flexDirection={"row-reverse"}
                          colorScheme={"brand.blue"}
                          justifyContent={"space-between"}
                          key={index}
                          isChecked={form.values.origins == item.Name}
                          value={item.Name}
                          onChange={(e) => {
                            form.setFieldValue("package_type", e.target.value);
                            form.setFieldValue("PackageTypeID", item.ID);
                          }}
                        >
                          {item.Name}
                        </Radio>
                      ))}
                  </Stack>
                </CustomDropdown>
                <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="travel_start_date">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
                hidden={
                  form.values.package_type === "Yearly 90" ||
                  form.values.package_type === "Yearly 180"
                    ? true
                    : false
                }
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Start Date
                </FormLabel>
                <FormRangeDate
                  range={["travel_start_date", "travel_end_date"]}
                  name="travel_start_date"
                />
                <FormErrorMessage>
                  {form.errors.travel_start_date}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="travel_end_date">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
                hidden={
                  form.values.package_type === "Yearly 90" ||
                  form.values.package_type === "Yearly 180"
                    ? true
                    : false
                }
                // isDisabled={form.values.package_type === "Yearly 90" || form.values.package_type === "Yearly 180" ? true : false}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  End Date
                </FormLabel>
                <FormRangeDate
                  range={["travel_start_date", "travel_end_date"]}
                  name="travel_end_date"
                />
                <FormErrorMessage>
                  {form.errors.travel_end_date}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="travel_yearly_start_date">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
                hidden={
                  form.values.package_type === "Yearly 90" ||
                  form.values.package_type === "Yearly 180"
                    ? false
                    : true
                }
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Start Date
                </FormLabel>
                <CustomDropdown
                  title="Pilih Tanggal Mulai"
                  placeholder="Pilih Tanggal Mulai"
                  value={
                    form.values.travel_yearly_start_date !== ""
                      ? date(
                          new Date(form.values.travel_yearly_start_date),
                          "dd LLLL yyyy"
                        )
                      : form.values.travel_yearly_start_date
                  }
                  rightIcon={<DateIcon />}
                >
                  <Stack spacing={5} py={5}>
                    <CustomCalendar
                      value={
                        form.values.travel_yearly_start_date !== ""
                          ? new Date(form.values.travel_yearly_start_date)
                          : form.values.travel_yearly_start_date
                      }
                      onChange={(date) => {
                        form.setFieldValue(
                          "travel_yearly_start_date",
                          date,
                          false
                        );
                      }}
                    />
                  </Stack>
                </CustomDropdown>
                <FormErrorMessage>
                  {form.errors.travel_start_date}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
          {/* <Field name="DateOfBirth">
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors[field.name] && form.touched[field.name]}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Tanggal Lahir
                </FormLabel>
                <Field name="DateOfBirth">
                  {({ form }) => (
                    <CustomDropdown
                      title="Pilih Tanggal Lahir"
                      placeholder="Pilih Tanggal Lahir"
                      value={
                        form.values.DateOfBirth !== ""
                          ? date(
                              new Date(form.values.DateOfBirth),
                              "dd LLLL yyyy"
                            )
                          : form.values.DateOfBirth
                      }
                      // rightIcon={<DateIcon />}

                    >
                      <Stack spacing={5} py={5}>
                        <CustomCalendar
                          value={
                            form.values.DateOfBirth !== ""
                              ? new Date(form.values.DateOfBirth)
                              : form.values.DateOfBirth
                          }
                          onChange={(e) => {
                            form.setFieldValue(
                              "DateOfBirth",
                              new Date(e).toISOString()
                            );
                          }}
                        />
                      </Stack>
                    </CustomDropdown>
                  )}
                </Field>
                <FormErrorMessage>{form.errors.DateOfBirth}</FormErrorMessage>
              </FormControl>
            )}
          </Field> */}
          <Field name="isFamily">
            {({ field, form }) => {
              const total =
                parseInt(form.values.adults) + parseInt(form.values.children);
              return (
                <FormControl
                  isInvalid={
                    form.errors[field.name] && form.touched[field.name]
                  }
                >
                  <FormLabel
                    fontSize={{ base: "sm", md: "md" }}
                    color={"neutral.text.medium"}
                    mb={0}
                  >
                    Part of family
                  </FormLabel>
                  {/* slider */}
                  <Stack spacing={5} py={5}>
                    <Flex alignItems={"start"}>
                      <Switch
                        {...field}
                        colorScheme={"brand.blue"}
                        isChecked={form.values.isFamily}
                        onChange={(e) => {
                          form.setFieldValue("isFamily", e.target.checked);
                        }}
                        disabled={total > 1 ? false : true}
                      />
                      <Text
                        fontSize={"sm"}
                        ml={5}
                        color={"neutral.text.medium"}
                      >
                        We are husband/wife or parents with kids
                      </Text>
                    </Flex>
                  </Stack>
                  <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
                </FormControl>
              );
            }}
          </Field>
          {actionButton ?? <SubmitButton />}
        </Stack>
      </Form>
    </Formik>
  );
};
export const FormCruiseSearch = ({
  destinations,
  period_month,
  period_year,
  actionButton,
}) => {
  const PeriodMonthForm = ({ field, item }) => {
    const form = useFormikContext();
    const label = item?.map((item) => {
      if (form.values.period_month == item) return item;
    });
    return (
      <>
        <CustomDropdown
          title={"Pilih Bulan"}
          placeholder={"Pilih Bulan"}
          value={form.values.period_month}
          // notrounded
          label={label}
        >
          <Stack spacing={5} py={5}>
            {item &&
              item?.map((item, index) => (
                <Radio
                  {...field}
                  flexDirection={"row-reverse"}
                  colorScheme={"brand.blue"}
                  justifyContent={"space-between"}
                  key={index}
                  isChecked={form.values.period_month == item}
                  value={item}
                >
                  {item}
                </Radio>
              ))}
          </Stack>
        </CustomDropdown>
      </>
    );
  };
  const PeriodYearForm = ({ field, item }) => {
    const form = useFormikContext();
    return (
      <>
        <CustomDropdown
          title={"Pilih Tahun"}
          placeholder={"Pilih Tahun"}
          value={form.values.period_year}
          label={item?.map((item) => {
            if (form.values.period_year == item) return item;
          })}
        >
          <RadioGroup
            {...field}
            value={form.values.period_year}
            onChange={(value) => {
              form.setFieldValue(field.name, value, false);
              form.setFieldValue("period_month", "", false);
            }}
          >
            <Stack spacing={5} py={5}>
              {item &&
                item?.map((item, index) => (
                  <Radio
                    flexDirection={"row-reverse"}
                    colorScheme={"brand.blue"}
                    justifyContent={"space-between"}
                    key={index}
                    // isChecked={field.value == item}
                    value={item.toString()}
                  >
                    {item}
                  </Radio>
                ))}
            </Stack>
          </RadioGroup>
        </CustomDropdown>
      </>
    );
  };

  const FormikActionButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        type="submit"
      >
        Temukan Cruise
      </CustomOrangeFullWidthButton>
    );
  };

  return (
    <>
      <Stack spacing={"16px"}>
        <Field name="destination" type="select">
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.destination && form.touched.destination}
            >
              <FormLabel
                fontSize={{ base: "sm", md: "md" }}
                color={"neutral.text.medium"}
              >
                Pilih Destinasi
              </FormLabel>
              <CustomDropdown
                title={"Pilih Destinasi"}
                placeholder={"Pilih Destinasi"}
                value={form.values.destination}
              >
                <Stack spacing={5} py={5}>
                  {destinations?.map((item, index) => (
                    <Radio
                      {...field}
                      value={item.attributes.name}
                      flexDirection={"row-reverse"}
                      colorScheme={"brand.blue"}
                      justifyContent={"space-between"}
                      key={index}
                      isChecked={
                        form.values.destination == item.attributes.name
                      }
                    >
                      {item.attributes.name}
                    </Radio>
                  ))}
                </Stack>
              </CustomDropdown>
              <FormErrorMessage>{form.errors.destination}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        <HStack>
          <Field name="period_month" type="radio">
            {({ field, form }) => (
              <FormControl
                isInvalid={
                  form.errors.period_month && form.touched.period_month
                }
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Periode Bulan
                </FormLabel>
                <PeriodMonthForm
                  field={field}
                  form={form}
                  item={
                    form.values.period_year ==
                    new Date().getFullYear().toString()
                      ? period_month &&
                        period_month.slice(new Date().getMonth())
                      : period_month
                  }
                />
                <FormErrorMessage>{form.errors.period_month}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="period_year" type="radio">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.period_year && form.touched.period_year}
              >
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  color={"neutral.text.medium"}
                >
                  Periode Tahun
                </FormLabel>
                <PeriodYearForm field={field} form={form} item={period_year} />
                <FormErrorMessage>{form.errors.period_year}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </HStack>
      </Stack>
      {actionButton ?? <FormikActionButton />}
    </>
  );
};
export const FormPackagesFilter = ({ duration, package_type }) => {
  return (
    <>
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Rentang Harga</Heading>
        <FormPrice />
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Durasi Paket</Heading>
        <Stack spacing={5} py={5}>
          {duration.map((item, index) => {
            return (
              <Field
                key={index}
                name="duration"
                value={item.label}
                type="checkbox"
              >
                {({ field, form }) => (
                  <Radio
                    {...field}
                    flexDirection={"row-reverse"}
                    colorScheme={"brand.blue"}
                    justifyContent={"space-between"}
                    key={index}
                    // onChange={() => form.setF}
                    isChecked={form.values.duration == item.label}
                    value={item.label}
                  >
                    {item.label}
                  </Radio>
                )}
              </Field>
            );
          })}
        </Stack>
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Tipe Paket</Heading>
        <Wrap spacingY={"16px"} spacingX={"6px"}>
          {package_type.data.map((item, index) => {
            return (
              <Field
                key={index}
                name="category"
                value={item.attributes.name}
                type="checkbox"
              >
                {({ field, form }) => (
                  <>
                    <CustomCheckboxFill
                      form={form}
                      field={field}
                      label={item.attributes.name}
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
export const FormTourFilter = ({ tour_type, airlines, tour_duration }) => {
  // const { formik } = props;
  // const formik = useFormikContext();
  return (
    <>
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Rentang Harga</Heading>
        <FormPrice />
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      {tour_duration && tour_duration?.length > 0 && (
        <Stack spacing={"24px"} py={"24px"}>
          <Heading fontSize={{ base: "md", md: "lg" }}>Durasi Tour</Heading>
          <Stack spacing={5} py={5}>
            {tour_duration.map((item, index) => {
              return (
                <Field
                  key={index}
                  name="tour_duration"
                  value={item.value}
                  type="checkbox"
                >
                  {({ field, form }) => (
                    <Radio
                      {...field}
                      flexDirection={"row-reverse"}
                      colorScheme={"brand.blue"}
                      justifyContent={"space-between"}
                      key={index}
                      // onChange={() => form.setF}
                      isChecked={form.values.tour_duration == item.value}
                      value={item.value}
                    >
                      {item.label}
                    </Radio>
                  )}
                </Field>
              );
            })}
          </Stack>
        </Stack>
      )}
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      {tour_type && tour_type?.length > 0 && (
        <Stack spacing={"24px"} py={"24px"}>
          <Heading fontSize={{ base: "md", md: "lg" }}>Tipe Tour</Heading>
          <Wrap spacingY={"16px"} spacingX={"6px"}>
            {tour_type.map((item, index) => {
              return (
                <Field
                  key={index}
                  name="tour_type"
                  value={item.id?.toString()}
                  type="checkbox"
                >
                  {({ field, form }) => (
                    <>
                      <CustomCheckboxFill
                        form={form}
                        field={field}
                        value={item.name}
                      />
                    </>
                  )}
                </Field>
              );
            })}
          </Wrap>
        </Stack>
      )}
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      {airlines && airlines?.length > 0 && (
        <Stack spacing={"24px"} py={"24px"}>
          <Heading fontSize={{ base: "md", md: "lg" }}>Jenis Pesawat</Heading>
          {/* <Text>{formik.form?.values?.filters?.airlines}</Text> */}
          <Stack>
            <Wrap spacingY={"16px"} spacingX={"6px"}>
              {airlines?.map((item, index) => {
                return (
                  <Field
                    key={index}
                    name="airlines"
                    value={item.code}
                    type="checkbox"
                  >
                    {({ field, form }) => (
                      <>
                        <CustomCheckboxFill
                          form={form}
                          field={field}
                          label={item.name}
                          value={item.code}
                        />
                      </>
                    )}
                  </Field>
                );
              })}
            </Wrap>
          </Stack>
        </Stack>
      )}
    </>
  );
};
export const FormCruiseFilter = ({ ship, duration }) => {
  return (
    <>
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Rentang Harga</Heading>
        <FormPrice />
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Durasi Tour</Heading>
        <Stack spacing={5} py={5}>
          {duration.map((item, index) => {
            return (
              <Field
                key={index}
                name="duration"
                value={item.label}
                type="checkbox"
              >
                {({ field, form }) => (
                  <Radio
                    {...field}
                    flexDirection={"row-reverse"}
                    colorScheme={"brand.blue"}
                    justifyContent={"space-between"}
                    key={index}
                    // onChange={() => form.setF}
                    isChecked={form.values.duration == item.label}
                    value={item.label}
                  >
                    {item.label}
                  </Radio>
                )}
              </Field>
            );
          })}
        </Stack>
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Tipe Cruise</Heading>
        <Wrap spacingY={"16px"} spacingX={"6px"}>
          {["Cruise Only", "Tour and Cruise"].map((item, index) => {
            return (
              <Field key={index} name="type" value={item} type="checkbox">
                {({ field, form }) => (
                  <>
                    <CustomCheckboxFill
                      form={form}
                      field={field}
                      value={item}
                    />
                  </>
                )}
              </Field>
            );
          })}
        </Wrap>
      </Stack>

      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Jenis Cruise</Heading>
        {/* <Text>{formik.form?.values?.filters?.airlines}</Text> */}
        <Stack>
          <Wrap spacingY={"16px"} spacingX={"6px"}>
            {ship &&
              ship.data.map((item, index) => {
                return (
                  <Field
                    key={index}
                    name="ship"
                    value={item.attributes.name}
                    type="checkbox"
                  >
                    {({ field, form }) => (
                      <>
                        <CustomCheckboxFill
                          form={form}
                          field={field}
                          label={item.attributes.name}
                          value={item.attributes.name}
                        />
                      </>
                    )}
                  </Field>
                );
              })}
          </Wrap>
        </Stack>
      </Stack>
    </>
  );
};
export const FormPackageFilter = ({ package_duration }) => {
  // const { formik } = props;
  // const formik = useFormikContext();
  return (
    <>
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Rentang Harga</Heading>
        <FormPrice />
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Durasi Tour</Heading>
        <Stack spacing={5} py={5}>
          {package_duration.map((item, index) => {
            return (
              <Field
                key={index}
                name="package_duration"
                value={item.value}
                type="checkbox"
              >
                {({ field, form }) => (
                  // <>
                  //   <CustomCheckboxFill
                  //     form={form}
                  //     field={field}
                  //     value={item.label}
                  //   />
                  //   {/* <CustomCheckbox field={field} item={item} /> */}
                  // </>
                  <Radio
                    {...field}
                    flexDirection={"row-reverse"}
                    colorScheme={"brand.blue"}
                    justifyContent={"space-between"}
                    key={index}
                    // onChange={() => form.setF}
                    isChecked={form.values.package_duration == item.value}
                    value={item.value}
                  >
                    {item.label}
                  </Radio>
                )}
              </Field>
            );
          })}
        </Stack>
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Tipe Paket</Heading>
        <Wrap spacingY={"16px"} spacingX={"6px"}>
          {[
            {
              id: 1,
              name: "Free & Easy",
            },
            {
              id: 2,
              name: "Pack & Go",
            },
            {
              id: 3,
              name: "Open Trip",
            },
            {
              id: 4,
              name: "Lihat",
            },
          ].map((item, index) => {
            return (
              <Field
                key={index}
                name="package_type"
                value={item.id?.toString()}
                type="checkbox"
              >
                {({ field, form }) => (
                  <>
                    <CustomCheckboxFill
                      form={form}
                      field={field}
                      value={item.name}
                    />
                  </>
                )}
              </Field>
            );
          })}
        </Wrap>
      </Stack>

      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
    </>
  );
};
export const FormHotelFilter = () => {
  // const { formik } = props;
  // const formik = useFormikContext();
  return (
    <>
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Rentang Harga</Heading>
        <FormPrice />
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>
          Filter Tipe Tag Bintang
        </Heading>
        <Wrap spacingY={"16px"} spacingX={"6px"}>
          {[
            {
              value: "5EST",
              label: "5",
            },
            {
              value: "4EST",
              label: "4",
            },
            {
              value: "3EST",
              label: "3",
            },
            {
              value: "2EST",
              label: "2",
            },
            {
              value: "1EST",
              label: "1",
            },
          ].map((item, index) => {
            return (
              <Field
                key={index}
                name="stars"
                value={item.value}
                type="checkbox"
              >
                {({ field, form }) => {
                  field.checked = form.values.stars.includes(item.value);
                  return (
                    <>
                      <CustomCheckboxFill
                        form={form}
                        field={field}
                        label={
                          <Flex alignItems={"center"} gap={"5px"}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_4513_41618)">
                                <path
                                  d="M14.9498 6.0875C14.8872 5.89061 14.7666 5.71723 14.6038 5.59009C14.4409 5.46294 14.2435 5.38797 14.0373 5.375L10.3248 5.11875L8.94978 1.65C8.8747 1.459 8.74401 1.29494 8.57464 1.17905C8.40526 1.06317 8.205 1.00079 7.99978 1C7.79455 1.00079 7.59429 1.06317 7.42492 1.17905C7.25555 1.29494 7.12486 1.459 7.04978 1.65L5.64978 5.1375L1.96228 5.375C1.75634 5.38881 1.55929 5.4641 1.39661 5.59112C1.23393 5.71814 1.11311 5.89106 1.04978 6.0875C0.984741 6.28695 0.980941 6.50131 1.03887 6.70294C1.0968 6.90458 1.21379 7.08423 1.37478 7.21875L4.21228 9.61875L3.36853 12.9375C3.31015 13.162 3.32066 13.3989 3.39868 13.6174C3.4767 13.8358 3.61863 14.0258 3.80603 14.1625C3.98792 14.293 4.20463 14.3664 4.42843 14.373C4.65222 14.3797 4.87292 14.3195 5.06228 14.2L7.99353 12.3438H8.00603L11.1623 14.3375C11.3242 14.4427 11.5129 14.4991 11.706 14.5C11.8637 14.4988 12.019 14.4614 12.1599 14.3908C12.3009 14.3201 12.4237 14.2181 12.5191 14.0926C12.6145 13.967 12.6798 13.8213 12.71 13.6666C12.7403 13.5118 12.7346 13.3522 12.6935 13.2L11.7998 9.56875L14.6248 7.21875C14.7858 7.08423 14.9028 6.90458 14.9607 6.70294C15.0186 6.50131 15.0148 6.28695 14.9498 6.0875Z"
                                  fill="#EB891C"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_4513_41618">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            {item.label}
                          </Flex>
                        }
                        value={item.value}
                      />
                    </>
                  );
                }}
              </Field>
            );
          })}
        </Wrap>
      </Stack>

      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Fasilitas</Heading>
        <SimpleGrid columns={3} spacingY={"16px"} spacingX={"6px"}>
          {[
            {
              value: "swimmingpool",
              label: "Kolam Renang",
            },
            {
              value: "wifi",
              label: "Free Wifi",
            },
            {
              value: "spa",
              label: "Spa",
            },
            {
              value: "parking",
              label: "Secure Parking",
            },
            {
              value: "breakfast",
              label: "Makan Pagi",
            },
            {
              value: "bathub",
              label: "Bathub",
            },
            {
              value: "ac",
              label: "AC",
            },
            {
              value: "shower",
              label: "Shower",
            },
            {
              value: "fridge",
              label: "Kulkas",
            },
            {
              value: "bbq",
              label: "BBQ",
            },
            {
              value: "bathroom",
              label: "Bathroom",
            },
            {
              value: "sofa",
              label: "Sofa",
            },
          ].map((item, index) => {
            const label = item.label;
            const value = item.value;
            return (
              <Field
                key={index}
                name="facilities"
                value={item.value}
                type="checkbox"
              >
                {({ field, form }) => {
                  field.checked = form.values.facilities.includes(item.value);
                  return (
                    <>
                      <Box as="label">
                        <input
                          type={"checkbox"}
                          style={{ display: "none" }}
                          {...field}
                        />
                        <Stack
                          gap={"8px"}
                          justifyItems={"center"}
                          alignItems={"center"}
                          borderWidth={1}
                          borderColor={"brand.blue.100"}
                          bg={field.checked ? "brand.blue.100" : "white"}
                          rounded={"xl"}
                          cursor="pointer"
                          _checked={{
                            bg: "brand.blue.100",
                            color: "white",
                            borderColor: "brand.blue.100",
                          }}
                          // color={field.checked && "white"}
                          p={"12px"}
                        >
                          <Image
                            width={"24px"}
                            height={"24px"}
                            alt={label}
                            src={"/svg/icons/hotel/" + value + ".svg"}
                          />
                          {/* <Icon w={"24px"} h={"24px"} /> */}
                          <HStack fontSize={{ base: "xs", md: "sm" }}>
                            <Text>{label ?? value ?? ""}</Text>
                          </HStack>
                        </Stack>
                      </Box>
                    </>
                  );
                }}
              </Field>
            );
          })}
        </SimpleGrid>
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Lainnya</Heading>
        <Field name="freecancel">
          {({ field, form }) => (
            <Checkbox
              spacing={0}
              {...field}
              alignItems={"start"}
              size={"md"}
              isChecked={form.values.freecancel}
              colorScheme="brand.blue"
              flexDir={"row-reverse"}
              w="full"
            >
              <Box justifyContent="space-between">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="neutral.text.high"
                  fontWeight={"bold"}
                >
                  Gratis Pembatalan
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="neutral.text.medium"
                >
                  Harga dimulai dari IDR 150.000 - 400.000
                </Text>
              </Box>
            </Checkbox>
          )}
        </Field>
        <Field name="reschedule">
          {({ field, form }) => (
            <Checkbox
              spacing={0}
              {...field}
              alignItems={"start"}
              size={"md"}
              isChecked={form.values.reschedule}
              colorScheme="brand.blue"
              w="full"
              flexDir={"row-reverse"}
            >
              <Box justifyContent="space-between">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="neutral.text.high"
                  fontWeight={"bold"}
                >
                  Bisa Reschedule
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="neutral.text.medium"
                >
                  Harga dimulai dari IDR 150.000 - 400.000
                </Text>
              </Box>
            </Checkbox>
          )}
        </Field>
      </Stack>
      {/* <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Jenis Pesawat</Heading>
        <Text>{formik.form?.values?.filters?.airlines}</Text>
        <Stack>
          <Wrap spacingY={"16px"} spacingX={"6px"}>
            {airlines.map((item, index) => {
              return (
                <Field
                  key={index}
                  name="airlines"
                  value={item.code}
                  type="checkbox"
                >
                  {({ field, form }) => (
                    <>
                      <CustomCheckboxFill
                        form={form}
                        field={field}
                        label={item.name}
                        value={item.code}
                      />
                    </>
                  )}
                </Field>
              );
            })}
          </Wrap>
        </Stack>
      </Stack> */}
    </>
  );
};
export const FormAttractionFilter = () => {
  const category = useQuery(
    ["getAttractionsGroupCategories"],
    getAttractionsGroupCategories
  );

  return (
    <>
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Rentang Harga</Heading>
        <FormPrice />
      </Stack>
      <Box as="hr" h={2} mx={"-24px"} bg={"gray.100"} />
      <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>
          Kategori Atraksi dan Hiburan
        </Heading>
        <Accordion allowMultiple mx={"-24px"}>
          {!category.isLoading ? (
            category?.data?.map((item, index) => {
              return (
                <Field key={index} name={"categories"}>
                  {({ field, form }) => (
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton px={0}>
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"md"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            {item.attributes.name}
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel px={0} py={"16px"}>
                        <Stack spacing={5} py={5}>
                          {item.attributes.subCategories.data.map(
                            (category, index) => (
                              <Radio
                                {...field}
                                flexDirection={"row-reverse"}
                                colorScheme={"brand.blue"}
                                justifyContent={"space-between"}
                                key={index}
                                isChecked={
                                  form.values.categories ==
                                  category.attributes.uuid
                                }
                                value={category.attributes.uuid}
                              >
                                {category.attributes.name}
                              </Radio>
                            )
                          )}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                </Field>
              );
            })
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
        </Accordion>
      </Stack>
      {/* <Stack spacing={"24px"} py={"24px"}>
        <Heading fontSize={{ base: "md", md: "lg" }}>Jenis Pesawat</Heading>
        <Text>{formik.form?.values?.filters?.airlines}</Text>
        <Stack>
          <Wrap spacingY={"16px"} spacingX={"6px"}>
            {airlines.map((item, index) => {
              return (
                <Field
                  key={index}
                  name="airlines"
                  value={item.code}
                  type="checkbox"
                >
                  {({ field, form }) => (
                    <>
                      <CustomCheckboxFill
                        form={form}
                        field={field}
                        label={item.name}
                        value={item.code}
                      />
                    </>
                  )}
                </Field>
              );
            })}
          </Wrap>
        </Stack>
      </Stack> */}
    </>
  );
};

export const EmailForm = () => {
  return (
    <Field name={"email"}>
      {({ field, form }) => (
        <>
          <InputGroup maxW={"400px"} mx={"auto"}>
            <InputLeftElement pointerEvents="none">
              <MailIcon />
            </InputLeftElement>
            <Input
              isRequired
              isInvalid={form.errors.email && form.touched.email}
              disabled={form.isSubmitting}
              py={"15px"}
              bg={"white"}
              {...field}
              colorScheme={"brand.blue"}
              type="email"
              placeholder="Masukkan alamat e-mail"
            />
            <InputRightElement pr={"36px"}>
              <Button
                colorScheme={"brand.blue"}
                size={"sm"}
                type="submit"
                isLoading={form.isSubmitting}
                variant={"unstyled"}
              >
                Kirim
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage color={"white"}>
            {form.errors.email}
          </FormErrorMessage>
        </>
      )}
    </Field>
  );
};

export const FormFlightSearch = ({
  handleSubmit,
  exhibitions,
  fields,
  classes,
  isMultiTrip,
  initialForm,
  cta,
  responsive = false,
  isPrebooking = false,
  history,
  ...rest
}) => {

  const indexOf = require("lodash/indexOf");
  if (history?.length > 0) {
    initialForm = {
      ...initialForm,
      departure: {
        city: history[0].flights[0].departure.city,
        code: history[0].flights[0].departure.code,
        name: history[0].flights[0].departure.name,
      },
      destination: {
        city: history[0].flights[0].destination.city,
        code: history[0].flights[0].destination.code,
        name: history[0].flights[0].destination.name,
      },
    };
  } else {
    initialForm = {
      ...initialForm,
      departure: {
        city: "Jakarta",
        code: "CGK",
        name: "Soekarno Hatta",
      },
      destination: {
        city: "Surabaya",
        code: "SUB",
        name: "Juanda Airport",
      },
    };
  }
  
  const AirportForm = ({ name, type, indexFlight }) => {
    const form = useFormikContext();
    const [search, setSearch] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const airports = useQuery(["getAirports", search], async () => {
      let result;
      !search
        ? (result = await getRecommendedAirports())
        : (result = await getAirports(search));
      return Promise.resolve(result);
    });

    const handleSearch = (search) => {
      setSearch(search);
      setTimeout(() => {}, 1000);
    };

    const InnerButton = (
      <HStack justify={"space-between"} w={"full"} alignItems={"center"}>
        <HStack>
          <Image
            src={`/svg/flights/${type}.svg`}
            alt="Flights"
            width={24}
            height={24}
          />
          <Text
            color={
              !form.values.flights[indexFlight][type].city && "neutral.text.low"
            }
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {form.values.flights[indexFlight][type].city ||
              "Pilih Keberangkatan"}
          </Text>
        </HStack>
        <Text
          color={"neutral.text.low"}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {form.values.flights[indexFlight][type].name}{" "}
          {form.values.flights[indexFlight][type].code &&
            `(${form.values.flights[indexFlight][type].code})`}
        </Text>
      </HStack>
    );

    return (
      <CustomDropdown
        responsive
        title={`Pilih ${type === "departure" ? "Asal" : "Tujuan"}`}
        innerbutton={InnerButton}
        notrounded
        cusDisclosure={{ isOpen, onOpen, onClose }}
      >
        <InputGroup mb={"16px"}>
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari"
            variant="filled"
          />
          <InputRightElement pointerEvents="none">
            <Image
              src="/svg/header-search.svg"
              alt="search"
              width={16}
              height={16}
            />
          </InputRightElement>
        </InputGroup>
        <Box mx={"-24px"} px={"24px"} py={"12px"} bg={"brand.blue.100"}>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight={"semibold"}
            color={"brand.blue.500"}
          >
            {search ? "Hasil pencarian " + search : "Rekomendasi"}
          </Text>
        </Box>
        <Stack py={5} mx={"-24px"}>
          {!airports.isLoading ? (
            airports.data.map((item, index) => (
              <Flex
                py={"6px"}
                px={"24px"}
                justifyContent={"space-between"}
                alignItems={"center"}
                key={index}
                cursor="pointer"
                onClick={() => {
                  form.setFieldValue(
                    name[type],
                    {
                      city: item.attributes.cityName,
                      name: item.attributes.name,
                      code: item.attributes.code,
                    },
                    false
                  );
                  onClose();
                }}
                bg={
                  form.values.flights[indexFlight][type].city ===
                  item.attributes.cityName
                    ? "brand.blue.100"
                    : "transparent"
                }
                _hover={{ bg: "brand.blue.100" }}
              >
                <VStack alignItems={"start"}>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight={"semibold"}
                  >
                    {item.attributes.cityName}
                  </Text>
                  <Text color={"neutral.text.low"}>{item.attributes.name}</Text>
                </VStack>
                <Box
                  bg={"brand.blue.100"}
                  p={"6px"}
                  borderRadius={"2px"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {item.attributes.code}
                </Box>
              </Flex>
            ))
          ) : (
            <Spinner />
          )}
        </Stack>
      </CustomDropdown>
    );
  };

  const DateForm = ({ name, type, isMultiTrip, indexFlight }) => {
    const form = useFormikContext();
    const switchRef = useRef();
    const InnerButton = (
      <Flex justify={"space-between"} w={"full"} alignItems={"center"}>
        <HStack w="full">
          <Image
            src="/svg/flights/date.svg"
            alt="Date"
            width={24}
            height={24}
          />
          <Text
            color={
              !form.values.flights[indexFlight][type] && "neutral.text.low"
            }
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {typeof form.values.flights[indexFlight][type] === "object"
              ? date(
                  new Date(form.values.flights[indexFlight][type]),
                  "iii, d LLL yy"
                )
              : form.values.flights[indexFlight][type] ||
                `Pilih Tanggal ${
                  type === "departure_date" ? "Pergi" : "Pulang"
                }`}
          </Text>
        </HStack>
        {!isMultiTrip && type === "departure_date" && (
          <HStack onClick={(e) => e.stopPropagation()}>
            <Text fontSize={{ base: "xs", md: "sm" }}>Pergi Pulang?</Text>
            <Switch
              ref={switchRef}
              zIndex={2}
              colorScheme={"brand.blue"}
              name={name.is_round_trip}
              onChange={(e) =>
                form.setFieldValue(name.is_round_trip, e.target.checked, false)
              }
              isChecked={form.values.flights[indexFlight].is_round_trip}
            />
          </HStack>
        )}
      </Flex>
    );
    return (
      <CustomDropdown
        title={`Pilih Tanggal ${
          type === "departure_date" ? "Pergi" : "Pulang"
        }`}
        innerbutton={InnerButton}
        ignoreRef={switchRef}
      >
        <CustomCalendar
          value={form.values.flights[indexFlight][type]}
          tileDisabled={({ date }) => {
            if (type === "return_date") {
              return date < form.values.flights[indexFlight].departure_date;
            }
            return date < new Date().setDate(new Date().getDate() - 1);
          }}
          minDate={
            type === "return_date"
              ? form.values.flights[indexFlight].departure_date
              : new Date()
          }
          onChange={(date) => {
            if (type === "departure_date") {
              form.setFieldValue(name.departure_date, date, false);
              if (date > form.values.flights[indexFlight].return_date) {
                form.setFieldValue(
                  name.return_date,
                  form.initialValues.flights[indexFlight].return_date,
                  false
                );
              }
            } else {
              form.setFieldValue(name.return_date, date, false);
            }
          }}
        />
      </CustomDropdown>
    );
  };

  const ClassForm = ({ items, name, indexFlight }) => {
    const form = useFormikContext();

    return (
      <>
        <CustomDropdown
          responsive
          title={"Kelas Penerbangan"}
          placeholder={"Pilih kelas"}
          value={
            items.find(
              (item) => item.value === form.values.flights[indexFlight].class
            )?.label ?? ""
          }
        >
          <RadioGroup
            onChange={(next) => form.setFieldValue(name.class, next, true)}
            value={form.values.flights[indexFlight].class}
          >
            <Stack spacing={5} py={5}>
              {items?.map((item, index) => (
                <Radio
                  flexDirection={"row-reverse"}
                  colorScheme={"brand.blue"}
                  justifyContent={"space-between"}
                  key={index}
                  isChecked={
                    form.values.flights[indexFlight].class == item.value
                  }
                  value={item.value}
                >
                  {item.label}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </CustomDropdown>
      </>
    );
  };
  const ExhibitForm = ({ items, field }) => {
    const form = useFormikContext();
    return (
      <>
        <CustomDropdown
          responsive
          title={"Pameran"}
          placeholder={"Pilih pameran"}
          value={
            items.find((item) => item.value === form.values.exhibition)
              ?.label ?? ""
          }
        >
          <RadioGroup
            {...field}
            onChange={(next) => form.setFieldValue(field.name, next, true)}
            value={form.values.exhibition}
          >
            <Stack spacing={5} py={5}>
              {items?.map((item, index) => (
                <Radio
                  flexDirection={"row-reverse"}
                  colorScheme={"brand.blue"}
                  justifyContent={"space-between"}
                  key={index}
                  isChecked={form.values.exhibition == item.value}
                  value={item.value}
                >
                  <Box>
                    <Text>{item.label}</Text>
                    <Text fontSize={"sm"} color="neutral.text.low">
                      {item.description}
                    </Text>
                  </Box>
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </CustomDropdown>
      </>
    );
  };

  const PersonForm = ({ name, indexFlight, type, fields }) => {
    const form = useFormikContext();
    const InnerButton = (
      <Flex justify={"space-between"} w={"full"} alignItems={"center"}>
        <Image
          alt="Person"
          width={24}
          height={24}
          src={"/svg/flights/person.svg"}
        />
        <Text>{form.values.flights[indexFlight][type.name]}</Text>
      </Flex>
    );
    const { adult, child, infant } = form.values.flights[indexFlight];
    const adultChildCount = adult + child;

    return (
      <>
        <CustomDropdown title="Jumlah Penumpang" innerbutton={InnerButton}>
          <Stack spacing={5} py={5}>
            {fields.map((item, index) => {
              const curr = form.values.flights[indexFlight][item.name];
              return (
                <Flex
                  key={index}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Box>
                    <Text>{item.label}</Text>
                    <Text fontSize={"sm"} color="neutral.text.low">
                      {item.description}
                    </Text>
                  </Box>
                  <HStack spacing={5}>
                    <Button
                      isDisabled={curr === 0}
                      variant={"solid"}
                      colorScheme={"brand.blue"}
                      onClick={() =>
                        curr > 0 &&
                        form.setFieldValue(name[item.name], curr - 1, false)
                      }
                    >
                      -
                    </Button>
                    <Text>{curr}</Text>
                    <Button
                      isDisabled={
                        item.name === "adult"
                          ? adultChildCount >= 7
                          : item.name === "child"
                          ? child >= adult || adultChildCount >= 7
                          : curr >= 4 || infant >= adult
                      }
                      variant={"solid"}
                      colorScheme={"brand.blue"}
                      onClick={() =>
                        form.setFieldValue(name[item.name], curr + 1, false)
                      }
                    >
                      +
                    </Button>
                  </HStack>
                </Flex>
              );
            })}
          </Stack>
        </CustomDropdown>
      </>
    );
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        exhibition: Yup.string().when([], {
          is: () => isPrebooking === true,
          then: Yup.string().required("Pameran harap diisi"),
          otherwise: Yup.string().notRequired(),
        }),
        flight: Yup.array(),
      })}
      initialValues={{
        flights: [initialForm],
        ...(isPrebooking ? { exhibition: "" } : {}),
      }}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, errors, touched }) => (
        <Form>
          <FieldArray name="flights">
            {({ push, remove }) => {
              return values.flights.map((flight, index) => {
                const name = {
                  departure: `flights[${index}]departure`,
                  destination: `flights[${index}]destination`,
                  departure_date: `flights[${index}]departure_date`,
                  return_date: `flights[${index}]return_date`,
                  class: `flights[${index}]class`,
                  adult: `flights[${index}]adult`,
                  child: `flights[${index}]child`,
                  infant: `flights[${index}]infant`,
                  is_round_trip: `flights[${index}]is_round_trip`,
                };
                return (
                  (isMultiTrip ? true : !index > 0) && (
                    <Box
                      key={index}
                      as={"section"}
                      py={"24px"}
                      borderTop={index > 0 ? "1px" : "0px"}
                      borderTopStyle={"dashed"}
                      borderTopColor={"gray.300"}
                    >
                      <Box
                        maxW={{ lg: "container.lg", xl: "container.xl" }}
                        mx={"auto"}
                      >
                        {isMultiTrip && (
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"end"}
                          >
                            <Text
                              color={"brand.blue.400"}
                              fontWeight={"semibold"}
                            >
                              Penerbangan {index + 1}
                            </Text>
                            <Text
                              color={"red.400"}
                              cursor={"pointer"}
                              fontSize={{ base: "sm", md: "md" }}
                              hidden={index === 0}
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              Hapus
                            </Text>
                          </Flex>
                        )}
                        <SimpleGrid
                          columns={{ base: 1, md: responsive ? 1 : 3 }}
                          spacing={"16px"}
                        >
                          {fields.map((field, indexf) =>
                            Array.isArray(field) ? (
                              <HStack key={indexf} gap={"12px"}>
                                {field.map((f, i) => (
                                  <FormControl key={i}>
                                    <FormLabel
                                      fontSize={{ base: "sm", md: "md" }}
                                      color={"neutral.text.medium"}
                                    >
                                      {f.label}
                                    </FormLabel>
                                    <PersonForm
                                      name={name}
                                      type={f}
                                      fields={field}
                                      indexFlight={index}
                                    />
                                  </FormControl>
                                ))}
                              </HStack>
                            ) : (
                              <FormControl
                                key={indexOf}
                                hidden={
                                  field.name === "return_date" &&
                                  (isMultiTrip
                                    ? true
                                    : !values.flights[index].is_round_trip)
                                }
                              >
                                <FormLabel
                                  fontSize={{ base: "sm", md: "md" }}
                                  color={"neutral.text.medium"}
                                >
                                  {field.label}
                                </FormLabel>
                                {(field.name === "departure" ||
                                  field.name === "destination") && (
                                  <AirportForm
                                    name={name}
                                    type={field.name}
                                    indexFlight={index}
                                  />
                                )}
                                {(field.name === "departure_date" ||
                                  field.name === "return_date") && (
                                  <DateForm
                                    name={name}
                                    type={field.name}
                                    isMultiTrip={isMultiTrip}
                                    indexFlight={index}
                                  />
                                )}
                                {field.name === "class" && (
                                  <ClassForm
                                    items={classes}
                                    name={name}
                                    indexFlight={index}
                                  />
                                )}
                              </FormControl>
                            )
                          )}
                        </SimpleGrid>
                        {!isPrebooking &&
                          (!isMultiTrip ||
                            index === values.flights.length - 1) && (
                            <Box pt={"24px"}>
                              <CustomOrangeFullWidthButton
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                type="submit"
                              >
                                {cta ?? "Cari Tiket"}
                              </CustomOrangeFullWidthButton>
                              <CustomOrangeFullWidthButton
                                hidden={!isMultiTrip}
                                isoutlined
                                onClick={() => push(initialForm)}
                              >
                                Tambah Penerbangan
                              </CustomOrangeFullWidthButton>
                            </Box>
                          )}
                      </Box>
                    </Box>
                  )
                );
              });
            }}
          </FieldArray>
          {isPrebooking ? (
            <Box
              as={"section"}
              pb={"24px"}
              borderTopStyle={"dashed"}
              borderTopColor={"gray.300"}
            >
              <Box
                maxW={{ lg: "container.lg", xl: "container.xl" }}
                mx={"auto"}
              >
                <Field name="exhibition">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={errors[field.name] && touched[fields.name]}
                      name={field.name}
                    >
                      <FormLabel
                        fontSize={{ base: "sm", md: "md" }}
                        color={"neutral.text.medium"}
                      >
                        Pameran
                      </FormLabel>
                      <ExhibitForm field={field} items={exhibitions} />
                      <FormErrorMessage>{errors[field.name]}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <CustomOrangeFullWidthButton
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Prebook
                </CustomOrangeFullWidthButton>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Form>
      )}
    </Formik>
  );
};
export const TourDetailOrder = (props) => {
  const { handleSubmit, innerRef } = props;
  const departure_date = props.departures;
  const handleSelect = props.handleSelect;
  const router = useRouter();
  const { id } = router.query;
  const price = props.price;
  const [adult, setAdult] = useState(props.initialValues.participants.adults);
  const [child, setChild] = useState(props.initialValues.participants.children);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    setIsLoading(true);
    const fetchPrice = (adult, child) => {
      let total;
      if (adult == 1 && child < 1) {
        total = adult * price?.adultSingle?.price;
      } else {
        total =
          adult * price?.adultTwinSharing?.price +
          child * price?.childTwinSharing?.price;
      }
      setTotalPrice(total);
      setIsLoading(false);
    };
    fetchPrice(adult, child);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adult, child]);

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={() =>
        Yup.object().shape({
          departure_date: Yup.string().required(
            "Tanggal keberangkatan harap diisi"
          ),
          participants: Yup.object({
            adults: Yup.number()
              .min(1, "Peserta dewasa harus diisi")
              .required("Peserta dewasa harus diisi"),
            children: Yup.number().notRequired(),
          }),
        })
      }
      // validationSchema={() =>
      //   Yup.object().shape({
      //     area: Yup.string().required("Wilayah harap diisi"),
      //   })
      // }
      initialValues={props.initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <Stack spacing={0}>
          <Stack direction={"row"}>
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              position={"relative"}
            >
              <Circle size={2} bg={"brand.blue.400"} />
              <Divider
                my={1}
                orientation="vertical"
                variant={"dashed"}
                borderColor={"brand.blue.400"}
              />
            </Flex>
            <Stack flexGrow={1} pb={"18px"}>
              <Field name="departure_date">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors?.departure_date && form.touched.departure_date
                    }
                  >
                    <FormLabel
                      color={"brand.blue.400"}
                      as={Heading}
                      fontWeight={"bold"}
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      Pilih Tanggal Tour
                    </FormLabel>
                    <FormHelperText color="neutral.text.low" mb={"5px"}>
                      {`Tersedia ${departure_date.length} Keberangkatan`}
                    </FormHelperText>
                    <FormErrorMessage>
                      {form.errors?.departure_date}
                    </FormErrorMessage>
                    {/* <ErrorMessage name="participants.adults" /> */}
                    <CustomDropdown
                      title={"Pilih Keberangkatan"}
                      value={form.values.departure_date}
                      bg={"white"}
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Date"
                            width={24}
                            height={24}
                            src={"/svg/flights/date-alt.svg"}
                          />
                          <HStack spacing={"5px"}>
                            <DropIcon />
                            <Text fontWeight={"bold"} color={"brand.blue.400"}>
                              {/* {form.values.departure_date} */}
                              {departure_date.map((item) => {
                                if (
                                  form.values.departure_date ==
                                  item.id?.toString()
                                ) {
                                  return `${convertDateWithMonthName(
                                    item.date
                                  )} - ${addDaysWithMonthName(
                                    item.date,
                                    item.duration - 1
                                  )}`;
                                }
                              })}
                            </Text>
                          </HStack>
                        </Flex>
                      }
                    >
                      <Stack spacing={"24px"}>
                        {departure_date.map((item) => {
                          form.values.departure_date == item.id &&
                            handleSelect(form.values.departure_date);
                          return (
                            <Radio
                              flexDirection={"row-reverse"}
                              colorScheme={"brand.blue"}
                              justifyContent={"space-between"}
                              {...field}
                              key={item.id}
                              isChecked={form.values.departure_date == item.id}
                              value={item.id}
                            >
                              {`${convertDateWithMonthName(
                                item.date
                              )} - ${addDaysWithMonthName(
                                item.date,
                                item.duration - 1
                              )}`}
                            </Radio>
                          );
                        })}
                      </Stack>
                    </CustomDropdown>
                  </FormControl>
                )}
              </Field>
            </Stack>
          </Stack>
          <Stack direction={"row"}>
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              position={"relative"}
            >
              <Circle size={2} bg={"brand.blue.400"} />
              {/* <Divider
                my={1}
                orientation="vertical"
                variant={"dashed"}
                borderColor={"brand.blue.400"}
              /> */}
            </Flex>
            <Stack flexGrow={1} pb={"18px"}>
              <Text
                color={"brand.blue.400"}
                as={Heading}
                fontWeight={"bold"}
                fontSize={{ base: "md", md: "lg" }}
              >
                Jumlah Peserta
              </Text>
              <Stack direction={"row"} spacing={"18px"}>
                <Field name={"participants.adults"}>
                  {({ form }) => (
                    <FormControl
                      isInvalid={
                        form.errors?.participants?.adults &&
                        form.touched.participants?.adults
                      }
                    >
                      <FormLabel color={"neutral.text.low"}>Dewasa</FormLabel>
                      <CustomDropdown
                        bg={"white"}
                        footer={"Pilih"}
                        title="Jumlah Penumpang"
                        innerbutton={
                          <Flex
                            direction={"row-reverse"}
                            justify={"space-between"}
                            w={"full"}
                            alignItems={"center"}
                          >
                            <Image
                              alt="Person"
                              width={24}
                              height={24}
                              src={"/svg/flights/person-alt.svg"}
                            />
                            <Text>{form.values.participants.adults}</Text>
                          </Flex>
                        }
                      >
                        <Stack spacing={5} py={5}>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutraltext.high"
                            >
                              {"Dewasa"}
                            </Text>
                            <HStack spacing={5}>
                              <Button
                                disabled={form.values.participants.adults === 0}
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  if (form.values.participants.adults > 0) {
                                    form.setFieldValue(
                                      "participants.adults",
                                      form.values.participants.adults - 1,
                                      false
                                    );
                                    setAdult(
                                      form.values.participants.adults - 1
                                    );
                                  }
                                }}
                              >
                                -
                              </Button>
                              <Text>{form.values.participants.adults}</Text>
                              <Button
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.participants.adults + 1,
                                    false
                                  );
                                  setAdult(form.values.participants.adults + 1);
                                }}
                              >
                                +
                              </Button>
                            </HStack>
                          </Flex>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Box>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="neutral.text.high"
                              >
                                {"Anak"}
                              </Text>
                              <chakra.span fontSize={"sm"}>
                                (4-12 tahun)
                              </chakra.span>
                            </Box>
                            <HStack spacing={5}>
                              <Button
                                disabled={
                                  form.values.participants.children === 0
                                }
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  if (form.values.participants.children > 0) {
                                    form.setFieldValue(
                                      "participants.children",
                                      form.values.participants.children - 1,
                                      false
                                    );
                                    setChild(
                                      form.values.participants.children - 1
                                    );
                                  }
                                }}
                              >
                                -
                              </Button>
                              <Text>{form.values.participants.children}</Text>
                              <Button
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  form.setFieldValue(
                                    "participants.children",
                                    form.values.participants.children + 1,
                                    false
                                  );
                                  setChild(
                                    form.values.participants.children + 1
                                  );
                                }}
                              >
                                +
                              </Button>
                            </HStack>
                          </Flex>
                        </Stack>
                      </CustomDropdown>
                      <FormErrorMessage>
                        {form.errors?.participants?.adults}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name={"participants.children"}>
                  {({ form }) => (
                    <FormControl>
                      <FormLabel color={"neutral.text.low"}>
                        Anak-anak
                      </FormLabel>
                      <CustomDropdown
                        bg={"white"}
                        footer={"Pilih"}
                        title="Jumlah Penumpang"
                        innerbutton={
                          <Flex
                            direction={"row-reverse"}
                            justify={"space-between"}
                            w={"full"}
                            alignItems={"center"}
                          >
                            <Image
                              alt="Person"
                              width={24}
                              height={24}
                              src={"/svg/flights/person-alt.svg"}
                            />
                            <Text>{form.values.participants.children}</Text>
                          </Flex>
                        }
                      >
                        <Stack spacing={5} py={5}>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutraltext.high"
                            >
                              {"Dewasa"}
                            </Text>
                            <HStack spacing={5}>
                              <Button
                                disabled={form.values.participants.adults === 0}
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  if (form.values.participants.adults > 0) {
                                    form.setFieldValue(
                                      "participants.adults",
                                      form.values.participants.adults - 1,
                                      false
                                    );
                                    setAdult(
                                      form.values.participants.adults - 1
                                    );
                                  }
                                }}
                              >
                                -
                              </Button>
                              <Text>{form.values.participants.adults}</Text>
                              <Button
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.participants.adults + 1,
                                    false
                                  );
                                  setAdult(form.values.participants.adults + 1);
                                }}
                              >
                                +
                              </Button>
                            </HStack>
                          </Flex>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Box>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="neutral.text.high"
                              >
                                {"Anak"}
                              </Text>
                              <chakra.span fontSize={"sm"}>
                                (4-12 tahun)
                              </chakra.span>
                            </Box>
                            <HStack spacing={5}>
                              <Button
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  if (form.values.participants.children > 0) {
                                    form.setFieldValue(
                                      "participants.children",
                                      form.values.participants.children - 1,
                                      false
                                    );
                                    setChild(
                                      form.values.participants.children - 1
                                    );
                                  }
                                }}
                              >
                                -
                              </Button>
                              <Text>{form.values.participants.children}</Text>
                              <Button
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  form.setFieldValue(
                                    "participants.children",
                                    form.values.participants.children + 1,
                                    false
                                  );
                                  setChild(
                                    form.values.participants.children + 1
                                  );
                                }}
                              >
                                +
                              </Button>
                            </HStack>
                          </Flex>
                        </Stack>
                      </CustomDropdown>
                    </FormControl>
                  )}
                </Field>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Form>
    </Formik>
  );
};
export const CruiseDetailOrder = ({ departures }) => {
  const router = useRouter();

  const CabinForm = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const form = useFormikContext();
    const cabinList = useQuery(["cabin-list", form.values.departures], () => {
      const cabin = departures.map((item) => {
        if (item.date === form.values.departures) return { ...item };
      });
      const prices =
        cabin.length !== 0
          ? cabin[0].prices.map((item) => {
              return { ...item, quantity: 0 };
            })
          : [];
      form.setFieldValue(`cabin`, prices, false);
      return prices;
    });
    return (
      <Field name={`cabin`}>
        {({ form }) => (
          <FormControl isInvalid={form.errors?.cabin && form.touched.cabin}>
            <FormHelperText color="neutral.text.low" mb={"5px"}>
              {`Tersedia ${
                cabinList.data ? cabinList.data?.length : 0
              } jenis kabin`}
            </FormHelperText>
            <CustomDropdown
              cusDisclosure={{ isOpen, onOpen, onClose }}
              bg={"white"}
              footer={"Pilih"}
              title="Tipe Kabin"
              innerbutton={
                <Flex
                  direction={"row"}
                  justify={"space-between"}
                  w={"full"}
                  alignItems={"center"}
                >
                  <Text>
                    {form.values.cabin.filter((item) => item.quantity !== 0)
                      .length !== 0
                      ? form.values.cabin
                          .filter((item) => item.quantity !== 0)
                          .map((item) => {
                            return `${item.name}: ${item.quantity}`;
                          })
                          .join(", ")
                      : "Pilih Kabin"}
                  </Text>
                  <ChevronFilledDown />
                </Flex>
              }
            >
              <Stack spacing={5} py={5}>
                {cabinList.data &&
                  cabinList.data?.map((item, i) => (
                    <>
                      <Flex
                        key={i}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Stack>
                          <Text>{item.name}</Text>
                          <Text fontSize={"sm"} color="neutral.text.low">
                            (Max{" "}
                            {item.capacity === "two"
                              ? 2
                              : item.capacity === "four"
                              ? 4
                              : 0}{" "}
                            tamu)
                          </Text>
                        </Stack>
                        <HStack spacing={5}>
                          <Button
                            disabled={
                              form.values.cabin[i] &&
                              form.values.cabin[i].quantity === 0
                            }
                            variant={"solid"}
                            colorScheme={"brand.blue"}
                            onClick={() => {
                              if (
                                form.values.cabin[i] &&
                                form.values.cabin[i].quantity > 0
                              ) {
                                form.setFieldValue(
                                  `cabin[${i}].quantity`,
                                  form.values.cabin[i] &&
                                    form.values.cabin[i].quantity - 1,
                                  false
                                );
                              }
                            }}
                          >
                            -
                          </Button>
                          <Text>
                            {form.values.cabin[i] &&
                              form.values.cabin[i].quantity}
                          </Text>
                          <Button
                            disabled={
                              item.capacity === "two"
                                ? form.values.cabin[i].quantity === 2
                                : item.capacity === "four"
                                ? form.values.cabin[i].quantity === 4
                                : 0
                            }
                            variant={"solid"}
                            colorScheme={"brand.blue"}
                            onClick={() => {
                              form.setFieldValue(
                                `cabin[${i}].quantity`,
                                form.values.cabin[i] &&
                                  form.values.cabin[i].quantity + 1,
                                false
                              );
                            }}
                          >
                            +
                          </Button>
                        </HStack>
                      </Flex>
                    </>
                  ))}
              </Stack>
            </CustomDropdown>
            <FormErrorMessage>{form.errors?.cabin}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    );
  };
  return (
    <Form>
      <Stack spacing={0}>
        <Stack direction={"row"}>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            position={"relative"}
          >
            <Circle size={2} bg={"brand.blue.400"} />
            <Divider
              my={1}
              orientation="vertical"
              variant={"dashed"}
              borderColor={"brand.blue.400"}
            />
          </Flex>
          <Stack flexGrow={1} pb={"18px"}>
            <Field name="departures">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors?.departures && form.touched.departures}
                >
                  <FormLabel
                    color={"brand.blue.400"}
                    as={Heading}
                    fontWeight={"bold"}
                    fontSize={{ base: "md", md: "lg" }}
                  >
                    Pilih Tanggal Keberangkatan
                  </FormLabel>
                  <FormHelperText color="neutral.text.low" mb={"5px"}>
                    {`Tersedia ${departures.length} Keberangkatan`}
                  </FormHelperText>
                  <FormErrorMessage>{form.errors?.departures}</FormErrorMessage>
                  {/* <ErrorMessage name="participants.adults" /> */}
                  <CustomDropdown
                    title={"Pilih Keberangkatan"}
                    value={form.values.departures}
                    bg={"white"}
                    innerbutton={
                      <Flex
                        direction={"row-reverse"}
                        justify={"space-between"}
                        w={"full"}
                        alignItems={"center"}
                      >
                        <Image
                          alt="Date"
                          width={24}
                          height={24}
                          src={"/svg/flights/date-alt.svg"}
                        />
                        <HStack spacing={"5px"}>
                          <DropIcon />
                          <Text fontWeight={"bold"} color={"brand.blue.400"}>
                            {form.values.departures.length !== 0
                              ? `${date(
                                  new Date(form.values.departures),
                                  "dd MMM yyyy"
                                )} - ${date(
                                  addDays(
                                    new Date(form.values.departures),
                                    departures
                                      .filter((item) => {
                                        return (
                                          item.date === form.values.departures
                                        );
                                      })
                                      .reduce((prev, item) => {
                                        return (prev = item);
                                      }).duration - 1
                                  ),
                                  "dd MMM yyyy"
                                )}`
                              : "Pilih Keberangkatan"}
                            {/* {departures.map((item) => {
                                if (
                                  form.values.departures == item.id?.toString()
                                ) {
                                  return `${convertDateWithMonthName(
                                    item.date
                                  )} - ${addDaysWithMonthName(
                                    item.date,
                                    item.duration
                                  )}`;
                                }
                              })} */}
                          </Text>
                        </HStack>
                      </Flex>
                    }
                  >
                    <Stack spacing={"24px"}>
                      {departures.map((item) => {
                        // form.values.departures == item.id &&
                        //   handleSelect(form.values.departures);
                        return (
                          <Radio
                            flexDirection={"row-reverse"}
                            colorScheme={"brand.blue"}
                            justifyContent={"space-between"}
                            {...field}
                            key={item.id}
                            isChecked={form.values.departures == item.date}
                            value={item.date}
                          >
                            {`${convertDateWithMonthName(
                              item.date
                            )} - ${addDaysWithMonthName(
                              item.date,
                              item.duration - 1
                            )}`}
                          </Radio>
                        );
                      })}
                    </Stack>
                  </CustomDropdown>
                </FormControl>
              )}
            </Field>
          </Stack>
        </Stack>
        <Stack direction={"row"}>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            position={"relative"}
          >
            <Circle size={2} bg={"brand.blue.400"} />
            <Divider
              my={1}
              orientation="vertical"
              variant={"dashed"}
              borderColor={"brand.blue.400"}
            />
          </Flex>
          <Stack flexGrow={1} pb={"18px"}>
            <Text
              color={"brand.blue.400"}
              as={Heading}
              fontWeight={"bold"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Jumlah Peserta
            </Text>
            <Stack direction={"row"} spacing={"18px"}>
              <Field name={"participants.adults"}>
                {({ form }) => (
                  <FormControl
                    isInvalid={
                      form.errors?.participants?.adults &&
                      form.touched.participants?.adults
                    }
                  >
                    <FormLabel color={"neutral.text.low"}>Dewasa</FormLabel>
                    <CustomDropdown
                      bg={"white"}
                      footer={"Pilih"}
                      title="Jumlah Penumpang"
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Person"
                            width={24}
                            height={24}
                            src={"/svg/flights/person-alt.svg"}
                          />
                          <Text>{form.values.participants.adults}</Text>
                        </Flex>
                      }
                    >
                      <Stack spacing={5} py={5}>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="neutraltext.high"
                          >
                            {"Dewasa"}
                          </Text>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.adults === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.adults > 0) {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.participants.adults - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.adults}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.adults",
                                  form.values.participants.adults + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Anak"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              (4-12 tahun)
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.children === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.children > 0) {
                                  form.setFieldValue(
                                    "participants.children",
                                    form.values.participants.children - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.children}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.children",
                                  form.values.participants.children + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    </CustomDropdown>
                    <FormErrorMessage>
                      {form.errors?.participants?.adults}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"participants.children"}>
                {({ form }) => (
                  <FormControl>
                    <FormLabel color={"neutral.text.low"}>Anak-anak</FormLabel>
                    <CustomDropdown
                      bg={"white"}
                      footer={"Pilih"}
                      title="Jumlah Penumpang"
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Person"
                            width={24}
                            height={24}
                            src={"/svg/flights/person-alt.svg"}
                          />
                          <Text>{form.values.participants.children}</Text>
                        </Flex>
                      }
                    >
                      <Stack spacing={5} py={5}>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="neutraltext.high"
                          >
                            {"Dewasa"}
                          </Text>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.adults === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.adults > 0) {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.participants.adults - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.adults}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.adults",
                                  form.values.participants.adults + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Anak"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              (4-12 tahun)
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.children === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.children > 0) {
                                  form.setFieldValue(
                                    "participants.children",
                                    form.values.participants.children - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.children}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.children",
                                  form.values.participants.children + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    </CustomDropdown>
                  </FormControl>
                )}
              </Field>
            </Stack>
          </Stack>
        </Stack>
        {/* <Stack direction={"row"}>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            position={"relative"}
          >
            <Circle size={2} bg={"brand.blue.400"} />
          </Flex>
          <Stack flexGrow={1} pb={"18px"}>
            <Text
              color={"brand.blue.400"}
              as={Heading}
              fontWeight={"bold"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Pilih kabin
            </Text>
            <Stack direction={"row"} spacing={"18px"}>
              <CabinForm />
            </Stack>
          </Stack>
        </Stack> */}
      </Stack>
    </Form>
  );
};
export const PackageDetailOrder = ({ departures }) => {
  const router = useRouter();

  return (
    <Form>
      <Stack spacing={0}>
        <Stack direction={"row"}>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            position={"relative"}
          >
            <Circle size={2} bg={"brand.blue.400"} />
            <Divider
              my={1}
              orientation="vertical"
              variant={"dashed"}
              borderColor={"brand.blue.400"}
            />
          </Flex>
          <Stack flexGrow={1} pb={"18px"}>
            <Field name="departures">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors?.departures && form.touched.departures}
                >
                  <FormLabel
                    color={"brand.blue.400"}
                    as={Heading}
                    fontWeight={"bold"}
                    fontSize={{ base: "md", md: "lg" }}
                  >
                    Pilih Tanggal Keberangkatan
                  </FormLabel>
                  <FormHelperText color="neutral.text.low" mb={"5px"}>
                    {`Tersedia ${departures.length} Keberangkatan`}
                  </FormHelperText>
                  <FormErrorMessage>{form.errors?.departures}</FormErrorMessage>
                  {/* <ErrorMessage name="participants.adults" /> */}
                  <CustomDropdown
                    title={"Pilih Keberangkatan"}
                    value={form.values.departures}
                    bg={"white"}
                    innerbutton={
                      <Flex
                        direction={"row-reverse"}
                        justify={"space-between"}
                        w={"full"}
                        alignItems={"center"}
                      >
                        <Image
                          alt="Date"
                          width={24}
                          height={24}
                          src={"/svg/flights/date-alt.svg"}
                        />
                        <HStack spacing={"5px"}>
                          <DropIcon />
                          <Text fontWeight={"bold"} color={"brand.blue.400"}>
                            {form.values.departures.length !== 0
                              ? `${date(
                                  new Date(form.values.departures),
                                  "dd MMM yyyy"
                                )} - ${date(
                                  addDays(
                                    new Date(form.values.departures),
                                    departures.filter((item) => {
                                      return (
                                        item.date === form.values.departures
                                      );
                                    })?.[0]?.duration - 1
                                  ),
                                  "dd MMM yyyy"
                                )}`
                              : "Pilih Keberangkatan"}
                            {/* {form.values.departures} */}
                            {/* {departures.map((item) => {
                                if (
                                  form.values.departures == item.id?.toString()
                                ) {
                                  return `${convertDateWithMonthName(
                                    item.date
                                  )} - ${addDaysWithMonthName(
                                    item.date,
                                    item.duration
                                  )}`;
                                }
                              })} */}
                          </Text>
                        </HStack>
                      </Flex>
                    }
                  >
                    <Stack spacing={"24px"}>
                      {departures.map((item) => {
                        // form.values.departures == item.id &&
                        //   handleSelect(form.values.departures);
                        return (
                          <Radio
                            flexDirection={"row-reverse"}
                            colorScheme={"brand.blue"}
                            justifyContent={"space-between"}
                            {...field}
                            key={item.id}
                            isChecked={form.values.departures == item.date}
                            value={item.date}
                          >
                            {`${date(
                              new Date(item.date),
                              "dd MMM yyyy"
                            )} - ${date(
                              addDays(new Date(item.date), item.duration - 1),
                              "dd MMM yyyy"
                            )}`}
                          </Radio>
                        );
                      })}
                    </Stack>
                  </CustomDropdown>
                </FormControl>
              )}
            </Field>
          </Stack>
        </Stack>
        <Stack direction={"row"}>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            position={"relative"}
          >
            <Circle size={2} bg={"brand.blue.400"} />
            <Divider
              my={1}
              orientation="vertical"
              variant={"dashed"}
              borderColor={"brand.blue.400"}
            />
          </Flex>
          <Stack flexGrow={1} pb={"18px"}>
            <Text
              color={"brand.blue.400"}
              as={Heading}
              fontWeight={"bold"}
              fontSize={{ base: "md", md: "lg" }}
            >
              Jumlah Peserta
            </Text>
            <Stack direction={"row"} spacing={"18px"}>
              <Field name={"participants.adults"}>
                {({ form }) => (
                  <FormControl
                    isInvalid={
                      form.errors?.participants?.adults &&
                      form.touched.participants?.adults
                    }
                  >
                    <FormLabel color={"neutral.text.low"}>Dewasa</FormLabel>
                    <CustomDropdown
                      bg={"white"}
                      footer={"Pilih"}
                      title="Jumlah Penumpang"
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Person"
                            width={24}
                            height={24}
                            src={"/svg/flights/person-alt.svg"}
                          />
                          <Text>{form.values.participants.adults}</Text>
                        </Flex>
                      }
                    >
                      <Stack spacing={5} py={5}>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutraltext.high"
                            >
                              {"Dewasa"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              (13 tahun ke atas)
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.adults === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.adults > 0) {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.participants.adults - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.adults}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.adults",
                                  form.values.participants.adults + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Anak"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              (4-12 tahun)
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.children === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.children > 0) {
                                  form.setFieldValue(
                                    "participants.children",
                                    form.values.participants.children - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.children}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.children",
                                  form.values.participants.children + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    </CustomDropdown>
                    <FormErrorMessage>
                      {form.errors?.participants?.adults}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"participants.children"}>
                {({ form }) => (
                  <FormControl>
                    <FormLabel color={"neutral.text.low"}>Anak-anak</FormLabel>
                    <CustomDropdown
                      bg={"white"}
                      footer={"Pilih"}
                      title="Jumlah Penumpang"
                      innerbutton={
                        <Flex
                          direction={"row-reverse"}
                          justify={"space-between"}
                          w={"full"}
                          alignItems={"center"}
                        >
                          <Image
                            alt="Person"
                            width={24}
                            height={24}
                            src={"/svg/flights/person-alt.svg"}
                          />
                          <Text>{form.values.participants.children}</Text>
                        </Flex>
                      }
                    >
                      <Stack spacing={5} py={5}>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="neutraltext.high"
                          >
                            {"Dewasa"}
                          </Text>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.adults === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.adults > 0) {
                                  form.setFieldValue(
                                    "participants.adults",
                                    form.values.participants.adults - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.adults}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.adults",
                                  form.values.participants.adults + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="neutral.text.high"
                            >
                              {"Anak"}
                            </Text>
                            <chakra.span fontSize={"sm"}>
                              (4-12 tahun)
                            </chakra.span>
                          </Box>
                          <HStack spacing={5}>
                            <Button
                              disabled={form.values.participants.children === 0}
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                if (form.values.participants.children > 0) {
                                  form.setFieldValue(
                                    "participants.children",
                                    form.values.participants.children - 1,
                                    false
                                  );
                                }
                              }}
                            >
                              -
                            </Button>
                            <Text>{form.values.participants.children}</Text>
                            <Button
                              variant={"solid"}
                              colorScheme={"brand.blue"}
                              onClick={() => {
                                form.setFieldValue(
                                  "participants.children",
                                  form.values.participants.children + 1,
                                  false
                                );
                              }}
                            >
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    </CustomDropdown>
                  </FormControl>
                )}
              </Field>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Form>
  );
};
export const FormPrice = ({ max_price = 99999999, min_price = 0 }) => {
  const formik = useFormikContext();
  return (
    <>
      <Stack direction={"row"} spacing={0} justifyContent={"space-between"}>
        <Field name="min_price">
          {({ field, form }) => {
            return (
              <>
                <Badge
                  textAlign={"center"}
                  colorScheme={"gray"}
                  minWidth={"160"}
                  fontSize={{ base: "sm", md: "md" }}
                  rounded={"full"}
                  fontWeight={"normal"}
                  py={"8px"}
                  color={"blackAlpha.700"}
                >
                  <Text as={"span"}>
                    IDR {convertRupiah(form.values.min_price)}
                  </Text>
                  <Editable hidden {...field}>
                    <EditablePreview />
                    <EditableInput {...field} />
                  </Editable>
                </Badge>
              </>
            );
          }}
        </Field>
        <Flex w={"full"} alignItems={"center"}>
          <Divider borderWidth={"3px 0 0 3px"} />
        </Flex>
        <Field name="max_price">
          {({ field, form }) => {
            return (
              <Badge
                textAlign={"center"}
                colorScheme={"gray"}
                minWidth={"160"}
                fontSize={{ base: "sm", md: "md" }}
                rounded={"full"}
                fontWeight={"normal"}
                py={"8px"}
                color={"blackAlpha.700"}
              >
                <Text as={"span"}>
                  IDR {convertRupiah(form.values.max_price)}
                </Text>
                <Editable hidden {...field}>
                  <EditablePreview />
                  <EditableInput {...field} />
                </Editable>
              </Badge>
            );
          }}
        </Field>
      </Stack>
      <CustomRangeSlider
        min={min_price}
        value={[formik.values.min_price, formik.values.max_price]}
        max={max_price}
        handleChange={(val) => {
          formik.setFieldValue("max_price", val[1]);
          formik.setFieldValue("min_price", val[0]);
        }}
      />
    </>
  );
};

export const FormRangeDate = ({ range = [], name, titles }) => {
  const form = useFormikContext();
  const switchRef = useRef();
  const disclosure = useDisclosure();
  const [selectedTitle, setSelectedTitle] = useState(
    `Pilih Tanggal ${titles?.[0] || ""}`
  );

  const InnerButton = (
    <Flex justify={"space-between"} w={"full"} alignItems={"center"}>
      <HStack w="full">
        <Image src="/svg/flights/date.svg" alt="Date" width={24} height={24} />
        <Text
          color={!form.values[name] && "neutral.text.low"}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {(form.values[name] &&
            date(new Date(form.values[name]), "iii, d LLL yy")) ||
            `Pilih Tanggal`}
        </Text>
      </HStack>
    </Flex>
  );
  return (
    <CustomDropdown
      cusDisclosure={disclosure}
      title={selectedTitle}
      innerbutton={InnerButton}
      ignoreRef={switchRef}
      footer={
        <CustomOrangeFullWidthButton
          disabled={!form.values[range?.[0]] && !form.values[range?.[1]]}
          mt={0}
          onClick={disclosure.onClose}
        >
          Pilih
        </CustomOrangeFullWidthButton>
      }
    >
      <CustomCalendar
        allowPartialRange={!!titles}
        selectRange
        value={
          form.values[range?.[0]] &&
          form.values[range?.[1]] && [
            new Date(form.values[range?.[0]]),
            new Date(form.values[range?.[1]]),
          ]
        }
        tileDisabled={({ date }) => {
          return date[0] < new Date().setDate(new Date().getDate() - 1);
        }}
        minDate={new Date()}
        onChange={(date) => {
          date[0] && form.setFieldValue(range?.[0], date[0], false);
          date[1] && form.setFieldValue(range?.[1], date[1], false);
          titles &&
            setSelectedTitle(
              date.length === 2
                ? `${titles[0]} & ${titles[1]}`
                : date[0]
                ? `Pilih Tanggal ${titles[1]}`
                : `Pilih Tanggal ${titles[0]}`
            );
        }}
      />
    </CustomDropdown>
  );
};

export const HotelSearchForm = ({ history, populars, actionButton = null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const searchRef = React.useRef();
  history = history.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.places === value.places)
  );
  history = history.filter((item, index) => {
    return index <= 3;
  });

  const range = ["checkin_date", "checkout_date"];

  const searchHistory = useQuery(
    ["getSearchHistoryDetail", search],
    async () => {
      let result;
      !search
        ? (result = populars)
        : (result = await searchForm(search, {
            page: 1,
            pageSize: 10,
          }));
      return Promise.resolve(result);
    }
  );
  const quantityField = [
    {
      icon: <RoomIcon />,
      name: "rooms",
      label: "Jumlah Kamar",
      description: "(2-3 tamu per kamar)",
    },
    {
      icon: <PersonIcon />,
      name: "adult",
      label: "Dewasa",
      description: "(17 tahun ke atas)",
    },
    {
      icon: <PersonIcon />,
      name: "children",
      label: "Anak",
      description: "(Maksimal 17 tahun)",
    },
  ];
  function handleSearch(value) {
    setSearch(value);
  }

  const QuantityForm = ({ name, fields, field }) => {
    const form = useFormikContext();
    const InnerButton = (
      <Flex gap={"10px"} w={"full"} alignItems={"center"}>
        {field.icon}
        <Text>{form.values[name]}</Text>
      </Flex>
    );

    return (
      <>
        <CustomDropdown title="Jumlah Kamar dan Tamu" innerbutton={InnerButton}>
          <Stack spacing={5} py={5}>
            {fields.map((item, index) => (
              <Flex
                key={index}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box>
                  <Text>{item.label}</Text>
                  <Text fontSize={"sm"} color="neutral.text.low">
                    {item.description}
                  </Text>
                </Box>
                <HStack spacing={5}>
                  <Button
                    disabled={form.values[item.name] === 0}
                    variant={"solid"}
                    colorScheme={"brand.blue"}
                    onClick={() =>
                      form.values[item.name] > 0 &&
                      form.setFieldValue(
                        item.name,
                        form.values[item.name] - 1,
                        false
                      )
                    }
                  >
                    -
                  </Button>
                  <Text fontWeight={"bold"}>{form.values[item.name]}</Text>
                  <Button
                    variant={"solid"}
                    colorScheme={"brand.blue"}
                    onClick={() =>
                      form.setFieldValue(
                        item.name,
                        form.values[item.name] + 1,
                        false
                      )
                    }
                  >
                    +
                  </Button>
                </HStack>
              </Flex>
            ))}
            <Box
              hidden={!form.values.children}
              py="24px"
              borderTop="1px dashed #e9e9e9"
            >
              <Text fontSize="xs" mb="24px">
                Mohon memasukan usia anak sehingga kami dapat mencarikan Anda
                kamar, ranjang dan penawaran terbaik
              </Text>
              <Stack spacing="24px">
                {[...Array(form.values.children)].map((_, index) => (
                  <HStack key={index} justifyContent="space-between">
                    <Box flexBasis="100%">
                      <Text color="neutral.text.high" fontSize="sm">
                        Usia Anak
                      </Text>
                      <Text color="neutral.text.medium" fontSize="xs">
                        (Maksimal 17 Tahun)
                      </Text>
                    </Box>
                    <CustomDropdown
                      title="Masukkan Umur Anak"
                      innerbutton={
                        <HStack w={"full"} justifyContent={"space-between"}>
                          <Text>
                            {form.values.children_ages?.[index]
                              ? `${form.values.children_ages[index]} Tahun`
                              : "Masukan Umur"}
                          </Text>
                          <ExpandArrowIcon />
                        </HStack>
                      }
                    >
                      <RadioGroup
                        onChange={(value) =>
                          form.setFieldValue(`children_ages.${index}`, value)
                        }
                        value={form.values.children_ages?.[index]}
                      >
                        <Stack spacing={6}>
                          {[...Array(17)].map((_, index) => (
                            <Radio
                              key={index}
                              flexDirection={"row-reverse"}
                              colorScheme={"brand.blue"}
                              justifyContent={"space-between"}
                              value={(index + 1).toString()}
                            >
                              {index + 1} Tahun
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </CustomDropdown>
                  </HStack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </CustomDropdown>
      </>
    );
  };

  const SubmitButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        onClick={formik.submitForm}
      >
        Temukan Hotel
      </CustomOrangeFullWidthButton>
    );
  };

  return (
    <Stack spacing={"18px"}>
      <Field name="places">
        {({ field, form }) => (
          <FormControl
            {...field}
            isRequired
            isInvalid={form.errors.places && form.touched.places}
          >
            <FormLabel fontSize={{ base: "sm", md: "md" }}>
              Kota / Nama Hotel
            </FormLabel>
            <CustomDropdown
              initialFocusRef={searchRef}
              cusDisclosure={{ isOpen, onOpen, onClose }}
              notrounded
              title={"Pilih Kota atau Hotel"}
              innerbutton={
                <HStack
                  justify={"space-between"}
                  w={"full"}
                  alignItems={"center"}
                >
                  <HStack>
                    <Icon w={"24px"} h={"24px"}>
                      <HotelIcon />
                    </Icon>
                    <Text
                      color={!form.values.places && "neutral.text.low"}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {form.values.places || "Pilih Lokasi"}
                    </Text>
                  </HStack>
                </HStack>
              }
              placeholder={"Pilih Lokasi"}
            >
              <InputGroup mb={"16px"}>
                <Input
                  ref={searchRef}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Cari"
                  value={search}
                  variant="filled"
                />
                <InputRightElement pointerEvents="none">
                  <Image
                    src="/svg/header-search.svg"
                    alt="search"
                    width={16}
                    height={16}
                  />
                </InputRightElement>
              </InputGroup>
              {!search && history.length > 0 && (
                <Box>
                  <Box
                    mx={"-24px"}
                    px={"24px"}
                    py={"12px"}
                    bg={"brand.blue.100"}
                  >
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight={"semibold"}
                      color={"brand.blue.500"}
                    >
                      {"Pencarian Terakhir"}
                    </Text>
                  </Box>
                  <Stack py={5} mx={"-24px"}>
                    {/* TODO: Integrate data using useQuery for search feature */}
                    {!searchHistory.isLoading ? (
                      history?.map((item, index) => (
                        <Flex
                          py={"6px"}
                          px={"24px"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          key={index}
                          cursor="pointer"
                          onClick={() => {
                            item.type === "hotel"
                              ? form.setFieldValue("type", "hotel", false)
                              : item.type === "city"
                              ? (form.setFieldValue("zones", item.zones, false),
                                form.setFieldValue("type", "city", false))
                              : form.setFieldValue("type", "region", false);
                            form.setFieldValue("code", item.code, false),
                              form.setFieldValue("places", item.places, false),
                              form.setFieldValue("desc", item.desc, false),
                              onClose();
                          }}
                          bg={
                            form.values.places === item.places
                              ? "brand.blue.100"
                              : "transparent"
                          }
                          _hover={{ bg: "brand.blue.100" }}
                        >
                          <VStack alignItems={"start"}>
                            <Text
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight={"semibold"}
                            >
                              {/* {item.type !== 'city' ? item.name : item.zoneName} */}
                              {item.places}
                            </Text>
                            <Text color={"neutral.text.low"}>{item.desc}</Text>
                          </VStack>
                          <Box
                            bg={"brand.blue.100"}
                            p={"6px"}
                            borderRadius={"2px"}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {item.type === "city"
                              ? "Kota"
                              : item.type === "region"
                              ? "Wilayah"
                              : item.type === "hotel"
                              ? "Hotel"
                              : "Type"}
                          </Box>
                        </Flex>
                      ))
                    ) : (
                      <Center>
                        <Spinner />
                      </Center>
                    )}
                  </Stack>
                </Box>
              )}
              <Box>
                <Box mx={"-24px"} px={"24px"} py={"12px"} bg={"brand.blue.100"}>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight={"semibold"}
                    color={"brand.blue.500"}
                  >
                    {search ? "Hasil pencarian " + search : "Pencarian Populer"}
                  </Text>
                </Box>
                <Stack py={5} mx={"-24px"}>
                  {/* TODO: Integrate data using useQuery for search feature */}

                  {!searchHistory.isLoading ? (
                    searchHistory?.data?.matching?.map((item, index) => (
                      <Flex
                        py={"6px"}
                        px={"24px"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        key={index}
                        cursor="pointer"
                        onClick={() => {
                          item.type === "hotel"
                            ? (form.setFieldValue("places", item.name, false),
                              form.setFieldValue("code", item.code, false),
                              form.setFieldValue("type", "hotel", false),
                              form.setFieldValue(
                                "desc",
                                capitalizeFirstLetter(item.city.toLowerCase()),
                                false
                              ))
                            : item.type === "city"
                            ? (form.setFieldValue(
                                "places",
                                item.zoneName,
                                false
                              ),
                              form.setFieldValue(
                                "code",
                                item.destinationId.code,
                                false
                              ),
                              form.setFieldValue("zones", item.zoneCode, false),
                              form.setFieldValue("type", "city", false),
                              form.setFieldValue(
                                "desc",
                                capitalizeFirstLetter(item.destinationId.name) +
                                  ", " +
                                  capitalizeFirstLetter(
                                    item.destinationId.countryId.name
                                  ),
                                false
                              ))
                            : (form.setFieldValue("places", item.name, false),
                              form.setFieldValue("code", item.code, false),
                              form.setFieldValue("type", "region", false),
                              form.setFieldValue(
                                "desc",
                                capitalizeFirstLetter(item.countryId.name),
                                false
                              ));
                          onClose();
                        }}
                        bg={
                          form.values.places === item.name
                            ? "brand.blue.100"
                            : "transparent"
                        }
                        _hover={{ bg: "brand.blue.100" }}
                      >
                        <VStack alignItems={"start"}>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={"semibold"}
                          >
                            {item.type !== "city" ? item.name : item.zoneName}
                          </Text>
                          <Text color={"neutral.text.low"}>
                            {item.type === "city"
                              ? capitalizeFirstLetter(item.destinationId.name) +
                                ", " +
                                capitalizeFirstLetter(
                                  item.destinationId.countryId.name
                                )
                              : item.type === "region"
                              ? capitalizeFirstLetter(item.countryId.name)
                              : capitalizeFirstLetter(item.city.toLowerCase())}
                          </Text>
                        </VStack>
                        <Box
                          bg={"brand.blue.100"}
                          p={"6px"}
                          borderRadius={"2px"}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {item.type === "city"
                            ? "Kota"
                            : item.type === "region"
                            ? "Wilayah"
                            : item.type === "hotel"
                            ? "Hotel"
                            : "Type"}
                        </Box>
                      </Flex>
                    ))
                  ) : (
                    <Center>
                      <Spinner />
                    </Center>
                  )}
                </Stack>
              </Box>
            </CustomDropdown>
            <FormErrorMessage>{form.errors.places}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <HStack>
        <Field name={range?.[0]}>
          {({ field, form }) => (
            <FormControl
              {...field}
              isRequired
              isInvalid={form.errors.checkin_date && form.touched.checkin_date}
            >
              <FormLabel fontSize={{ base: "sm", md: "md" }}>
                Check In
              </FormLabel>
              <FormRangeDate
                range={range}
                name={range?.[0]}
                titles={["Check In", "Check Out"]}
              />
              <FormErrorMessage>{form.errors.checkin_date}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        <Field name={range?.[1]}>
          {({ field, form }) => (
            <FormControl
              {...field}
              isRequired
              isInvalid={
                form.errors.checkout_date && form.touched.checkout_date
              }
            >
              <FormLabel fontSize={{ base: "sm", md: "md" }}>
                Check Out
              </FormLabel>
              <FormRangeDate
                range={range}
                name={range?.[1]}
                titles={["Check In", "Check Out"]}
              />
              <FormErrorMessage>{form.errors.checkout_date}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      </HStack>
      <Stack
        columns={1}
        // columns={{ base: 1, md: responsive ? 1 : 3 }}
        spacing={"16px"}
      >
        <Grid gap={"12px"} templateColumns={"repeat(2,1fr)"}>
          {quantityField.map((f, i) => (
            <GridItem key={i} colSpan={f.name === "rooms" ? 2 : 1}>
              <Field name={f.name}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors[field.name] && form.touched[field.name]
                    }
                    isRequired={f.name === "rooms"}
                  >
                    <FormLabel
                      fontSize={{ base: "sm", md: "md" }}
                      color={"neutral.text.medium"}
                    >
                      {f.label}
                    </FormLabel>
                    <QuantityForm
                      field={f}
                      name={f.name}
                      fields={quantityField}
                    />
                    <FormErrorMessage>
                      {form.errors[field.name]}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </GridItem>
          ))}
        </Grid>
      </Stack>
      {actionButton ?? <SubmitButton />}
    </Stack>
  );
};
export const AttractionSearchForm = ({
  history,
  popular,
  actionButton = null,
  types,
}) => {
  // const searchHistory = useQuery(
  //   ["getSearchHistoryDetail", history],
  //   async () => {
  //     const placesArray = _.pluck(history, "places");
  //     console.log(placesArray, "placesArray")
  //     const response = await Promise.all(
  //       popular.filter((item) => {
  //         return placesArray.includes(item.value);
  //       })
  //     );

  //     return Promise.resolve(response);
  //   }
  // );

  history = history.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.places === value.places)
  );
  history = history.filter((item, index) => {
    return index <= 3;
  });
  // console.log(history, "history")

  const SubmitButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        onClick={formik.submitForm}
      >
        Temukan Atraksi
      </CustomOrangeFullWidthButton>
    );
  };

  const SearchField = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const searchRef = React.useRef();
    const formik = useFormikContext();
    const { values } = formik;
    function handleSearch(value) {
      setSearch(value);
    }
    const [search, setSearch] = useState("");

    const attractions = useQuery(
      ["getSearchAttractionsArea", search],
      async ({ pageParam = 0 }) => {
        try {
          let response;
          !search
            ? (response = popular)
            : (response = await getAttractionsArea({ search, pageParam }));
          return Promise.resolve(response);
        } catch (error) {
          // console.error(error);
          return Promise.reject(error);
        }
      }
    );
    const uuid = values.places;
    const attractionsLabel = useQuery(
      ["getAttractionsLabelDropdown", uuid],
      async () => {
        try {
          const response = await getStateById(uuid);
          return Promise.resolve(response);
        } catch (error) {
          // console.error(error);
          return Promise.reject(error);
        }
      }
    );
    const searchHistory = useQuery(
      ["getSearchHistoryDetail", search],
      async () => {
        let result;
        !search
          ? (result = await Promise.all(
              history.map(async (item, index) => {
                let response = await getStateById(item.places);
                response = { ...item, ...response?.data?.[0]?.attributes };
                return Promise.resolve(response);
              })
            ))
          : (result = await getAttractionsArea({ search, pageParam }));
        return Promise.resolve(result);
      }
    );

    return (
      <Field name="places">
        {({ field, form }) => (
          <FormControl
            isInvalid={form.errors[field.name] && form.touched[field.name]}
          >
            <FormLabel fontSize={{ base: "sm", md: "md" }}>
              Kota / Nama Atraksi
            </FormLabel>
            <CustomDropdown
              initialFocusRef={searchRef}
              cusDisclosure={{ isOpen, onOpen, onClose }}
              notrounded
              title={"Pilih Kota atau Atraksi"}
              innerbutton={
                <HStack
                  justify={"space-between"}
                  w={"full"}
                  alignItems={"center"}
                >
                  <HStack>
                    <Text
                      color={!form.values[field.name] && "neutral.text.low"}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {(form.values[field.name] &&
                        attractionsLabel.data &&
                        attractionsLabel.data.data.map((item) => {
                          return item.attributes.name ?? item.attributes.title;
                        })) ||
                        "Cari kota atau atraksi"}
                    </Text>
                  </HStack>
                </HStack>
              }
              placeholder={"Cari kota atau atraksi"}
            >
              <InputGroup mb={"16px"}>
                <Input
                  ref={searchRef}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  placeholder="Cari"
                  value={search}
                  variant="filled"
                />
                <InputRightElement pointerEvents="none">
                  <Image
                    src="/svg/header-search.svg"
                    alt="search"
                    width={16}
                    height={16}
                  />
                </InputRightElement>
              </InputGroup>
              {!search &&
                history.filter((item) => {
                  return item.places !== "";
                }).length > 0 && (
                  <Box>
                    <Box
                      mx={"-24px"}
                      px={"24px"}
                      py={"12px"}
                      bg={"brand.blue.100"}
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight={"semibold"}
                        color={"brand.blue.500"}
                      >
                        {"Pencarian Terakhir"}
                      </Text>
                    </Box>
                    <Stack py={5} mx={"-24px"}>
                      {/* TODO: Integrate data using useQuery for search feature */}
                      {!searchHistory.isLoading ? (
                        searchHistory?.data?.map((item, index) => (
                          <Flex
                            py={"6px"}
                            px={"24px"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            key={index}
                            cursor="pointer"
                            onClick={() => {
                              form.setFieldValue("places", item.uuid, false);
                              form.setFieldValue(
                                "places_type",
                                item.places_type,
                                false
                              );
                              onClose();
                            }}
                            bg={
                              form.values.places === item
                                ? "brand.blue.100"
                                : "transparent"
                            }
                            _hover={{ bg: "brand.blue.100" }}
                          >
                            <VStack alignItems={"start"}>
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                fontWeight={"semibold"}
                              >
                                {item?.name}
                              </Text>
                              <Text color={"neutral.text.low"}>
                                {item?.subname}
                              </Text>
                            </VStack>
                            {/* <Box
                              bg={"brand.blue.100"}
                              p={"6px"}
                              borderRadius={"2px"}
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {item?.type === "city"
                                ? "Kota"
                                : item?.type === "area"
                                  ? "Wilayah"
                                  : item?.type === "attraction"
                                    ? "Atraksi"
                                    : item?.type}
                            </Box> */}
                          </Flex>
                        ))
                      ) : (
                        <Center>
                          <Spinner />
                        </Center>
                      )}
                    </Stack>
                  </Box>
                )}
              <Box>
                <Box mx={"-24px"} px={"24px"} py={"12px"} bg={"brand.blue.100"}>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight={"semibold"}
                    color={"brand.blue.500"}
                  >
                    {search ? "Hasil pencarian " + search : "Pencarian Populer"}
                  </Text>
                </Box>
                <Stack py={5} mx={"-24px"}>
                  {/* TODO: Integrate data using useQuery for search feature */}
                  {!attractions.isLoading && attractions?.data ? (
                    attractions.data?.map((item, index) => (
                      <Flex
                        py={"6px"}
                        px={"24px"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        key={index}
                        cursor="pointer"
                        onClick={() => {
                          form.setFieldValue("places", item.uuid, false);
                          form.setFieldValue("places_type", item.type, false);
                          onClose();
                        }}
                        bg={
                          form.values.places === item.uuid
                            ? "brand.blue.100"
                            : "transparent"
                        }
                        _hover={{ bg: "brand.blue.100" }}
                      >
                        <VStack alignItems={"start"}>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={"semibold"}
                          >
                            {item.type === "attractionList"
                              ? `${item.title}`
                              : item.type === "cityList"
                              ? item.name
                              : item.type === "countryList"
                              ? item.name
                              : ""}
                          </Text>
                          <Text color={"neutral.text.low"}>
                            {item.type === "attractionList"
                              ? `${item.city}, ${item.country}`
                              : item.type === "cityList"
                              ? item.country
                              : item.type === "countryList"
                              ? item.name
                              : ""}
                          </Text>
                        </VStack>
                        <Box
                          bg={"brand.blue.100"}
                          p={"6px"}
                          borderRadius={"2px"}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {item.type === "attractionList"
                            ? `Atraksi`
                            : item.type === "cityList"
                            ? `Kota`
                            : item.type === "countryList"
                            ? `Negara`
                            : ""}
                        </Box>
                      </Flex>
                    ))
                  ) : (
                    <Center>
                      <Spinner />
                    </Center>
                  )}
                </Stack>
              </Box>
            </CustomDropdown>
            <FormErrorMessage>{form.errors.places}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    );
  };
  return (
    <Stack spacing={"18px"}>
      <SearchField />
      <Field name="type">
        {({ field, form }) => (
          <FormControl>
            <FormLabel>Tipe Atraksi</FormLabel>
            <CustomDropdown
              responsive
              title={"Pilih Tipe Atraksi"}
              placeholder={"All"}
              value={form.values[field.name]}
              label={types?.map((item) => {
                if (form.values[field.name] == "") return "All";
                if (form.values[field.name] == item.uuid) return item.name;
              })}
            >
              <RadioGroup
                onChange={() => form.setFieldValue("destination", "")}
                value={form.values[field.name]}
              >
                <Stack spacing={5} py={5}>
                  {types &&
                    types?.map((item, index) => (
                      <>
                        {
                          <Radio
                            {...field}
                            flexDirection={"row-reverse"}
                            colorScheme={"brand.blue"}
                            justifyContent={"space-between"}
                            key={index}
                            value={item.uuid}
                            isChecked={form.values[field.name] == item.uuid}
                          >
                            {item.name}
                          </Radio>
                        }
                      </>
                    ))}
                </Stack>
              </RadioGroup>
            </CustomDropdown>
          </FormControl>
        )}
      </Field>
      {actionButton ?? <SubmitButton />}
    </Stack>
  );
};
export const DynamicPerBookingFormik = ({ innerRef, form }) => {
  return (
    <Box>
      <Stack spacing={5} pt={6}>
        <Divider variant={"dashed"} />
        <Formik
          innerRef={innerRef}
          initialValues={form.reduce((prev, val) => {
            return { ...prev, [val.name]: "" };
          }, {})}
          onSubmit={(values) => {
            // console.log(values);
          }}
          validationSchema={Yup.object().shape(
            form.reduce((prev, val) => {
              // return {
              //   ...prev,
              //   [val.name]: Yup.lazy((value) => {
              //     if (val.inputType === 2) {
              //       return Yup.array().of(Yup.string());
              //     } else return Yup.string();
              //   }),
              // };
              return {
                ...prev,
                [val.name]: Yup.mixed()
                  .when([], {
                    is: () => val.inputType === 2,
                    then: Yup.array(),
                    otherwise: Yup.string(),
                  })
                  .when([], {
                    is: () => val.maxNumber,
                    then: (schema) =>
                      Yup.number().max(
                        val.maxNumber,
                        `Maksimal ${val.maxNumber} karakter`
                      ),
                  })
                  .when([], {
                    is: () => val.minNumber,
                    then: (schema) =>
                      Yup.number().min(
                        val.minNumber,
                        `Minimal ${val.minNumber} karakter`
                      ),
                  })
                  .when([], {
                    is: () => val.formatRegex,
                    then: (schema) =>
                      Yup.string().matches(val.formatRegex, {
                        message: "Harap diisi dengan sesuai",
                      }),
                    otherwise: (schema) => schema,
                  })
                  .when([], {
                    is: () => val.required,
                    then: (schema) => schema.required(`Harap Diisi`),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                // ...(val.inputType === 2
                //   ? {
                //       [val.name]: Yup.array().when([], {
                //         is: val.required,
                //         then: (schema) => schema.required(`Harap Diisi`),
                //         otherwise: (schema) => schema.notRequired(),
                //       }),
                //     }
                //   : {
                //       [val.name]: Yup.string().when([], {
                //         is: val.required,
                //         then: (schema) => schema.required(`Harap Diisi`),
                //         otherwise: (schema) => schema.notRequired(),
                //       }),
                //     }),
              };
            }, {})
          )}
        >
          <Form>
            <Stack spacing={5}>
              <GlobalForm fields={form} />
            </Stack>
          </Form>
        </Formik>
      </Stack>
    </Box>
  );
};
export const FormVisa = () => {
  const fields = [
    {
      name: "destination",
      label: "Negara Tujuan",
      type: "select",
      isVisa: true,
    },
  ];

  const SubmitButton = () => {
    const formik = useFormikContext();
    return (
      <CustomOrangeFullWidthButton
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        onClick={formik.submitForm}
      >
        Cek Visa dan Passport
      </CustomOrangeFullWidthButton>
    );
  };

  return (
    <Stack spacing="24px">
      <GlobalForm fields={fields} />
      <SubmitButton />
    </Stack>
  );
};
