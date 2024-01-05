import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  ListItem,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  UnorderedList,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import Image from "next/image";
import React, { useEffect } from "react";
import { CustomFilterButton, CustomOrangeFullWidthButton } from "../../button";
import CustomCalendar from "../../calendar";
import { CustomDropdown } from "../../dropdown";
import DropIcon from "../../../../public/svg/icons/drop.svg";
import LocationIcon from "../../../../public/svg/icons/location.svg";
import { CustomTags, CustomTagsOutlineIcon } from "../../tags";
import { convertRupiah, percentage } from "../../../helpers";
import _ from "underscore";
import * as Yup from "yup";
import date from "../../../helpers/date";
import { useQuery } from "@tanstack/react-query";
import { getAttractionsProductTypeDetailsPriceListByDate } from "../../../services/attraction.service";
import { useDispatch } from "react-redux";
import { checkoutData } from "../../../state/attraction/attraction.slice";
import { useRouter } from "next/router";
import { useLoginToast } from "../../../hooks";

export const Detail = ({ ticket, attraction, query, id, type, index }) => {
  const { itinerary } = attraction;
  const { title, address, description, uuid } = ticket;
  // console.log('itemku', type)
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const Total = Total(item, attraction, uuid, participantsKeyObject);
  const allowedParticipants = ticket.ticketTypes.filter((item) => {
    return item.allowed;
  });
  const participantsObject = _.indexBy(allowedParticipants, "type");
  const participantsKeyObject = Object.keys(participantsObject);
  const total =
    attraction?.minPrice?.[index] +
    percentage(attraction?.minPrice?.[index], ticket?.adultRecommendedMarkup);
  const dispatch = useDispatch();
  const router = useRouter();
  // console.log(attraction, "attraction");
  // console.log(ticket, "ticket");
  const [ticketByDate, setTicketByDate] = React.useState({});
  const [totalTicketByDate, setTotalTicketByDate] = React.useState(0);

  // Time Slot
  function transformTimeslots(timeslots) {
    return timeslots.map(slot => {
        const startTime = slot.startTime.substring(0, 5);
        const endTime = slot.endTime.substring(0, 5);
        const timeLabel = `${startTime} - ${endTime}`;

        return {
            uuid: slot.uuid,
            timeLabel: timeLabel
        };
    });
  }

  let transformedArray = transformTimeslots(type?.data?.timeslots);
  // console.log('itemku', type?.data?.timeslots)
  if(transformedArray?.length === 0) {
    transformedArray = null
  }

  // console.log('itemku10', transformedArray)

  const handleTicketByDate = (date) => {
    setTicketByDate(date);
  };

  const handleTotalTicketByDate = (total) => {
    setTotalTicketByDate(total);
  };

  const handleOrderAttractions = (ticketId, values) => {
    const convertDate = values && date(values?.departure_date, "yyyy-MM-dd");
    // const qs = require("qs");
    // const query = qs.stringify(
    //   { ...form.values, departure_date: convertDate, ticketId },
    //   { encodeValuesOnly: true }
    // );
    try {
      dispatch(
        checkoutData({
          attractionDetail: {
            ...values,
            participants: {
              ...(values?.participants?.adult && {
                adults: values?.participants?.adult,
              }),
              ...(values?.participants?.child && {
                children: values?.participants?.child,
              }),
              ...(values?.participants?.youth && {
                youth: values?.participants?.youth,
              }),
              ...(values?.participants?.infant && {
                infants: values?.participants?.infant,
              }),
              ...(values?.participants?.senior && {
                seniors: values?.participants?.senior,
              }),
            },
            departure_date: convertDate,
            ticketId,
            productTypes: ticket,
            timeSlot: values?.timeSlot,
            totalPrice: totalTicketByDate,
            // ticketDetail: data,
            ticketDetail: ticketByDate,
            attraction: attraction,
          },
        })
      );
      router.push(`/attractions/order-details`);
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date();
  const todayDate = date(today, "yyyy-MM-dd");
  return (
    <>
      <Box>
        <Heading fontSize={"md"} color={"neutral.text.high"}>
          {type.data.title}
        </Heading>
      </Box>
      <Divider variant={"dashed"} />
      <Flex justifyContent={"space-between"} alignItems="flex-end">
        <Box>
          {/* <Text color={"neutral.text.low"} fontSize={"xs"}>
            Mulai Dari
          </Text>
          <Text fontWeight={"bold"} color="brand.orange.400">
            IDR{" "}
            {convertRupiah(
              (total > ticket?.adultGateRatePrice
                ? total
                : ticket?.adultGateRatePrice
              ).toFixed()
            )}{" "}
            <Text
              fontSize={"xs"}
              fontWeight="normal"
              color={"neutral.text.low"}
              as="span"
            >
              /Pax
            </Text>
          </Text> */}
        </Box>
        <CustomOrangeFullWidthButton
          onClick={ticket.firstAvailabilityDate != false ? onOpen : null}
          w="fit-content"
          fontWeight="normal"
          disabled={ticket.firstAvailabilityDate == false ? true : false}
          style={
            ticket.firstAvailabilityDate == false
              ? { opacity: 0.5, cursor: "not-allowed" }
              : { opacity: 1 }
          }
        >
          {ticket.firstAvailabilityDate == false ? "Habis" : "Pilih"}
        </CustomOrangeFullWidthButton>
        <Formik
          onSubmit={(values) => {
            handleOrderAttractions(ticket.uuid, values);
          }}
          initialValues={{
            departure_date:
              ticket.firstAvailabilityDate == false
                ? new Date(todayDate)
                : new Date(ticket.firstAvailabilityDate),
            participants: _.mapObject(participantsObject, (item, index) => {
              return item.min;
            }),
            ticketId: ticket.uuid,
            uuid: id,
          }}
          validationSchema={Yup.object().shape({
            departure_date: Yup.date().required("Tanggal harus diisi"),
            // participants: Yup.object({
            //   adults: Yup.number()
            //     .min(1, "Peserta dewasa harus diisi")
            //     .required("Peserta dewasa harus diisi"),
            //   children: Yup.number().notRequired(),
            // }),
            participants: Yup.object(
              _.mapObject(participantsObject, (participant, index) => {
                // console.log(
                //   "🚀 ~ file: index.js:126 ~ _.mapObject ~ participant",
                //   participant
                // );
                return Yup.number()
                  .min(participant.min, "Peserta harus diisi")
                  .max(participant.max, "Jumlah peserta melebihi batas")
                  .required("Peserta harus diisi");
              })
            ),
            ticketId: Yup.string().required(),
            uuid: Yup.string().required(),
          })}
        >
          {(formik) => (
            <CustomFilterButton
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              notrounded
              title={"Detail Paket"}
              // footer={() => {
              //   if (formRef.current) return <Total form={formRef} />;
              // }}
              hidefooter={
                formik.values.participants.adults +
                  formik.values.participants.children ===
                0
              }
              footer={
                <Total
                  ticket={ticket}
                  attraction={attraction}
                  participantsKeyObject={participantsKeyObject}
                  uuid={uuid}
                  handleTicketByDate={handleTicketByDate}
                  handleTotalTicketByDate={handleTotalTicketByDate}
                />
              }
            >
              <Box py={"24px"}>
                <Heading fontSize={"2xl"}>
                  {title ?? "Tidak ada Nama Tempat"}
                </Heading>
                <Text fontSize={"xs"}>
                  {attraction.address ?? "Tidak ada alamat"}
                </Text>
              </Box>
              <Box py={"24px"} bg="brand.blue.100" mx={"-24px"} px={"24px"}>
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
                          {({ form }) => (
                            <>
                              <FormControl
                                isInvalid={form.errors?.departure_date}
                              >
                                <FormLabel
                                  color={"brand.blue.400"}
                                  fontWeight={"bold"}
                                  fontSize={{ base: "md", md: "lg" }}
                                >
                                  Pilih Tanggal
                                </FormLabel>
                                <FormHelperText mb={"5px"}></FormHelperText>
                                <FormErrorMessage>
                                  {form.errors?.departure_date}
                                </FormErrorMessage>
                                {/* <ErrorMessage name=`participants.${item}` /> */}
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
                                        <Text
                                          fontWeight={"bold"}
                                          color={"brand.blue.400"}
                                        >
                                          {form.values.departure_date !== false
                                            ? date(
                                                form.values.departure_date,
                                                "iii, dd MMM yyyy"
                                              )
                                            : date(
                                                new Date(todayDate),
                                                "iii, dd MMM yyyy"
                                              )}
                                          {/* {departure_date.map((item) => {
                                        if (
                                          form.values.departure_date ==
                                          item.id?.toString()
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
                                    <CustomCalendar
                                      maxDate={
                                        new Date(
                                          attraction.priceList?.[0]?.[
                                            attraction.priceList?.[0]?.length -
                                              1
                                          ].date
                                        )
                                      }
                                      minDate={
                                        new Date(
                                          ticket.firstAvailabilityDate
                                        ) ??
                                        new Date(
                                          attraction.priceList?.[0]?.[0].date
                                        )
                                      }
                                      value={form.values.departure_date}
                                      onChange={(date) => {
                                        form.setFieldValue(
                                          "departure_date",
                                          date,
                                          false
                                        );
                                      }}
                                    />
                                  </Stack>
                                </CustomDropdown>
                              </FormControl>
                            </>
                          )}
                        </Field>
                      </Stack>
                    </Stack>
                    {
                      transformedArray && (
                        <Stack direction={"row"}>
                          <Flex
                            flexDirection={"column"}
                            alignItems={"center"}
                            position={"relative"}>
                            <Circle size={2} bg={"brand.blue.400"} />
                            <Divider
                              my={1}
                              orientation="vertical"
                              variant={"dashed"}
                              borderColor={"brand.blue.400"}
                            />
                          </Flex>
                          <Stack flexGrow={1} mb={4}>
                            <Text
                              color={"brand.blue.400"}
                              fontWeight={"bold"}
                              fontSize={{ base: "md", md: "lg" }}>
                              Sesi Waktu
                            </Text>
                            <Field name="timeSlot">
                              {({ field, form }) => {
                                // console.log('itemku11', field, form.values)                                
                                return (
                                  <FormControl >
                                    <CustomDropdown
                                      responsive
                                      bg={"white"}
                                      title={"Pilih Sesi Waktu"}
                                      // placeholder={"Pilih time slot"}
                                      value={form.values.timeSlot}
                                      label={
                                        transformedArray?.map((item) => {
                                          if (form.values?.timeSlot === item.uuid) {
                                            return item.timeLabel;
                                          }
                                          return null; 
                                        })?.every(item => item === null) ? "Pilih Sesi Waktu":
                                        transformedArray?.map((item) => {
                                          if (form.values?.timeSlot === item.uuid) {
                                            return item.timeLabel;
                                          }
                                        }) 
                                      }>
                                      <RadioGroup
                                        onChange={() => form.setFieldValue("timeSlot", "")}
                                        value={form.values?.timeSlot}
                                      >
                                        <Stack spacing={5} py={5}>
                                          {transformedArray &&
                                            transformedArray?.map((item, index) => {
                                              // console.log('itemku12', form.values?.timeSlot, item.uuid, form.values?.timeSlot === item.uuid)
                                              return (
                                                <>
                                                  {
                                                    <Radio
                                                      {...field}
                                                      flexDirection={"row-reverse"}
                                                      colorScheme={"brand.blue"}
                                                      justifyContent={"space-between"}
                                                      key={index}
                                                      value={item.uuid}
                                                      isChecked={form.values?.timeSlot === item.uuid}
                                                    >
                                                      {item.timeLabel}
                                                    </Radio>
                                                  }
                                                </>
                                              )
                                            }
                                          )}
                                        </Stack>
                                      </RadioGroup>
                                    </CustomDropdown>
                                  </FormControl>
                                )
                              }
                              }
                            </Field>
                          </Stack>
                        </Stack>
                      )
                    }
                    <Stack direction={"row"}>
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
                          fontWeight={"bold"}
                          fontSize={{ base: "md", md: "lg" }}
                        >
                          Jumlah Pengunjung
                        </Text>
                        <SimpleGrid
                          columns={[1, 2]}
                          direction={"row"}
                          spacing={"18px"}
                        >
                          {participantsKeyObject.map((key, index) => (
                            <Field key={index} name={`participants.${key}`}>
                              {({ form }) => {
                                return (
                                  <FormControl
                                    isInvalid={form.errors.participants?.[key]}
                                  >
                                    <FormLabel
                                      fontSize={{ base: "xs", md: "sm" }}
                                      color={"neutral.text.low"}
                                      textTransform={"capitalize"}
                                    >
                                      {key} (
                                      {`${participantsObject[key].minAge}
                                    - ${participantsObject[key].maxAge}
                                    tahun`}
                                      )
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
                                          <Text>
                                            {form.values.participants?.[key]}
                                          </Text>
                                        </Flex>
                                      }
                                    >
                                      <Stack spacing={5} py={5}>
                                        <Flex
                                          justifyContent={"space-between"}
                                          alignItems={"center"}
                                        >
                                          <Text textTransform={"capitalize"}>
                                            {key}
                                          </Text>
                                          <HStack spacing={5}>
                                            <Button
                                              disabled={
                                                form.values.participants[
                                                  key
                                                ] === 0
                                              }
                                              variant={"solid"}
                                              colorScheme={"brand.blue"}
                                              onClick={() => {
                                                if (
                                                  form.values.participants[
                                                    key
                                                  ] > 0
                                                ) {
                                                  form.setFieldValue(
                                                    `participants.${key}`,
                                                    form.values.participants[
                                                      key
                                                    ] - 1,
                                                    true
                                                  );
                                                }
                                              }}
                                            >
                                              -
                                            </Button>
                                            <Text>
                                              {form.values.participants?.[key]}
                                            </Text>
                                            <Button
                                              variant={"solid"}
                                              colorScheme={"brand.blue"}
                                              onClick={() => {
                                                form.setFieldValue(
                                                  `participants.${key}`,
                                                  form.values.participants[
                                                    key
                                                  ] + 1,
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
                                    <FormErrorMessage>
                                      {form.errors?.participants?.[key]}
                                    </FormErrorMessage>
                                  </FormControl>
                                );
                              }}
                            </Field>
                          ))}
                          
                          {/* <Field name={"participants.children"}>
                          {({ form }) => (
                            <FormControl>
                              <FormLabel
                                fontSize={{ base: "xs", md: "sm" }}
                                color={"neutral.text.low"}
                              >
                                Anak-anak (4-12 tahun)
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
                                    <Text>
                                      {form.values.participants.children}
                                    </Text>
                                  </Flex>
                                }
                              >
                                <Stack spacing={5} py={5}>
                                  <Flex
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                  >
                                    <Text>{"Dewasa"}</Text>
                                    <HStack spacing={5}>
                                      <Button
                                        disabled={
                                          form.values.participants?.[item] ===
                                          0
                                        }
                                        variant={"solid"}
                                        colorScheme={"brand.blue"}
                                        onClick={() => {
                                          if (
                                            form.values.participants?.[item] >
                                            0
                                          ) {
                                            form.setFieldValue(
                                              `participants.${item}`,
                                              form.values.participants
                                                .adults - 1,
                                              false
                                            );
                                          }
                                        }}
                                      >
                                        -
                                      </Button>
                                      <Text>
                                        {form.values.participants?.[item]}
                                      </Text>
                                      <Button
                                        variant={"solid"}
                                        colorScheme={"brand.blue"}
                                        onClick={() => {
                                          form.setFieldValue(
                                            `participants.${item}`,
                                            form.values.participants?.[item] +
                                              1,
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
                                    <Text>{"Anak"}</Text>
                                    <HStack spacing={5}>
                                      <Button
                                        variant={"solid"}
                                        colorScheme={"brand.blue"}
                                        onClick={() => {
                                          if (
                                            form.values.participants
                                              .children > 0
                                          ) {
                                            form.setFieldValue(
                                              "participants.children",
                                              form.values.participants
                                                .children - 1,
                                              false
                                            );
                                          }
                                        }}
                                      >
                                        -
                                      </Button>
                                      <Text>
                                        {form.values.participants.children}
                                      </Text>
                                      <Button
                                        variant={"solid"}
                                        colorScheme={"brand.blue"}
                                        onClick={() => {
                                          form.setFieldValue(
                                            "participants.children",
                                            form.values.participants
                                              .children + 1,
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
                        </Field> */}
                        </SimpleGrid>
                      </Stack>
                    </Stack>
                  </Stack>
                </Form>
              </Box>
              <Box py={"24px"}>
                <Accordion allowMultiple mx={"-24px"}>
                  {description && (
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"md"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Detail Tiket
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"10px"} as={"section"}>
                          <Text fontSize={"sm"}>{description}</Text>
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                  <AccordionItem border={0} pb={"12px"}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Heading
                          fontSize={"md"}
                          color={"brand.blue.400"}
                          as={"h2"}
                        >
                          Detail Harga
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel py={"16px"}>
                      <Stack spacing={"10px"} as={"section"}>
                        <PriceDetails uuid={uuid} ticket={ticket} />
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                  {itinerary ? (
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"md"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Jadwal Aktivitas
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"10px"} as={"section"}>
                          <Text
                            dangerouslySetInnerHTML={{
                              __html: itinerary.replace(
                                /(\r\n|\r|\n)/g,
                                "<br>"
                              ),
                            }}
                          />
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  ) : (
                    <></>
                  )}
                  {ticket.cancellationPolicySummary ? (
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"md"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Cancel Policy Summary
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"10px"} as={"section"}>
                          <Box
                            dangerouslySetInnerHTML={{
                              __html: ticket.cancellationPolicySummary,
                            }}
                          />
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  ) : (
                    <></>
                  )}
                  {ticket.cancellationPolicies.length !== 0 ? (
                    <AccordionItem hidden border={0} pb={"12px"}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"md"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Cancel Policies
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"10px"} as={"section"}>
                          <UnorderedList>
                            {ticket.cancellationPolicies.map(
                              (parentItem, parentIndex) => (
                                <>
                                  {Object.keys(parentItem).map(
                                    (item, index) => (
                                      <ListItem key={index}>{`${
                                        Object.keys(parentItem)[index]
                                      }: ${
                                        Object.values(parentItem)[index]
                                      }`}</ListItem>
                                    )
                                  )}
                                </>
                              )
                            )}
                          </UnorderedList>
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  ) : (
                    <></>
                  )}
                  <AccordionItem border={0} pb={"12px"}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Heading
                          fontSize={"md"}
                          color={"brand.blue.400"}
                          as={"h2"}
                        >
                          Voucher
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel py={"16px"}>
                      <Stack spacing={"12px"} as={"section"}>
                        <Stack spacing={"12px"}>
                          <Wrap>
                            {!ticket.nonInstantVoucher ? (
                              <CustomTags
                                variant={"subtle"}
                                colorScheme={"brand.blue"}
                                fontSize={"sm"}
                              >
                                Voucher akan dikirim oleh pengelola
                              </CustomTags>
                            ) : (
                              <></>
                            )}
                            {ticket.voucherRequiresPrinting ? (
                              <CustomTags fontSize={"sm"}>
                                Tidak Perlu Dicetak
                              </CustomTags>
                            ) : (
                              <CustomTags fontSize={"sm"}>
                                Perlu Dicetak
                              </CustomTags>
                            )}
                          </Wrap>
                          <Text fontSize={"sm"}>{ticket?.voucherUse}</Text>
                        </Stack>
                        {ticket?.voucherRedemptionAdress ? (
                          <Stack spacing={"12px"}>
                            <Heading fontSize={"sm"}>
                              {" "}
                              Redemption Address
                            </Heading>
                            <Text fontSize={"sm"}>
                              {ticket?.voucherRedemptionAdress}
                            </Text>
                          </Stack>
                        ) : (
                          <></>
                        )}
                        {/* <Box dangerouslySetInnerHTML={{__html: attraction.cancellationPolicySummary}}/> */}
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem border={0} pb={"12px"}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Heading
                          fontSize={"md"}
                          color={"brand.blue.400"}
                          as={"h2"}
                        >
                          Meeting
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel py={"16px"}>
                      <Stack spacing={"12px"} as={"section"}>
                        {ticket.meetingTime ? (
                          <CustomTagsOutlineIcon icon={<LocationIcon />}>
                            {ticket.meetingTime}
                          </CustomTagsOutlineIcon>
                        ) : (
                          <></>
                        )}
                        {ticket.meetingAddress ? (
                          <CustomTagsOutlineIcon icon={<LocationIcon />}>
                            {ticket.meetingAddress}
                          </CustomTagsOutlineIcon>
                        ) : (
                          <></>
                        )}
                        {ticket.meetingLocation ? (
                          <CustomTagsOutlineIcon icon={<LocationIcon />}>
                            {ticket.meetingLocation}
                          </CustomTagsOutlineIcon>
                        ) : (
                          <></>
                        )}
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </CustomFilterButton>
          )}
        </Formik>
      </Flex>
    </>
  );
};
export const Total = ({
  ticket,
  attraction,
  uuid,
  participantsKeyObject,
  handleTicketByDate,
  handleTotalTicketByDate,
}) => {
  // console.log(participantsKeyObject)
  const loginToast = useLoginToast();
  const form = useFormikContext();
  const convertDate = form && date(form?.values?.departure_date, "yyyy-MM-dd");
  const availablePrice = useQuery(
    ["ticketByDate", convertDate, uuid],
    async () => {
      const response = await getAttractionsProductTypeDetailsPriceListByDate(
        uuid,
        convertDate
      );
      return Promise.resolve(response);
    }
  );
  const { data, isLoading, isError } = availablePrice;
  const total =
    data && data.available
      ? _.pluck(
          participantsKeyObject.map((item, index) => {
            let type;
            switch (item) {
              case "adult":
                type = "adults";
                break;
              case "child":
                type = "children";
                break;
              case "youth":
                type = "youth";
                break;
              case "infant":
                type = "infants";
                break;
              case "senior":
                type = "seniors";
                break;

              default:
                break;
            }
            const participant = form.values.participants?.[item];
            const pricePerPax = participant * data?.prices?.[type]?.[0];
            const paxMarkup = ticket[`${item}RecommendedMarkup`];
            let total;
            total = pricePerPax;
            //change markup from number to percentage if rekomenedMarkup is more than 100
            // if (ticket[`${item}RecommendedMarkup`] > 100) {
            //   total = pricePerPax + paxMarkup;
            // }
            // if (ticket[`${item}RecommendedMarkup`] < 100) {
            //   total = pricePerPax + percentage(pricePerPax, paxMarkup);
            // }
            // if (participant === 0) total = 0;
            // let GateRatePrice;
            // GateRatePrice = ticket[`${item}GateRatePrice`] * participant;
            // if (participant === 0) GateRatePrice = 0;
            // console.log(participant * data?.prices?.[type]?.[0], 'pricePerPax')
            // console.log(percentage(pricePerPax, paxMarkup))
            return {
              values: total
              // values: total > GateRatePrice ? total : GateRatePrice,
            };
          }),
          "values"
        )
          .reduce((prev, item) => {
            return prev + item;
          })
          .toFixed()
      : 0;
  useEffect(() => {
    if (data) {
      handleTicketByDate(data);
    }
    if (total !== 0) {
      handleTotalTicketByDate(total);
    }
  }, [data, total]);
  const noParticipants =
    _.compact(Object.values(form.values.participants)).length === 0;
  if (!noParticipants)
    return (
      <Flex justifyContent={"space-between"} alignItems="center" w="full">
        <Stack>
          <Text color="neutral.text.low" fontSize={"xs"}>
            Harga Total
          </Text>
          <Skeleton isLoaded={!isLoading}>
            <Text color="brand.orange.400">
              IDR{" "}
              {parseInt(total).toLocaleString("id-ID", {
                maximumFractionDigits: 0,
              })}
            </Text>
          </Skeleton>
        </Stack>
        <Stack>
          <Skeleton isLoaded={!isLoading}>
            <CustomOrangeFullWidthButton
              w="180px"
              mt={0}
              onClick={() =>
                !data?.available || isError ? null : loginToast(form.submitForm)
              }
              disabled={!data?.available || isError || !form.isValid}
              style={
                !data?.available || isError || !form.isValid
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : { opacity: 1 }
              }
              // onClick={() => handleOrderAttractions(uuid)}
            >
              {!data?.available || isError ? "Habis" : "Pesan"}
            </CustomOrangeFullWidthButton>
          </Skeleton>
        </Stack>
      </Flex>
    );
  else return <></>;
};
export const PriceDetails = ({ ticket, uuid }) => {
  const form = useFormikContext();
  const convertDate = form && date(form?.values?.departure_date, "yyyy-MM-dd");

  const availablePrice = useQuery(
    ["ticketByDate", convertDate, uuid],
    async () => {
      const response = await getAttractionsProductTypeDetailsPriceListByDate(
        uuid,
        convertDate
      );
      return Promise.resolve(response);
    }
  );
  const { data, isLoading, isError } = availablePrice;
  return (
    <TableContainer>
      <Table mx={"-15px"} variant="unstyled" size={"sm"}>
        <Tbody>
          {ticket.ticketTypes
            .filter((item) => {
              return item.allowed;
            })
            .map((item, i) => {
              let type;
              switch (item.type) {
                case "adult":
                  type = "adults";
                  break;
                case "child":
                  type = "children";
                  break;
                case "youth":
                  type = "youth";
                  break;
                case "infant":
                  type = "infants";
                  break;
                case "senior":
                  type = "seniors";
                  break;
                default:
                  break;
              }
              const paxMarkup = ticket[`${item.type}RecommendedMarkup`];
              let perPaxPrice = data?.prices?.[type]?.[0];
              // if (ticket[`${item.type}RecommendedMarkup`] > 100) {
              //   perPaxPrice = data?.prices?.[type]?.[0] + paxMarkup;
              // }
              // if (ticket[`${item.type}RecommendedMarkup`] < 100) {
              //   perPaxPrice =
              //     data?.prices?.[type]?.[0] +
              //     percentage(data?.prices?.[type]?.[0], paxMarkup);
              // }
              return (
                <Tr key={i}>
                  <Td>
                    {item.type === "adult"
                      ? "Dewasa"
                      : item.type === "child"
                      ? "Anak"
                      : item.type === "infant"
                      ? "Bayi"
                      : item.type}{" "}
                    / pax
                  </Td>
                  <Td p={0} textAlign={"right"}>
                    <Skeleton isLoaded={!isLoading}>
                      <Text>
                        {
                          isError
                            ? "Error"
                            : ( !perPaxPrice
                            ? 0
                            :
                              // (perPaxPrice > ticket[`${item.type}GateRatePrice`]
                              //   ? perPaxPrice
                              //   : ticket[`${item.type}GateRatePrice`]
                              // )
                              perPaxPrice.toLocaleString("id-ID", {
                                maximumFractionDigits: 0,
                              })
                            )
                        }
                      </Text>
                    </Skeleton>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
