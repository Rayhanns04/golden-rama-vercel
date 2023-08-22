import { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormErrorMessage,
  useToast,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import Layout from "../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "../../src/components/button";
import * as Yup from "yup";
import { CustomDropdown } from "../../src/components/dropdown";
import CustomCalendar from "../../src/components/calendar";
import { Unauthorized } from "../../src/components/card";
import ChevronLeftIcon from "../../public/svg/icons/chevron-left-dark.svg";
import SettingsIcon from "../../public/svg/icons/settings.svg";
import CreditCardIcon from "../../public/svg/icons/credit-card.svg";
import ProductBookmarkIcon from "../../public/svg/icons/product-bookmark.svg";
import PhotoIcon from "../../public/svg/icons/photo.svg";
import DateIcon from "../../public/svg/icons/date.svg";
import MailboxIcon from "../../public/svg/icons/mailbox.svg";
import PhoneIcon from "../../public/svg/icons/phone.svg";
import LockIcon from "../../public/svg/icons/lock.svg";
import EyeStreak from "../../public/svg/icons/eye-streak.svg";
import LogoutIcon from "../../public/svg/nav/logout.svg";
import OrderIcon from "../../public/svg/icons/order.svg";
import date from "../../src/helpers/date";
import { toTitleCase } from "../../src/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  getMe,
  updateMe,
} from "../../src/services/account.service";
import { useQuery } from "@tanstack/react-query";
import {
  loginData,
  logoutData,
  userData,
} from "../../src/state/auth/auth.slice";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

