import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FastField, Field, useFormikContext } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { toTitleCase } from "../../helpers";
import date from "../../helpers/date";
import {
  getCountries,
  getCountriesFromIsoCode,
  getCountriesWithTourAvailability,
  getPopularCountries,
} from "../../services/country.service";
import { getOrigins } from "../../services/insurance.service";
import {
  getPackageDestination,
  getPackageDestinationWithPackageAvailability,
} from "../../services/package.service";
import SearchIcon from "../../../public/svg/icons/tour/search.svg";
import { getToursV2 } from "../../services/tour.service";
import CustomCalendar from "../calendar";
import { NoResults } from "../card";
import { CustomDropdown } from "../dropdown";
import { CustomFilterButton } from "../button";
import { find } from "underscore";

// check checkout-detail components for more detail
const GlobalForm = ({ fields }) => {
  const FlexibleField = ({ f }) => {
    const form = useFormikContext();
    const inputRef = useRef();
    if (!f.content) {
      return (
        <>
          {f.type === "multiselect" ? (
            <FormControl
              isRequired={f.required ?? false}
              isInvalid={form.errors[f.name] && form.touched[f.name]}
            >
              <FormLabel
                htmlFor={f.name}
                fontSize="sm"
                color="neutral.text.medium"
                textTransform="capitalize"
              >
                {f.label}
              </FormLabel>
              <CustomDropdown
                title="Pilih"
                value={form.values[f.name]}
                placeholder={f.placeholder ?? "Pilih " + f.label ?? "wad"}
              >
                <Stack spacing={5}>
                  {f.options.map((option, index) => (
                    <FastField
                      key={index}
                      type="checkbox"
                      value={option.value}
                      name={f.name}
                    >
                      {({ field, form }) => (
                        <Checkbox
                          {...field}
                          colorScheme="brand.blue"
                          isChecked={form.values[field.name].includes(
                            option.value
                          )}
                          flexDirection={"row-reverse"}
                          value={option.value}
                        >
                          {option.label}
                        </Checkbox>
                      )}
                    </FastField>
                  ))}
                </Stack>
              </CustomDropdown>
              <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
            </FormControl>
          ) : (
            <FastField name={f.name} type={f.type} value={f.value}>
              {({ field, form }) => (
                <FormControl
                  isRequired={f.required ?? false}
                  isInvalid={form.errors[f.name] && form.touched[f.name]}
                >
                  <FormLabel
                    htmlFor={field.name}
                    fontSize="sm"
                    color="neutral.text.medium"
                    textTransform="capitalize"
                  >
                    {f.label}
                  </FormLabel>
                  {f.type ? (
                    f.type === "radio" ? (
                      <DropdownForm
                        options={f.options}
                        field={field}
                        form={form}
                        name={f.name}
                        {...f}
                      />
                    ) : f.type === "checkbox" ? (
                      <>
                        <Flex alignItems={"start"}>
                          <Switch
                            {...field}
                            colorScheme={"brand.blue"}
                            isChecked={form.values[field.name]}
                            onChange={(e) => {
                              form.setFieldValue(
                                field.name,
                                e.target.checked,
                                true
                              );
                            }}
                          />
                        </Flex>
                      </>
                    ) : f.type === "select" ? (
                      <SelectForm
                        // isInsurance={router.pathname.startsWith("/insurances")}
                        options={f.options}
                        field={field}
                        form={form}
                        name={f.name}
                        {...f}
                      />
                    ) : f.type === "counter" ? (
                      <CustomDropdown
                        label={
                          form.values[field.name] === 0
                            ? f.placeholder ?? `Pilih ${f.label}`
                            : form.values[field.name]
                        }
                        value={form.values[field.name]}
                        placeholder={f.placeholder ?? `Pilih ${f.label}`}
                        footer={`Pilih ${f.label}`}
                        title={f.label}
                        rightIcon={f.rightIcon}
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
                              {f.label}
                            </Text>
                            <HStack spacing={5}>
                              <Button
                                disabled={form.values[field.name] === 0}
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  if (form.values[field.name] > 0) {
                                    form.setFieldValue(
                                      f.name,
                                      form.values[field.name] - 1,
                                      true
                                    );
                                  }
                                }}
                              >
                                -
                              </Button>
                              <Text>{form.values[field.name]}</Text>
                              <Button
                                variant={"solid"}
                                colorScheme={"brand.blue"}
                                onClick={() => {
                                  form.setFieldValue(
                                    f.name,
                                    form.values[field.name] + 1,
                                    true
                                  );
                                }}
                              >
                                +
                              </Button>
                            </HStack>
                          </Flex>
                        </Stack>
                      </CustomDropdown>
                    ) : f.type === "textarea" ? (
                      <Textarea
                        value={form.values[field.name]}
                        {...field}
                        placeholder={"Isi " + toTitleCase(f.label)}
                        variant="filled"
                        fontSize={{ base: "sm", md: "md" }}
                      />
                    ) : f.type === "calendar" ? (
                      <CalendarForm f={f} form={form} value={field.value} />
                    ) : f.type === "date" ? (
                      <CalendarForm
                        f={f}
                        toString
                        form={form}
                        value={field.value}
                      />
                    ) : f.type === "file" ? (
                      <InputGroup>
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            form.setFieldValue(
                              field.name,
                              e.target.files[0],
                              true
                            );
                          }}
                          style={{ display: "none" }}
                        />
                        <Input
                          as={Button}
                          fontWeight="normal"
                          color={
                            form.values[field.name]?.name
                              ? "neutral.text.medium"
                              : "neutral.text.low"
                          }
                          justifyContent={"flex-start"}
                          // textAlign={"right"}
                          // placeholder={}
                          onClick={() => inputRef.current.click()}
                          variant="filled"
                        >
                          {form.values[field.name]?.name || "File.jpg"}
                        </Input>
                        <InputRightElement mx="17px">
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="brand.blue.400"
                          >
                            Pilih
                          </Text>
                        </InputRightElement>
                      </InputGroup>
                    ) : (
                      // <Field type={"file"} name={f.name} />
                      <Input
                        fontSize={{ base: "sm", md: "md" }}
                        {...field}
                        id={f.name}
                        type={f.type}
                        variant="filled"
                        textColor={"neutral.text.high"}
                        _placeholder={{ color: "neutral.text.low" }}
                        // size="lg"
                        value={form.values[f.name]}
                        placeholder={"Isi " + toTitleCase(f.label)}
                      />
                    )
                  ) : null}
                  <FormHelperText>{f?.description}</FormHelperText>
                  <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                </FormControl>
              )}
            </FastField>
          )}
        </>
      );
    } else return f.content;
  };
  return (
    <Box>
      <Stack spacing={2}>
        {fields.map((f, index) =>
          Array.isArray(f) ? (
            <HStack key={index}>
              {f.map((item, index) => (
                <>
                  <FlexibleField key={index} f={item} />
                </>
              ))}
            </HStack>
          ) : !f.element && typeof f === "object" && f !== null ? (
            <FlexibleField key={index} f={f} />
          ) : (
            f.element
          )
        )}
      </Stack>
    </Box>
  );
};

