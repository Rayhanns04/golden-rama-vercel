import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Checkbox,
  Circle,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ListItem,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  Badge,
  UnorderedList,
  VStack,
  keyframes,
  useDisclosure,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";
import {
  getAllPromoList,
  getPromoList,
  getPromoListTour,
  postPromoUniqueCode,
} from "../../services/promo.service";
import { resendEticket } from "../../services/flight.service";
import { CustomDivider } from "../divider";
import { CustomFilterButton } from "../button";
import { CustomDropdown } from "../dropdown";
import { CustomOrangeFullWidthButton } from "../button";
import { convertDateWithMonthName, travelerType } from "../../helpers";
import GlobalForm from "../person";
import MailIcon from "../../../public/svg/icons/mail.svg";
import ExpandArrowIcon from "../../../public/svg/icons/expand-arrow.svg";
import { convertRupiah } from "../../helpers";
import countries from "../../mocks/countries.json";
import date from "../../helpers/date";
import { useSelector } from "react-redux";

const ListDetail = ({ details, isLackField, status = null }) => {
  const router = useRouter();
  return (
    <Box mx={{ base: "-24px", md: 0 }} px="24px">
      {details?.map((item, index) => (
        <Box key={index}>
          <Box py="24px">
            <HStack justifyContent="space-between">
              <Text fontFamily="heading" fontWeight="bold" mb="16px">
                {item.title}
              </Text>
              <Text fontSize="xs">{item.tag}</Text>
            </HStack>
            <Stack spacing="6px">
              {item.details.map((detail, index) =>
                Array.isArray(detail) ? (
                  <Stack
                    key={index}
                    spacing="6px"
                    py="16px"
                    borderTop="1px dashed #e9e9e9"
                  >
                    {detail.map((d, i) => (
                      <Detail
                        key={i}
                        {...d}
                        isLackField={isLackField}
                        status={status}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Detail
                    key={index}
                    {...detail}
                    isLackField={isLackField}
                    status={status}
                  />
                )
              )}
            </Stack>
          </Box>
          {index !== details.length - 1 && (
            <Box bg="brand.blue.100" h="8px" mx="-24px" />
          )}
        </Box>
      ))}
    </Box>
  );
};

const Detail = ({
  label,
  value,
  bold,
  green,
  add_space,
  title,
  opacity,
  resend_email,
  email,
  people,
  customer,
  handlePromo,
  handleChange,
  handleTraveler,
  requestsState,
  remarks,
  category,
  isPromoAvailable,
  isLackField,
  status,
}) => {
  const { query } = useRouter();
  const [input, setInput] = useState(email || "");
  const router = useRouter();
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );
  const { jwt } = useSelector((s) => s.authReducer);
  const toast = useToast();
  const sendEtiket = async () => {
    const result = await resendEticket(
      {
        orderNumber: query?.id,
        email: input,
      },
      jwt
    );
    if (result.status) {
      toast({
        title: "E-ticket berhasil dikirim",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "E-ticket gagal dikirim",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const { isLoggedIn, user } = useSelector((s) => s.authReducer);
  const users = {
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
  };
  return title ? (
    <Text
      color="neutral.text.high"
      fontSize="sm"
      fontWeight="bold"
      textTransform="uppercase"
      mb="16px"
    >
      {title}
    </Text>
  ) : resend_email && status?.title === "Status Aktif" ? (
    <Stack spacing="16px">
      <Text fontSize="xs">
        Tidak menerima e-ticket dan invoice, kirim ulang ke email
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <MailIcon />
        </InputLeftElement>
        <Input value={input} colorScheme="gray" variant="filled" disabled />
        <InputRightElement>
          <Text
            cursor="pointer"
            pr="16px"
            color="brand.blue.500"
            fontSize="sm"
            fontWeight="bold"
            onClick={() => sendEtiket()}
          >
            Kirim
          </Text>
        </InputRightElement>
      </InputGroup>
    </Stack>
  ) : handlePromo ? (
    <Stack>
      <DrawerPromo handlePromo={handlePromo} category={category} />
      {isPromoAvailable && isPromoAvailable.available ? (
        <Text fontSize={{ base: "sm", md: "md" }} color="green">
          Anda mendapatkan diskon IDR{" "}
          {convertRupiah(isPromoAvailable.totalDiscount)}
        </Text>
      ) : isPromoAvailable &&
        isPromoAvailable?.error?.message == "Promo code is already used" ? (
        <Text fontSize={{ base: "sm", md: "md" }} color="alert.failed">
          Promo tidak dapat kamu gunakan lagi
        </Text>
      ) : isPromoAvailable &&
        isPromoAvailable?.error?.message ==
          "This promo is only for specified product" ? (
        <Text fontSize={{ base: "sm", md: "md" }} color="alert.failed">
          Promo hanya untuk produk tertentu
        </Text>
      ) : isPromoAvailable &&
        isPromoAvailable?.error?.message == "promo code expired" ? (
        <Text fontSize={{ base: "sm", md: "md" }} color="alert.failed">
          Promo sudah kadaluarsa
        </Text>
      ) : isPromoAvailable &&
        isPromoAvailable?.error?.message == "Promo code is over" ? (
        <Text fontSize={{ base: "sm", md: "md" }} color="alert.failed">
          Promo sudah habis digunakan
        </Text>
      ) : isPromoAvailable &&
        isPromoAvailable?.error?.message ==
          "Total transaction lower than minimum transaction" ? (
        <Text fontSize={{ base: "sm", md: "md" }} color="alert.failed">
          Total transaksi anda masih belum mencukupi untuk menggunakan promo ini
        </Text>
      ) : (
        isPromoAvailable &&
        isPromoAvailable.available == false && (
          <Text fontSize={{ base: "sm", md: "md" }} color="alert.failed">
            Promo tidak bisa digunakan
          </Text>
        )
      )}
    </Stack>
  ) : handleChange ? (
    <Box as={"section"}>
      <Box py={"24px"} bg={"white"}>
        <HStack w="full" justifyContent="space-between">
          <Text
            as={Heading}
            fontSize={{ base: "lg", md: "md" }}
            fontWeight="semibold"
          >
            Informasi Kontak
          </Text>
        </HStack>
        <Text fontSize={{ base: "sm", md: "md" }} color="neutral.text.medium">
          Pastikan semua data yang anda berikan benar dan bisa di hubungi.
        </Text>
        <Box>
          <Stack spacing={5} pt={6}>
            <Divider variant={"dashed"} />
            {[
              { l: "fullName", n: "Nama Lengkap", t: "text", r: true },
              { l: "email", n: "Email", t: "email", r: true },
              { l: "phone", n: "Nomor Telepon", t: "tel", r: true },
            ].map((item, index) => (
              <FormControl key={index} isRequired={item.r}>
                <FormLabel
                  htmlFor={item.l}
                  fontSize={{ base: "xs", md: "sm" }}
                  color="neutral.text.medium"
                >
                  {item.n}
                </FormLabel>
                <Input
                  py={"15px"}
                  id={item.l}
                  name={item.l}
                  type={item.t}
                  color={"neutral.text.high"}
                  placeholder={`Isi ${item.n}`}
                  variant="filled"
                  fontSize={{ base: "xs", md: "sm" }}
                  onChange={(e) => handleChange(e, "customer")}
                  value={isLoggedIn ? users[item.l] : null}
                  disabled={isLoggedIn}
                />
              </FormControl>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  ) : handleTraveler ? (
    <Box as={"section"}>
      <Box py={"24px"} bg={"white"}>
        <HStack w="full" justifyContent="space-between">
          <Text
            as={Heading}
            fontSize={{ base: "lg", md: "md" }}
            fontWeight="semibold"
          >
            Detail Tamu
          </Text>
        </HStack>
        <Box>
          <Divider variant={"dashed"} />
          <FormControl
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={4}
          >
            <FormLabel
              htmlFor="same-data"
              fontSize={{ base: "sm", md: "md" }}
              color="neutral.text.medium"
            >
              Sama dengan data pemesan
            </FormLabel>
            <Switch
              id="same-data"
              colorScheme="brand.blue"
              size="lg"
              onChange={(e) => {
                const defaultData = {
                  i: 0,
                  key: 0,
                  paxType: "ADT",
                };
                if (e.target.checked) {
                  handleTraveler({
                    ...defaultData,
                    title: user.title || "Mrs",
                    fullname: isLoggedIn ? user.full_name : customer.fullName,
                  });
                } else {
                  handleTraveler(defaultData);
                }
              }}
            />
          </FormControl>
          {people &&
            people.map((person, index) => (
              <Stack
                direction={"row"}
                justifyContent="space-between"
                w={"full"}
                key={index}
                alignItems="center"
                py={2}
              >
                <VStack alignItems="start">
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color={person ? "inherit" : "red.400"}
                    fontWeight="semibold"
                    textTransform="uppercase"
                  >
                    {person.fullname ?? "belum ada"}
                  </Text>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color="neutral.text.medium"
                  >
                    {travelerType(person.paxType)} {person.i + 1}
                  </Text>
                </VStack>
                <Box>
                  <FormPerson
                    item={person}
                    handleTraveler={handleTraveler}
                    index={index}
                    title={"Tamu"}
                    isLackField={isLackField}
                  />
                </Box>
              </Stack>
            ))}
        </Box>
      </Box>
    </Box>
  ) : remarks ? (
    <RequestForm requestsState={requestsState} remarks={remarks} />
  ) : (
    <HStack
      justifyContent="space-between"
      pt={add_space ? "10px" : 0}
      opacity={opacity || "100%"}
    >
      <Text
        fontSize="sm"
        fontWeight={bold?.includes("label") ? "bold" : "normal"}
        color={green?.includes("label") ? "green.500" : "inherit"}
      >
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={bold?.includes("value") ? "bold" : "normal"}
        color={green?.includes("value") ? "green.500" : "inherit"}
      >
        {value}
      </Text>
    </HStack>
  );
};

const TNCDrawer = ({ html }) => {
  const drawerRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        color="brand.blue.400"
        w="fit-content"
        px={0}
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="semibold"
        variant="ghost"
        onClick={onOpen}
      >
        Lihat Syarat dan Ketentuan
      </Button>
      <CustomFilterButton
        drawer={drawerRef}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={"Syarat dan Ketentuan"}
        hidefooter
        notrounded
      >
        <Box py="16px">
          <Text
            as={"div"}
            fontSize={"sm"}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        </Box>
      </CustomFilterButton>
    </>
  );
};

export const DrawerPromo = ({ handlePromo, category }) => {
  const drawerRef = useRef();
  const [selected, setSelected] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mutation = useMutation(postPromoUniqueCode, {
    onSuccess: (data) => {},
    onError: (error) => {
      console.log(error);
    },
  });
  const handleSubmit = (values, action) => {
    const { promo } = values;
    return mutation.mutateAsync(values).catch((error) => {
      action.setFieldError("promo", "Promo tidak bisa digunakan");
    });
  };
  const { data, isLoading } = useQuery(["getPromos"], async () => {
    const response = await getAllPromoList(category);
    return Promise.resolve(response);
  });
  return (
    <>
      <HStack
        as={Button}
        justifyContent="space-between"
        alignItems="center"
        py="16px"
        height={"full"}
        bg="brand.blue.100"
        borderRadius="4px"
        onClick={onOpen}
      >
        <HStack alignItems="center">
          <Image
            src="/svg/nav/products.svg"
            alt="products"
            width={24}
            height={24}
          />
          <Text
            fontWeight={"normal"}
            fontSize={{ base: "lg", md: "md" }}
            color={!selected && "neutral.text.low"}
            textTransform={selected && "uppercase"}
          >
            {selected ?? "Masukkan Kode Promo"}
          </Text>
        </HStack>
        <Button
          // as={Button}
          variant={"unstyled"}
          fontSize={{ base: "sm", md: "md" }}
          color="brand.blue.400"
        >
          Terapkan
        </Button>
      </HStack>
      <CustomFilterButton
        drawer={drawerRef}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={"Pilih Promo"}
        notrounded
      >
        <Box py="16px">
          <Formik
            initialValues={{ code: "", category: category }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object({
              code: Yup.string().required("Kode Promo harus diisi"),
            })}
          >
            <Form>
              <Field name="code">
                {({ field, form }) => (
                  <InputGroup size="lg">
                    <InputLeftElement>
                      <Image
                        src="/svg/nav/products.svg"
                        alt="products"
                        width={24}
                        height={24}
                      />
                    </InputLeftElement>
                    <Input
                      {...field}
                      disabled={mutation.isLoading}
                      type="text"
                      variant="filled"
                      placeholder="Masukkan kode promo"
                    />
                    <InputRightElement w="fit-content" px="8px">
                      <Button
                        isLoading={mutation.isLoading}
                        disabled={mutation.isLoading}
                        type="submit"
                        mx={"12px"}
                        variant={"unstyled"}
                        fontSize={{ base: "sm", md: "md" }}
                        color="brand.blue.400"
                      >
                        Tambah
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                )}
              </Field>
            </Form>
          </Formik>
        </Box>
        <Stack
          mx="-24px"
          p="24px"
          minH="75vh"
          spacing="12px"
          bg="brand.blue.100"
        >
          {mutation.isSuccess && (
            <HStack
              position="relative"
              bg="white"
              alignItems="center"
              justifyContent="space-between"
              px="25px"
              pt="18px"
              pb="13px"
              onClick={() => {
                setSelected(mutation.data.code);
                handlePromo(mutation.data.code);
              }}
            >
              <Circle
                position="absolute"
                left="-8px"
                size="16px"
                bg="brand.blue.100"
              />
              <Circle
                position="absolute"
                right="-8px"
                size="16px"
                bg="brand.blue.100"
              />
              <Stack spacing={0.75}>
                <Text
                  pt="4px"
                  color="brand.blue.400"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {mutation.data.promo.name}{" "}
                  <Badge colorScheme="green" size="10px">
                    KODE UNIK
                  </Badge>
                </Text>
                <Text fontSize={{ base: "lg", md: "md" }} fontWeight="bold">
                  <Box
                    dangerouslySetInnerHTML={{
                      __html:
                        mutation?.data?.promo?.description ||
                        mutation.data.promo.name,
                    }}
                  />
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="neutral.text.medium"
                >
                  Valid hingga{" "}
                  {convertDateWithMonthName(mutation.data.promo.end_date)}
                </Text>
                <TNCDrawer html={mutation.data.promo?.tnc || ""} />
              </Stack>
              <Radio
                colorScheme="brand.blue"
                isChecked={selected == mutation.data.code}
              />
            </HStack>
          )}
          {!isLoading ? (
            data?.map((item, index) => (
              <HStack
                key={index}
                position="relative"
                bg="white"
                alignItems="center"
                justifyContent="space-between"
                px="25px"
                pt="18px"
                pb="13px"
                onClick={() => {
                  setSelected(item.attributes.code);
                  handlePromo(item.attributes.code);
                }}
              >
                <Circle
                  position="absolute"
                  left="-8px"
                  size="16px"
                  bg="brand.blue.100"
                />
                <Circle
                  position="absolute"
                  right="-8px"
                  size="16px"
                  bg="brand.blue.100"
                />
                <Stack spacing={0.75}>
                  <Text
                    pt="4px"
                    color="brand.blue.400"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {item.attributes.name}
                  </Text>
                  <Text fontSize={{ base: "lg", md: "md" }} fontWeight="bold">
                    <Box
                      dangerouslySetInnerHTML={{
                        __html:
                          item?.attributes?.description || item.attributes.name,
                      }}
                    />
                  </Text>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color="neutral.text.medium"
                  >
                    Valid hingga{" "}
                    {convertDateWithMonthName(item.attributes.end_date)}
                  </Text>
                  <TNCDrawer html={item.attributes?.tnc || ""} />
                </Stack>
                <Radio
                  colorScheme="brand.blue"
                  isChecked={selected === item.attributes.code}
                />
              </HStack>
            ))
          ) : (
            <Spinner></Spinner>
          )}
        </Stack>
      </CustomFilterButton>
    </>
  );
};

const FormPerson = ({
  item,
  handleTraveler,
  index,
  isDomestic = false,
  title = "Data Traveler",
  isLackField,
}) => {
  const drawerRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = {
    i: item.i,
    key: index,
    paxType: item.paxType,
    title: item.title || (item.paxType == "ADT" ? "Mrs" : "Miss"),
    fullname: item.fullname || "",
  };
  const pulseErrorBorder = keyframes`
    0% {
      border-color: #e53e3e;
    }
    50% {
      border-color: #fff;
    }
    100% {
      border-color: #e53e3e;
    }
  `;
  const fields = [
    {
      name: "title",
      label: "Title",
      type: "radio",
      options: item.paxType == "ADT" ? ["Mr", "Mrs", "Ms"] : ["Miss", "Mstr"],
    },
    {
      name: "fullname",
      label: "Nama Lengkap",
      type: "text",
    },
  ];
  const handleSubmit = async (values, actions) => {
    try {
      handleTraveler(values);
      actions.setSubmitting(false);
      await actions.setStatus("Done");
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  };
  return (
    <>
      <Button
        variant={"unstyled"}
        fontSize={{ base: "sm", md: "md" }}
        color="brand.blue.400"
        px={2}
        fontWeight="semibold"
        borderWidth="2px"
        borderColor="transparent"
        animation={
          isLackField
            ? `${pulseErrorBorder} 1s ease-in-out infinite`
            : undefined
        }
        onClick={onOpen}
      >
        {item ? "Ubah" : "Isi Data"}
      </Button>
      <Formik
        validationSchema={Yup.object().shape({
          paxType: Yup.string().required(),
          title: Yup.string().required("Title harap diisi"),
          fullname: Yup.string().required("Nama lengkap harap diisi"),
        })}
        initialValues={form}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, submitForm, status }) => (
          <Form>
            <CustomFilterButton
              notrounded
              drawer={drawerRef}
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              onSubmit={handleSubmit}
              footer={
                <CustomOrangeFullWidthButton
                  isLoading={isSubmitting}
                  // onClose={onClose}
                  type={"submit"}
                  onClick={() => {
                    submitForm().then((val) => {
                      val === true && onClose();
                    });
                  }}
                >
                  Simpan Data Tamu
                </CustomOrangeFullWidthButton>
              }
              title={title}
              // hideFooter
            >
              <Box py="12px">
                <Text fontSize={{ base: "lg", md: "md" }} fontWeight="semibold">
                  Informasi Tamu ({travelerType(item.paxType)})
                </Text>
                <Text color="neutral.text.medium">
                  Pastikan nama lengkap tamu sesuai KTP/SIM/Paspor berlaku.
                </Text>
              </Box>
              <Box py={"24px"}>
                <GlobalForm person={item} fields={fields.slice(0, 1)} />
                <FormControl id="fullname">
                  <FormLabel>Nama Lengkap</FormLabel>
                  <Field
                    as={Input}
                    id="fullname"
                    name="fullname"
                    colorScheme="gray"
                    variant="filled"
                  />
                </FormControl>
              </Box>
            </CustomFilterButton>
          </Form>
        )}
      </Formik>
    </>
  );
};

const RequestForm = ({ requestsState, remarks }) => {
  const [requests, setRequests] = requestsState || [null, null];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const listRemarks = remarks.split(", ");

  return (
    <Box py="24px">
      <Text fontSize={{ base: "lg", md: "md" }} fontWeight="semibold" mb="16px">
        Permintaan Khusus
      </Text>
      <Text fontSize="sm">
        Permintaan khusus bergantung pada ketersediaan di hotel dan tidak dapat
        dijamin
      </Text>
      {requestsState && (
        <>
          <Text
            onClick={onOpen}
            cursor="pointer"
            color="brand.blue.400"
            fontSize="sm"
            fontWeight="bold"
            textAlign="right"
            mt="16px"
          >
            Tambah Permintaan
          </Text>
          <ModalRequest
            isOpen={isOpen}
            onClose={onClose}
            requestsState={requestsState}
          />
        </>
      )}
      <UnorderedList pt="16px" borderTop="1px dashed #e9e9e9">
        {(requests || listRemarks).map((item, index) => (
          <ListItem key={index} fontSize="sm">
            {item}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

const ModalRequest = ({ isOpen, onClose, requestsState }) => {
  const [requests, setRequests] = requestsState;
  const drawerRef = useRef();
  const subDrawerRef = useRef();

  const [form, setForm] = useState({});

  const list = [
    { name: "non-smoking", label: "Kamar Bebas Asap Rokok" },
    { name: "upper-floor", label: "Kamar Lantai Atas" },
    {
      name: "bed-type",
      label: "Tipe Ranjang",
      options: [
        { name: "two", label: "2 Ranjang Single" },
        { name: "one", label: "1 Ranjang Besar" },
      ],
    },
    { name: "check-in", label: "Waktu Check In", type: "time" },
    { name: "check-out", label: "Waktu Check Out", type: "time" },
    { name: "others", label: "Lainnya", type: "text" },
  ];

  const handleSubmit = () => {
    let newArray = [];
    Object.entries(form).forEach(([key, value]) => {
      newArray.push(
        `${list.find((i) => i.name === key).label}${
          typeof value === "boolean" ? "" : ": " + value
        } `
      );
    });
    setRequests(newArray);
  };
  return (
    <CustomFilterButton
      drawer={drawerRef}
      notrounded
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Permintaan Khusus"
      footer="Simpan"
    >
      <Text fontSize={{ base: "lg", md: "md" }} fontWeight="semibold" mb="16px">
        Permintaan Khusus
      </Text>
      <Text fontSize="sm">
        Permintaan khusus bergantung pada ketersediaan di hotel dan tidak dapat
        dijamin
      </Text>
      <Stack spacing="24px" py="24px">
        {list.map((item, index) => (
          <FormControl key={index}>
            <Stack spacing={0} gap="16px" py={0}>
              <Checkbox
                colorScheme="brand.blue"
                isChecked={!!form[item.name]}
                onChange={(e) => {
                  if (e.target.checked) {
                    setForm({ ...form, [item.name]: true });
                  } else {
                    const { [item.name]: _, ...rest } = form;
                    setForm(rest);
                  }
                }}
              >
                {item.label}
              </Checkbox>
              {form[item.name] && item.options && (
                <CustomDropdown
                  drawer={subDrawerRef}
                  title={item.label}
                  placeholder={`Pilih ${item.label}`}
                  footer="Terapkan"
                  value={
                    typeof form[item.name] === "boolean" ? "" : form[item.name]
                  }
                >
                  <RadioGroup
                    onChange={(e) => {
                      setForm({ ...form, [item.name]: e });
                    }}
                    value={form[item.name]}
                  >
                    <Stack spacing="24px">
                      {item.options.map((option, index) => (
                        <Radio key={index} value={option.label}>
                          {option.label}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </CustomDropdown>
              )}
              {form[item.name] && item.type === "time" && (
                <ModalTime
                  drawer={subDrawerRef}
                  item={item}
                  formState={[form, setForm]}
                />
              )}
              {form[item.name] && item.type === "text" && (
                <Textarea
                  colorScheme="gray"
                  variant="filled"
                  placeholder="Tulis permintaan khusus"
                  value={
                    typeof form[item.name] === "string" ? form[item.name] : ""
                  }
                  onChange={(e) =>
                    setForm({ ...form, [item.name]: e.target.value || true })
                  }
                />
              )}
            </Stack>
          </FormControl>
        ))}
      </Stack>
    </CustomFilterButton>
  );
};

const ModalTime = ({ drawer, item, formState }) => {
  const [form, setForm] = formState;
  const hours = Array.from(Array(24).keys());
  const minutes = Array.from(Array(4).keys()).map((i) => i * 15);

  const initial = {
    hour:
      typeof form[item.name] !== "boolean"
        ? parseInt(form[item.name].split(":")[0])
        : 0,
    minute:
      typeof form[item.name] !== "boolean"
        ? parseInt(form[item.name].split(":")[1])
        : 0,
  };

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  const hourHandler = useSwipeable({
    onSwipedUp: () => {
      if (hour < 23) {
        setHour(hour + 1);
      }
    },
    onSwipedDown: () => {
      if (hour > 0) {
        setHour(hour - 1);
      }
    },
  });

  const minuteHandler = useSwipeable({
    onSwipedUp: () => {
      if (minute < 45) {
        setMinute(minute + 15);
      }
    },
    onSwipedDown: () => {
      if (minute > 0) {
        setMinute(minute - 15);
      }
    },
  });

  const handleSubmit = () => {
    const hourStr = hour.toString().padStart(2, "0");
    const minuteStr = minute.toString().padStart(2, "0");
    setForm({ ...form, [item.name]: `${hourStr}:${minuteStr}` });
  };

  const TimeBox = ({ value, time, text, onClick }) => {
    return (
      <Box
        position="relative"
        cursor="pointer"
        w="full"
        h="50px"
        pl="16px"
        py="15px"
        bg={value === time ? "brand.blue.100" : "white"}
        borderRadius="4px"
        onClick={onClick}
        _hover={{ bg: "gray.100" }}
      >
        <Text color="neutral.text.low">
          {value} {text}
        </Text>
        {value === time && (
          <Box position="absolute" right={0} top={0} bottom={0} p="16px">
            <ExpandArrowIcon />
          </Box>
        )}
      </Box>
    );
  };
  return (
    <CustomDropdown
      drawer={drawer}
      title={item.label}
      placeholder={`Pilih ${item.label}`}
      onSubmit={handleSubmit}
      footer="Terapkan"
      value={typeof form[item.name] === "boolean" ? "" : form[item.name]}
    >
      <HStack gap="12px">
        <Stack spacing={0} flexBasis="50%" {...hourHandler}>
          {hours.map(
            (h) =>
              [
                hour - 1 === -1 ? 2 : hour - 1,
                hour,
                hour + 1 === 25 ? 22 : hour + 1,
              ].includes(h) && (
                <TimeBox
                  key={h}
                  value={h}
                  time={hour}
                  onClick={() => setHour(h)}
                />
              )
          )}
        </Stack>
        <Stack spacing={0} flexBasis="50%" {...minuteHandler}>
          {minutes.map(
            (m) =>
              [
                minute - 15 === -15 ? 30 : minute - 15,
                minute,
                minute + 15 === 60 ? 30 : minute + 15,
              ].includes(m) && (
                <TimeBox
                  key={m}
                  value={m}
                  time={minute}
                  text="Menit"
                  onClick={() => setMinute(m)}
                />
              )
          )}
        </Stack>
      </HStack>
    </CustomDropdown>
  );
};

export default ListDetail;