const Account = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  const toast = useToast();
  const [isLargerThan768px] = useMediaQuery("(min-width: 768px)", {
    ssr: true,
    fallback: false,
  });
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const [refetch, setRefetch] = useState(false);
  const profileData = useQuery(["getProfile", refetch], async () => {
    try {
      if (user) {
        const response = await getMe(jwt);
        return response;
      }
    } catch (error) {
      if (isLoggedIn) {
        dispatch(logoutData());
        signOut({ callbackUrl: origin });
        return Promise.reject(error);
      }
    }
  });
  useEffect(() => {
    dispatch(userData(profileData.data));
  }, [profileData.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleLogout = () => {
    dispatch(logoutData());
    signOut({ callbackUrl: origin });
    router.push("/");
  };
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenLogout,
    onOpen: onOpenLogout,
    onClose: onCloseLogout,
  } = useDisclosure();
  const {
    isOpen: isOpenTravel,
    onOpen: onOpenTravel,
    onClose: onCloseTravel,
  } = useDisclosure();
  const profileRef = useRef();

  const openTravelCard = () => {
    user.card?.card ? router.push("/account/travel-card") : onOpenTravel();
  };
  const list = [
    {
      title: "Pengaturan Profile",
      subtitle: "Atur data profile yang kamu miliki",
      icon: <SettingsIcon />,
      onClick: onOpen,
      ref: profileRef,
    },
    {
      title: "Produk Tersimpan",
      subtitle: "Lihat produk favorite yang kamu simpan",
      icon: <ProductBookmarkIcon />,
      onClick: () => router.push("/saved"),
    },
    isLargerThan768px && {
      title: "Pesanan",
      subtitle: "Temukan pesanan perjalanan yang kamu miliki",
      icon: <OrderIcon />,
      onClick: () => router.push("/order-histories"),
    },
    {
      title: "Travel Privilege Card",
      subtitle: "Kartu untuk akses penawaran terbaik",
      icon: <CreditCardIcon />,
      onClick: openTravelCard,
    },
    {
      title: "Upload Foto",
      subtitle: "Bagikan momen terindah liburanmu",
      icon: <PhotoIcon />,
      onClick: () => router.push("/tours/upload-moment"),
    },
  ];

  const ModalProfile = ({ isOpen, onOpen, onClose, data }) => {
    const drawerRef = useRef();
    const [type, setType] = useState("");
    const initialValues = {
      name: profileData.data?.full_name || "",
      birthdate: profileData.data?.birthdate || "",
      title: profileData.data?.title || "",
      id_number: profileData.data?.id_number || "",
      email: profileData.data?.email || "",
      phone: profileData.data?.phone || "",
      password: "",
    };
    const detailFields = [
      {
        name: "email",
        label: "Email",
        icon: <MailboxIcon />,
      },
      {
        name: "phone",
        label: "Nomor Telepon",
        icon: <PhoneIcon />,
      },
      {
        name: "password",
        label: "Password",
        icon: <LockIcon />,
      },
    ];

    const handleSubmit = (values) => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const birthdate = new Date(
            new Date(values.birthdate).getTime() + 7 * 60 * 60 * 1000
          ); // add 7 hours to get UTC+7
          const res = await updateMe(jwt, { ...values, birthdate });
          toast({
            title: res.message,
            status: res.success ? "success" : "error",
            isClosable: true,
            variant: "subtle",
          });
          onClose();
          res.success && setRefetch(!refetch);
          resolve();
        }, 1000);
      });
    };
    return (
      <CustomFilterButton
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setRefetch(!refetch);
        }}
        title="Pengaturan Profile"
        hidefooter
        notrounded
      >
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Box py="24px">
                <Text fontSize="lg" fontWeight="bold">
                  Detail Profile
                </Text>
                <Text fontSize="sm" color="neutral.text.high">
                  Pastikan data anda sesuai
                </Text>
              </Box>
              <Stack spacing="16px">
                <FormControl>
                  <FormLabel fontSize="sm">Nama Lengkap</FormLabel>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    variant="filled"
                    colorScheme="brand.blue"
                    placeholder="Nama Lengkap"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Tanggal Lahir</FormLabel>
                  <Field name="birthdate">
                    {({ form }) => (
                      <CustomDropdown
                        title="Pilih Tanggal Lahir"
                        placeholder="Pilih Tanggal Lahir"
                        value={
                          form.values.birthdate !== ""
                            ? date(
                                new Date(form.values.birthdate),
                                "dd LLLL yyyy"
                              )
                            : form.values.birthdate
                        }
                        rightIcon={<DateIcon />}
                      >
                        <Stack spacing={5} py={5}>
                          <CustomCalendar
                            value={
                              form.values.birthdate !== ""
                                ? new Date(form.values.birthdate)
                                : form.values.birthdate
                            }
                            onChange={(date) => {
                              form.setFieldValue("birthdate", date, false);
                            }}
                          />
                        </Stack>
                      </CustomDropdown>
                    )}
                  </Field>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Title</FormLabel>
                  <Field name="title">
                    {({ field, form }) => (
                      <CustomDropdown
                        title="Pilih Title"
                        placeholder="Pilih Title"
                        value={form.values.title}
                        rightIcon={<DateIcon />}
                      >
                        <RadioGroup {...field}>
                          <Stack spacing={5} py={5}>
                            {["MR", "MRS", "MS"].map((item, index) => (
                              <Radio key={index} {...field} value={item}>
                                {item}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </CustomDropdown>
                    )}
                  </Field>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Nomor Identitas</FormLabel>
                  <Field
                    as={Input}
                    id="id_number"
                    name="id_number"
                    variant="filled"
                    colorScheme="brand.blue"
                    placeholder="Nomor Identitas"
                  />
                </FormControl>
              </Stack>
              <Box
                borderTopWidth="1px"
                borderStyle="dashed"
                borderColor="#E9E9E9"
                mt="24px"
              />
              <Box py="24px">
                <Text fontSize="lg" fontWeight="bold">
                  Kontak Detail
                </Text>
                <Text fontSize="sm" color="neutral.text.high">
                  Informasi ini memerlukan verifikasi ulang jika diubah
                </Text>
              </Box>
              <Stack spacing="16px">
                {detailFields.map((item, index) => (
                  <FormControl key={index}>
                    <FormLabel fontSize="sm">{item.label}</FormLabel>
                    <Button
                      onClick={() => setType(item.name)}
                      fontWeight="normal"
                      p="15px"
                      fontSize={{ base: "sm", md: "md" }}
                      variant="solid"
                      justifyContent="space-between"
                      w="full"
                      ref={drawerRef}
                      color={
                        values[item.name] && item.name !== "password"
                          ? "neutral.text.high"
                          : "neutral.text.low"
                      }
                      colorScheme="gray"
                    >
                      <HStack gap="10px">
                        {item.icon}
                        <Text>
                          {item.name === "password"
                            ? "Password disembunyikan"
                            : values[item.name] || `Tambahkan ${item.label}`}
                        </Text>
                      </HStack>
                    </Button>
                  </FormControl>
                ))}
              </Stack>
              <Box position="sticky" bottom={0} bg="white" py="16px">
                <CustomOrangeFullWidthButton
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Simpan
                </CustomOrangeFullWidthButton>
              </Box>
              <ModalEdit
                typeState={[type, setType]}
                setValue={setFieldValue}
                drawer={drawerRef}
              />
            </Form>
          )}
        </Formik>
      </CustomFilterButton>
    );
  };

  const ModalEdit = ({ typeState, setValue, drawer }) => {
    const toast = useToast();
    const namefields = {
      email: [
        {
          name: "currentEmail",
          label: "Email Saat ini",
          icon: <MailboxIcon />,
          type: "email",
        },
        {
          name: "newEmail",
          label: "Email Baru",
          icon: <MailboxIcon />,
          type: "email",
        },
        {
          name: "password",
          label: "Password",
          icon: <LockIcon />,
          type: "password",
        },
      ],
      phone: [
        {
          name: "currentPhone",
          label: "Nomor Telepon Saat ini",
          icon: <PhoneIcon />,
          type: "phone",
        },
        {
          name: "newPhone",
          label: "Nomor Telepon Baru",
          icon: <PhoneIcon />,
          type: "phone",
        },
        {
          name: "password",
          label: "Password",
          icon: <LockIcon />,
          type: "password",
        },
      ],
      password: [
        {
          name: "currentPassword",
          label: "Password Saat ini",
          icon: <LockIcon />,
          type: "password",
        },
        {
          name: "newPassword",
          label: "Password Baru",
          icon: <LockIcon />,
          type: "password",
        },
        {
          name: "confirmPassword",
          label: "Konfirmasi Password Baru",
          icon: <LockIcon />,
          type: "password",
        },
      ],
    };

    const [type, setType] = typeState;
    const [form, setForm] = useState(
      namefields[type]?.reduce((acc, cur) => {
        acc[cur.name] = "";
        return acc;
      }, {}) || {}
    );

    const validationSchema = Yup.object(
      type === "password"
        ? {
            currentPassword: Yup.string().required(
              "Password saat ini harus diisi"
            ),
            newPassword: Yup.string()
              .required("Password baru harus diisi")
              .min(8, "Password minimal 8 karakter"),
            confirmPassword: Yup.string()
              .required("Konfirmasi password baru harus diisi")
              .oneOf([Yup.ref("newPassword"), null], "Password tidak sama"),
          }
        : type === "phone"
        ? {
            currentPhone: Yup.string()
              .oneOf(
                [profileData.data?.phone, null],
                "Nomor telepon saat ini tidak sesuai"
              )
              .required("Nomor telepon saat ini harus diisi"),
            newPhone: Yup.string()
              .required("Nomor telepon baru harus diisi")
              .min(9, "Nomor telepon minimal 9 karakter")
              .max(13, "Nomor telepon maksimal 13 karakter"),
            password: Yup.string().required("Password harus diisi"),
          }
        : {
            currentEmail: Yup.string()
              .oneOf([profileData.data?.email, null], "Email tidak sama")
              .required("Email saat ini harus diisi"),
            newEmail: Yup.string()
              .required("Email baru harus diisi")
              .email("Email tidak valid"),
            password: Yup.string().required("Password harus diisi"),
          }
    );

    return (
      <CustomFilterButton
        isOpen={["email", "phone", "password"].includes(type)}
        onClose={() => setType("")}
        title={`Ubah ${toTitleCase(type)}`}
        drawer={drawer}
        hidefooter
      >
        <Stack spacing="24px">
          <Formik
            initialValues={form}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setTimeout(async () => {
                setSubmitting(false);
                if (type === "email") {
                  try {
                    const payload = {
                      type: "email",
                      email: values.newEmail,
                      password: values.password,
                    };
                    const res = await updateMe(jwt, payload);
                    toast({
                      title: res.message,
                      status: res.success ? "success" : "error",
                      isClosable: true,
                      variant: "subtle",
                    });
                    res.success && setValue(type, values.newEmail);
                  } catch (err) {
                    toast({
                      title: "Gagal mengubah email",
                      status: "error",
                      isClosable: true,
                      variant: "subtle",
                    });
                  }
                }
                if (type === "phone") {
                  try {
                    if (values.newPhone === profileData.data?.phone)
                      return toast({
                        title:
                          "Nomor telepon baru tidak boleh sama dengan nomor telepon saat ini",
                        status: "error",
                        isClosable: true,
                        variant: "subtle",
                      });
                    const payload = {
                      type: "phone",
                      phone: values.newPhone,
                      password: values.password,
                    };
                    const res = await updateMe(jwt, payload);
                    toast({
                      title: res.message,
                      status: res.success ? "success" : "error",
                      isClosable: true,
                      variant: "subtle",
                    });
                    res.success && setValue(type, values.newPhone);
                  } catch (err) {
                    toast({
                      title: "Gagal mengubah nomor telepon",
                      status: "error",
                      isClosable: true,
                      variant: "subtle",
                    });
                  }
                }
                if (type === "password") {
                  try {
                    const payload = {
                      type: "password",
                      currentPassword: values.currentPassword,
                      password: values.newPassword,
                      passwordConfirmation: values.confirmPassword,
                    };
                    const res = await updateMe(jwt, payload);
                    toast({
                      title: res.message,
                      status: res.success ? "success" : "error",
                      isClosable: true,
                      variant: "subtle",
                    });
                  } catch (err) {
                    toast({
                      title: "Gagal mengubah password",
                      status: "error",
                      isClosable: true,
                      variant: "subtle",
                    });
                  }
                }
                setType("");
                setForm({});
              }, 1000);
            }}
            enableReinitialize
          >
            {({ errors, isSubmitting, setFieldValue, touched, values }) => (
              <Form>
                <Stack spacing="16px">
                  {namefields[type]?.map((item, index) => {
                    // console.log(item.name);
                    // console.log(errors[item.name]);
                    return (
                      <FormControl
                        key={index}
                        isInvalid={errors[item.name] && touched[item.name]}
                      >
                        <FormLabel fontSize="sm">{item.label}</FormLabel>
                        <Field
                          name={item.name}
                          type={item.type}
                          as={Input}
                          placeholder={item.label}
                          onChange={(e) => {
                            setForm({ ...form, [item.name]: e.target.value });
                          }}
                          errorBorderColor="red.300"
                          isInvalid={errors[item.name] && touched[item.name]}
                        />
                        <FormErrorMessage>{errors[item.name]}</FormErrorMessage>
                      </FormControl>
                    );
                  })}
                </Stack>
                <Box position="sticky" bottom={0} bg="white" py="16px">
                  <CustomOrangeFullWidthButton
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Simpan
                  </CustomOrangeFullWidthButton>
                </Box>
              </Form>
            )}
          </Formik>
        </Stack>
      </CustomFilterButton>
    );
  };

  return (
    <Layout metatitle="Akun Saya" pagetitle="Akun Saya">
      <Box minH="50vh">
        <Box
          position="relative"
          mx="-24px"
          px="24px"
          py="27px"
          bg="brand.blue.400"
          bgImage="url('/svg/bg-pattern.svg')"
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPosition="center"
          color="white"
          overflow="clip"
        >
          <Container maxW="container.sm" px={0}>
            <Text fontSize="xl" fontWeight="bold">
              {isLoggedIn ? "Akun Anda" : "Masuk ke Akun Anda"}
            </Text>
            <Text hidden={isLoggedIn} fontSize="sm" mb="32px">
              Check your{" "}
              <Text as="span" fontWeight="semibold">
                booking
              </Text>{" "}
              dan akses semua fitur
            </Text>
            <Box
              hidden={!isLoggedIn}
              bg="white"
              borderRadius="8px"
              px="18px"
              py="21px"
              mt="14px"
            >
              <Text color="neutral.text.high" fontSize="lg" fontWeight="bold">
                {profileData.data?.full_name}
              </Text>
              <Text color="brand.blue.400" fontSize="sm">
                {/* dummy@mail.com */}
                {profileData.data?.email}
              </Text>
            </Box>
            <Button
              hidden={isLoggedIn}
              onClick={() => router.push("/auth")}
              bg="white"
              color="brand.blue.400"
              px="52px"
            >
              Log In
            </Button>
          </Container>
        </Box>
        {isLoggedIn ? (
          <Stack mx="-24px" spacing={0}>
            {list.map(
              (item, index) =>
                item && (
                  <Box
                    key={index}
                    onClick={item?.onClick}
                    ref={item?.ref}
                    cursor="pointer"
                    px="24px"
                    py="25px"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                    borderColor="neutral.color.bg.primary"
                    transition="all 0.2s"
                    _hover={{
                      bg: "neutral.color.bg.primary",
                      color: "brand.blue.400",
                    }}
                  >
                    <Container maxW="container.sm" px={0}>
                      <HStack justifyContent="space-between">
                        <HStack spacing="16px">
                          {item.icon}
                          <Box>
                            <Text fontSize="lg" fontWeight="bold">
                              {item.title}
                            </Text>
                            <Text fontSize="sm" color="neutral.text.high">
                              {item.subtitle}
                            </Text>
                          </Box>
                        </HStack>
                        <ChevronLeftIcon />
                      </HStack>
                    </Container>
                  </Box>
                )
            )}
            <Box
              onClick={onOpenLogout}
              cursor="pointer"
              px="24px"
              py="32px"
              bg="brand.blue.100"
            >
              <Container maxW="container.sm" px={0}>
                <HStack spacing="16px">
                  <LogoutIcon />
                  <Text fontSize="lg" fontWeight="bold">
                    Log out
                  </Text>
                </HStack>
              </Container>
            </Box>
          </Stack>
        ) : (
          <Unauthorized />
        )}
      </Box>
      <ModalProfile
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={profileData}
        jwt={jwt}
      />
      <ModalLogout
        isOpen={isOpenLogout}
        onClose={onCloseLogout}
        logout={handleLogout}
      />
      <ModalTravel isOpen={isOpenTravel} onClose={onCloseTravel} />
    </Layout>
  );
};