export default GlobalForm;

export const DropdownForm = ({ options, field, form, name, ...props }) => {
  return (
    <CustomDropdown
      title="Pilih"
      label={
        options.filter((item) => item.value === form.values[field.name])[0]
          ?.label
      }
      value={form.values[field.name]}
      placeholder={
        props.placeholder ?? "Pilih " + props.label ?? toTitleCase(name)
      }
    >
      <RadioGroup
        {...field}
        onChange={(next) => form.setFieldValue(name, next, true)}
        value={form.values[field.name]}
      >
        <Stack spacing={5} py={5}>
          {options?.map((item, index) => (
            <Radio
              flexDirection={"row-reverse"}
              colorScheme={"brand.blue"}
              justifyContent={"space-between"}
              key={index}
              value={typeof item === "object" ? item.value : item}
            >
              {typeof item === "object" ? item.label : item}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </CustomDropdown>
  );
};

export const SelectForm = ({
  onChange = null,
  field,
  form,
  name,
  isTour = false,
  isPackage = false,
  isVisa = false,
  isInsurance = false,
  placeholder = "",
  setField = "isoCode2",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const onSetLabel = (value) => {
    if (setField === "isoCode2") {
      getCountriesFromIsoCode(value)
        .then((item) => {
          setLabel(item[0].attributes.name);
        })
        .catch(() => {
          setLabel(value);
        });
    } else {
      setLabel(value);
    }
  };

  const CountryList = ({ item }) => {
    const Item = ({ item }) => {
      const value =
        setField === "isoCode2"
          ? item.attributes.isoCode2
          : setField === "countryName"
          ? item.attributes.name
          : "";
      return (
        <HStack
          py={"6px"}
          px={"24px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          {...field}
          onClick={() => {
            onChange
              ? onChange({ value })
              : form.setFieldValue(name, value, true);
            onClose();
            onSetLabel(value);
          }}
          cursor={"pointer"}
          bg={form.values[name] === value ? "brand.blue.100" : ""}
          _hover={{ bg: "brand.blue.100" }}
        >
          <VStack alignItems={"start"}>
            <Text fontSize={"sm"} fontWeight={"semibold"}>
              {item.attributes.name}
            </Text>
            {/* <Text color={"neutral.text.low"}>
              {isTour
                ? (item.attributes.tourAvailability &&
                    item.attributes.tourAvailability.length +
                      " Keberangkatan") ??
                  0 + " Keberangkatan"
                : item.attributes.name}{" "}
            </Text> */}
          </VStack>
          <Box
            bg={"brand.blue.100"}
            p={"6px"}
            borderRadius={"2px"}
            fontSize={"12px"}
          >
            {isPackage
              ? form.values.isDomestic
                ? "Kota"
                : "Negara"
              : "Negara"}
          </Box>
        </HStack>
      );
    };
    return (
      <>
        {!item.isError ? (
          item?.data?.map((item, index) => <Item item={item} key={index} />)
        ) : (
          <Center>
            <Text>Masukkan pencarian dengan minimal 3 huruf</Text>
          </Center>
        )}
      </>
    );
  };
  const PackageDestinationList = ({ item }) => {
    const Item = ({ item }) => {
      return (
        <HStack
          py={"6px"}
          px={"24px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          {...field}
          onClick={() => {
            form.setFieldValue(name, item.attributes.name, true);
            onSetLabel(item.attributes.name);
            onClose();
          }}
          cursor={"pointer"}
          bg={
            form.values[name] === item.attributes.name ? "brand.blue.100" : ""
          }
          _hover={{ bg: "brand.blue.100" }}
        >
          <VStack alignItems={"start"}>
            <Text fontSize={"sm"} fontWeight={"semibold"}>
              {item.attributes.name}
            </Text>
            {/* <Text color={"neutral.text.low"}>
              {isTour
                ? (item.attributes.tourAvailability &&
                    item.attributes.tourAvailability.length +
                      " Keberangkatan") ??
                  0 + " Keberangkatan"
                : item.attributes.name}{" "}
            </Text> */}
          </VStack>
          <Box
            bg={"brand.blue.100"}
            p={"6px"}
            borderRadius={"2px"}
            fontSize={"12px"}
          >
            {isPackage
              ? form.values.isDomestic
                ? "Kota"
                : "Negara"
              : "Negara"}
          </Box>
        </HStack>
      );
    };
    return (
      <>
        {!item.isError ? (
          item.data.map((item, index) => <Item item={item} key={index} />)
        ) : (
          <Center>
            <Text>Masukkan pencarian dengan minimal 3 huruf</Text>
          </Center>
        )}
      </>
    );
  };

  const OriginsListInsurance = ({ item }) => {
    const Item = ({ item }) => {
      return (
        <HStack
          py={"6px"}
          px={"24px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          {...field}
          onClick={() => {
            form.setFieldValue(name, item.attributes.name, true);
            onSetLabel(item.attributes.name);
            onClose();
          }}
          cursor={"pointer"}
          bg={
            form.values[name] === item.attributes.name ? "brand.blue.100" : ""
          }
          _hover={{ bg: "brand.blue.100" }}
        >
          <VStack alignItems={"start"}>
            <Text fontSize={"sm"} fontWeight={"semibold"}>
              {item.attributes.name}
            </Text>
            {/* <Text color={"neutral.text.low"}>
              {item.attributes.name}{" "}
            </Text> */}
          </VStack>
          <Box
            bg={"brand.blue.100"}
            p={"6px"}
            borderRadius={"2px"}
            fontSize={"12px"}
          >
            Kota
          </Box>
        </HStack>
      );
    };
    return (
      <>
        {!item.isError ? (
          item.data.map((item, index) => <Item item={item} key={index} />)
        ) : (
          <Center>
            <Text>Masukkan pencarian dengan minimal 3 huruf</Text>
          </Center>
        )}
      </>
    );
  };

  const SearchDrawer = () => {
    const [search, setSearch] = useState("");

    const queryKey = isPackage
      ? ["getPackageDestination", search, form.values.isDomestic]
      : isInsurance
      ? ["getOrigins", search]
      : ["getCountries", search];
    const countries = useQuery(
      queryKey,
      async () => {
        let result;
        isTour
          ? (result = await getCountriesWithTourAvailability(search))
          : isPackage
          ? (result = await getPackageDestination(
              form.values.isDomestic,
              search
            ))
          : isVisa
          ? (result = await getCountries(search, { withRequirement: true }))
          : isInsurance
          ? (result = await getOrigins(search))
          : (result = await getCountries(search));
        return Promise.resolve(result);
      }
      // { enabled: search.length == 0 || search.length > 2 }
    );

    const popular = useQuery(["getPopularCountries"], async () => {
      const array = [];
      const countries = [
        "Switzerland",
        "Great Britain",
        "France",
        "Italy",
        "Spain",
        "Finland",
        "Norway",
        "Turkey",
        "Japan",
        "South Korea",
        "Amerika Serikat",
        "Thailand",
        "Vietnam",
        "Australia",
        "New Zealand",
      ];
      let list;
      if (isTour) {
        try {
          list = countries;
          const result = await Promise.all(
            list.map(async (item) => {
              return Promise.resolve(
                ...(await getCountriesWithTourAvailability(item))
              );
            })
          );
          const response = await getPopularCountries();
          return Promise.resolve(
            // result.filter((item) => {
            //   return item !== undefined;
            // })
            response
          );
        } catch (error) {
          console.log(error);
          return Promise.reject(error);
        }
      } else if (isPackage) {
        if (form.values.isDomestic) {
          list = [
            "Bali",
            "Belitung",
            "Labuan Bajo",
            "Lombok",
            "Malang",
            "Medan",
            "Raja Ampat",
            "Sumba",
            "Surabaya",
            "Yogyakarta",
          ];
        } else if (!form.values.isDomestic) {
          list = countries;
        }
        const result = await Promise.all(
          list.map(async (item) => {
            return Promise.resolve(
              ...(await getPackageDestinationWithPackageAvailability(
                form.value.isDomestic,
                item
              ))
            );
          })
        );
        return Promise.resolve(
          result.filter((item) => {
            return item !== undefined;
          })
        );
      }
      return null;
    });
    const recommended = useQuery(["getCountries", "Indonesia"], async () => {
      const result = await getCountries("Indonesia");
      return Promise.resolve(result);
    });

    const handleSearch = (search) => {
      setSearch(search);
    };
    return (
      <>
        <InputGroup mb={"16px"}>
          <Input
            value={search}
            fontSize={"sm"}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isInsurance ? "Cari Kota" : "Cari Negara"}
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
        {!search && (
          <>
            {!isTour && !isPackage && !isVisa && !isInsurance && (
              <>
                <Box mx={"-24px"} px={"24px"} py={"12px"} bg={"brand.blue.100"}>
                  <Text
                    fontSize={"sm"}
                    fontWeight={"semibold"}
                    color={"brand.blue.500"}
                  >
                    Teratas
                  </Text>
                </Box>
                <Stack py={5} mx={"-24px"}>
                  <CountryList item={recommended} />
                </Stack>
              </>
            )}
            {(isTour || isPackage) && (
              <>
                <Box mx={"-24px"} px={"24px"} py={"12px"} bg={"brand.blue.100"}>
                  <Text
                    fontSize={"sm"}
                    fontWeight={"semibold"}
                    color={"brand.blue.500"}
                  >
                    Pencarian Populer
                  </Text>
                </Box>
                <Stack py={5} mx={"-24px"}>
                  {!popular.isLoading ? (
                    isTour ? (
                      <CountryList item={popular} />
                    ) : isPackage ? (
                      <PackageDestinationList item={popular} />
                    ) : (
                      <NoResults hideButton />
                    )
                  ) : (
                    <Center>
                      <Spinner />
                    </Center>
                  )}
                </Stack>
              </>
            )}
          </>
        )}
        <Box mx={"-24px"} px={"24px"} py={"12px"} bg={"brand.blue.100"}>
          <Text
            fontSize={"sm"}
            fontWeight={"semibold"}
            color={"brand.blue.500"}
          >
            Semua
          </Text>
        </Box>
        <Stack py={5} mx={"-24px"}>
          {!countries.isLoading ? (
            isTour ? (
              <CountryList item={countries} />
            ) : isPackage ? (
              <PackageDestinationList item={countries} />
            ) : isInsurance ? (
              <OriginsListInsurance item={countries} />
            ) : (
              <CountryList item={countries} />
              // <NoResults hideButton />
            )
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
        </Stack>
      </>
    );
  };
  return (
    <>
      {isTour ? (
        <>
          <Button
            variant={"unstyled"}
            bg="transparent"
            rounded="full"
            w="full"
            paddingLeft={"30px"}
            border="1px solid"
            // my="auto"
            display={"flex"}
            justifyContent="start"
            alignItems={"center"}
            // justifyContent={"center"}
            borderColor={"brand.blue.400"}
            // opacity={0.6}
            onClick={onOpen}
            textAlign="left"
            fontWeight="normal"
            color="brand.orange.400"
            leftIcon={<SearchIcon />}
          >
            Liburan Kemana?
          </Button>
          <CustomFilterButton
            onOpen={onOpen}
            isOpen={isOpen}
            onClose={onClose}
            placeholder={`Pilih ${placeholder ?? toTitleCase(name)}`}
            title={`Pilih ${placeholder ?? toTitleCase(name)}`}
            label={label}
            value={form.values[field.name]}
            notrounded
          >
            <SearchDrawer />
          </CustomFilterButton>
        </>
      ) : (
        <CustomDropdown
          cusDisclosure={{ isOpen, onOpen, onClose }}
          placeholder={`Pilih ${placeholder ?? toTitleCase(name)}`}
          title={`Pilih ${placeholder ?? toTitleCase(name)}`}
          label={label}
          value={form.values[field.name]}
          notrounded
        >
          <SearchDrawer />
        </CustomDropdown>
      )}
    </>
  );
};
export const CalendarForm = ({ value, f, form, toString = false }) => {
  const formValuesDate = toString
    ? value.length === 0
      ? ""
      : new Date(value)
    : value;

  return (
    <CustomDropdown
      title={f.label}
      value={formValuesDate}
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
            {/* <DropIcon /> */}
            <Text fontSize={{ base: "sm", md: "md" }}>
              {formValuesDate.length === 0
                ? `Pilih ${f.label}`
                : date(formValuesDate, "iii, dd MMM yyyy")}
            </Text>
          </HStack>
        </Flex>
      }
    >
      <Stack spacing={"24px"}>
        <CustomCalendar
          // minDate={new Date()}
          value={formValuesDate}
          onChange={(values) => {
            if (toString)
              form.setFieldValue(f.name, date(values, "yyyy-MM-dd"), true);
            else form.setFieldValue(f.name, values, true);
          }}
        />
      </Stack>
    </CustomDropdown>
  );
};