export default Account;

const ModalLogout = ({ isOpen, onClose, logout }) => {
  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      title="Keluar"
      footer="Log Out"
      onSubmit={() => {
        logout();
        onClose();
      }}
    >
      <Stack spacing="24px" alignItems="center">
        <Text color="neutral.text.high" fontWeight="bold" textAlign="center">
          Apakah Anda yakin ingin keluar dari akun Anda?
        </Text>
        <Text color="neutral.text.low" fontSize="sm" textAlign="center">
          Dengan keluar dari akun maka kamu tidak dapat mengakses beberapa fitur
          dan memerlukan login kembali agar dapat mengaksesnya
        </Text>
      </Stack>
    </CustomFilterButton>
  );
};
const ModalTravel = ({ isOpen, onClose }) => {
  const router = useRouter();
  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      title="Input Kartu"
      footer="Input Kartu"
      onSubmit={() => {
        router.push("/account/travel-card");
        onClose();
      }}
    >
      <Stack spacing="24px" alignItems="center">
        <Box
          w="260px"
          h="142px"
          bg="#D5A916"
          bgImage="url('/svg/card-world.svg')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
          borderRadius="8.5px"
        ></Box>
        <Text color="neutral.text.high" fontWeight="bold" textAlign="center">
          Kamu Belum Menginput Kartu
        </Text>
        <Text color="neutral.text.low" fontSize="sm" textAlign="center">
          Dengan mengaktifkan kartu travel privillege card kamu bisa menikmati
          transaksi lebih mudah, Perlu diingat kartu yang diinput hanya 1 kartu
        </Text>
      </Stack>
    </CustomFilterButton>
  );
};

export const getStaticProps = () => {
  return {
    props: {
      title: "Akun Saya",
    },
  };
};
