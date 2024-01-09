import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import NextLink from "next/link";
import Countdown from "react-countdown";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomFilterButton } from "../../src/components/button";
import GrWhiteIcon from "../../public/svg/logo-gr-white.svg";
import MailBoxIcon from "../../public/svg/icons/mailbox.svg";
import PhoneIcon from "../../public/svg/icons/phone.svg";
import LockIcon from "../../public/svg/icons/lock.svg";
import EyeStreakIcon from "../../public/svg/icons/eye-streak.svg";
import FacebookIcon from "../../public/svg/socmeds/facebook.svg";
import GoogleIcon from "../../public/svg/socmeds/google.svg";
import TwitterIcon from "../../public/svg/socmeds/twitter.svg";
import LinkedinIcon from "../../public/svg/socmeds/linkedin.svg";
import YoutubeIcon from "../../public/svg/socmeds/youtube.svg";
import { numberToDigits } from "../../src/helpers";
import {
  forgotForm,
  loginForm,
  registerForm,
  verifyCode,
} from "../../src/services/auth.service";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginData } from "../../src/state/auth/auth.slice";
import { useSession, signIn, getSession, signOut } from "next-auth/react";

const Auth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  let { type, key, token, email, callbackUrl, redirect } = router.query;
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, jwt } = useSelector((state) => state.authReducer);
  let [isVerified, setIsVerified] = useState(false),
    [isError, setIsError] = useState({
      status: false,
      message: "",
    }),
    [isLoading, setIsLoading] = useState(false);

  const handeLoginGoogle = async (payload) => {
    toast({
      title: "Sukses login ke " + payload.identifier,
      status: "success",
      duration: 3000,
    });
    setIsLoading(true);
    setTimeout(async () => {
      dispatch(loginData(session));
      router.replace(redirect || "/account");
    }, 1000);
  };
  useEffect(() => {
    //check jwt on localstorage
    if (isLoggedIn && jwt) {
      router.replace(redirect || "/account");
    }
    if (type === "reset") {
      !token && !email && router.push("/auth");
    }
    if (status === "authenticated") {
      const payload = {
        identifier: session.user.user.email,
        password: "xixixixixixingapain",
      };
      handeLoginGoogle(payload);
    }
    if (callbackUrl) {
      toast({
        title: "Login Gagal!",
        description: "Pastikan email anda sudah terdaftar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      router.replace("/auth");
    }
    if (!type) {
      if (token && email) {
        const payload = {
          code: token.replace(/ /g, "+"),
          email: email,
          type: "registration",
        };
        try {
          verifyCode(payload)
            .then((res) => {
              if (res.user.confirmed) {
                toast({
                  title: "Pendaftaran berhasil",
                  description: "Akun sudah terverifikasi",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                dispatch(loginData(res));
                router.replace(redirect || "/account");
              }
            })
            .catch((err) => {
              setIsError({
                status: true,
                message: "Kode verifikasi tidak valid",
              });
            });
        } catch (error) {
          setIsError({
            status: true,
            message: error.message,
          });
        }
      }
    }
    if (type) {
      setIsVerified(false);
      setIsError({
        status: false,
        message: "",
      });
    }
  }, [type, token, email, status]);
  const socmeds = [
    {
      icon: FacebookIcon,
    },
    {
      icon: GoogleIcon,
    },
    {
      icon: TwitterIcon,
    },
    {
      icon: LinkedinIcon,
    },
    {
      icon: YoutubeIcon,
    },
  ];

  const initialValues =
    type === "register"
      ? {
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          isSubscribed: false,
          type: "register",
        }
      : type === "forgot"
      ? {
          email: "",
          unlockAt: null,
          type: "forgot",
        }
      : type === "reset"
      ? {
          password: "",
          confirmPassword: "",
          isSuccess: false,
          type: "reset",
        }
      : {
          email: session?.jwt ? session?.user?.user?.email : "",
          password: session?.jwt ? "xixixixixi" : "",
          isRemember: false,
          type: "login",
        };

  const validationSchema = Yup.object(
    type === "register"
      ? {
          name: Yup.string().required("Name is required"),
          phone: Yup.string().required("Phone is required"),
          email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
          isSubscribed: Yup.boolean(),
        }
      : type === "forgot"
      ? {
          email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        }
      : type === "reset"
      ? {
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
        }
      : {
          email: Yup.string()
            .email("Email is invalid")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        }
  );

  const handleSubmit = (values, actions) => {
    const { isShowPassword, isShowConfirmPassword, ...rest } = values;
    // actions.setSubmitting(isLoading);
    // const router = useRouter();
    return new Promise(async (resolve, reject) => {
      try {
        // await new Promise((r) => setTimeout(async (r), 2000));
        // throw new Error("Error"); // trial error
        // const body = JSON.stringify(rest)
        if (rest.type === "login") {
          // isRemember
          try {
            const payload = {
              ...rest,
              identifier: rest.email,
            };
            const login = await loginForm(payload);
            if (login) {
              if (login.user.confirmed) {
                dispatch(loginData(login));
                router.replace(redirect || "/account");
              } else {
                actions.setFieldError("general", "Email belum diverifikasi");
              }
            }
          } catch (err) {
            actions.setFieldError("general", "Email/password salah");
          }
        }
        if (rest.type === "register") {
          try {
            await registerForm(rest);
            // actions.setFieldValue(
            //   "isSuccess",
            //   `Berhasil Mendaftar, Silahkan Cek Email Anda Untuk Verifikasi!`
            // );
            router.push("/auth");
            toast({
              title: "Berhasil Mendaftar",
              description: "Silahkan Cek Email Anda Untuk Verifikasi!",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } catch (err) {
            actions.setFieldError("general", "Email sudah terdaftar");
          }
        }
        if (type === "reset") {
          try {
            rest = {
              ...rest,
              email,
              code: token.replace(/ /g, "+"),
              type: "reset",
            };
            await verifyCode(rest);
            actions.setFieldValue("isSuccessOpen", `Berhasil ubah Password!`);
            onOpen();
          } catch (err) {
            onOpen();
          }
        }
        if (type === "forgot") {
          try {
            await forgotForm(rest);
            actions.setFieldValue("isSuccess", `Berhasil Mengirim Email!`);
            if (typeof rest.unlockAt !== "undefined")
              actions.setFieldValue("unlockAt", Date.now() + 60000);
          } catch (error) {
            actions.setFieldError("general", error.response.data.error.message);
          }
        }
        resolve();
      } catch (error) {
        // pass error message as field error
        actions.setFieldError("general", "Terjadi kesalahan pada server");
        reject(error);
      }
    });
  };
  return (
    <Center
      position="relative"
      bg="url('/png/bg-auth.png')"
      bgRepeat="no-repeat"
      bgSize="cover"
      bgPosition="center"
      py="24px"
      minH="100vh"
    >
      <Button
        onClick={() => router.back()}
        position="absolute"
        top={0}
        right={0}
        variant="unstyled"
        color="white"
        p="30px"
      >
        Kembali
      </Button>
      <Container maxW="container.sm" px="24px">
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            ...initialValues,
            isShowPassword: false,
            isShowConfirmPassword: false,
          }}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ errors, isSubmitting, setFieldValue, touched, values }) => (
            <Form>
              <Center flexDir="column">
                <Box mb="48px">
                  <GrWhiteIcon />
                </Box>
                {errors.general && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}
                {values.isSuccess && (
                  <Alert status="success">
                    <AlertIcon />
                    <AlertTitle>Sukses!</AlertTitle>
                    <AlertDescription>{values.isSuccess}</AlertDescription>
                  </Alert>
                )}
                {isVerified && (
                  <Alert status="success">
                    <AlertIcon />
                    <AlertTitle>Sukses!</AlertTitle>
                    <AlertDescription>
                      Verifikasi Email Berhasil.
                    </AlertDescription>
                  </Alert>
                )}
                {isError.status && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{isError.message}</AlertDescription>
                  </Alert>
                )}
                <Stack
                  hidden={!["forgot", "reset"].includes(type)}
                  spacing="8px"
                  mb="40px"
                  w="full"
                  alignItems="start"
                  color="white"
                >
                  <Text fontSize="24px" fontWeight="bold">
                    {type === "forgot" ? "Lupa Password" : "Ubah Sandi"}
                  </Text>
                  <Text fontSize="14px">
                    {type === "forgot"
                      ? "Golden Rama kan mengirimkan link untuk mengubah password ke email-mu"
                      : email}
                  </Text>
                </Stack>
                <Stack spacing="16px" w="full">
                  <FormControl
                    hidden={typeof values.name === "undefined"}
                    id="name"
                    isInvalid={touched.name && errors.name}
                  >
                    <FormLabel color="white" fontSize="sm">
                      Nama Lengkap
                    </FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        pl="40px"
                        id="name"
                        name="name"
                        bg="white"
                        type="name"
                        placeholder="Nama Lengkap"
                      />
                      <InputLeftElement pointerEvents="none">
                        <MailBoxIcon />
                      </InputLeftElement>
                    </InputGroup>
                    {touched.name && (
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    hidden={typeof values.email === "undefined"}
                    id="email"
                    isInvalid={touched.email && errors.email}
                  >
                    <FormLabel color="white" fontSize="sm">
                      Email
                    </FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        pl="40px"
                        id="email"
                        name="email"
                        bg="white"
                        type="email"
                        placeholder="Email"
                      />
                      <InputLeftElement pointerEvents="none">
                        <MailBoxIcon />
                      </InputLeftElement>
                    </InputGroup>
                    {touched.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    hidden={typeof values.phone === "undefined"}
                    id="phone"
                    isInvalid={touched.phone && errors.phone}
                  >
                    <FormLabel color="white" fontSize="sm">
                      Nomor Telepon
                    </FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        pl="40px"
                        id="phone"
                        name="phone"
                        bg="white"
                        type="number"
                        placeholder="Nomor Telepon"
                      />
                      <InputLeftElement pointerEvents="none">
                        <PhoneIcon />
                      </InputLeftElement>
                    </InputGroup>
                    {touched.name && (
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    hidden={typeof values.password === "undefined"}
                    id="password"
                    isInvalid={touched.password && errors.password}
                  >
                    <FormLabel color="white" fontSize="sm">
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        pl="40px"
                        id="password"
                        name="password"
                        bg="white"
                        type={values.isShowPassword ? "text" : "password"}
                        placeholder="Password"
                      />
                      <InputLeftElement pointerEvents="none">
                        <LockIcon />
                      </InputLeftElement>
                      <InputRightElement>
                        <IconButton
                          onClick={() =>
                            setFieldValue(
                              "isShowPassword",
                              !values.isShowPassword
                            )
                          }
                          variant="ghost"
                          aria-label="Show password"
                          icon={<EyeStreakIcon />}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {touched.password && (
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    hidden={typeof values.confirmPassword === "undefined"}
                    id="confirmPassword"
                    isInvalid={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  >
                    <FormLabel color="white" fontSize="sm">
                      Konfirmasi Password
                    </FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        pl="40px"
                        id="confirmPassword"
                        name="confirmPassword"
                        bg="white"
                        type={
                          values.isShowConfirmPassword ? "text" : "password"
                        }
                        placeholder="Password"
                      />
                      <InputLeftElement pointerEvents="none">
                        <LockIcon />
                      </InputLeftElement>
                      <InputRightElement>
                        <IconButton
                          onClick={() =>
                            setFieldValue(
                              "isShowConfirmPassword",
                              !values.isShowConfirmPassword
                            )
                          }
                          variant="ghost"
                          aria-label="Show password"
                          icon={<EyeStreakIcon />}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {touched.confirmPassword && (
                      <FormErrorMessage>
                        {errors.confirmPassword}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <Field
                    hidden={typeof values.isSubscribed === "undefined"}
                    as={Checkbox}
                    id="isSubscribed"
                    name="isSubscribed"
                    colorScheme="brand.blue"
                    color="white"
                  >
                    Berlangganan info dan promo menarik
                  </Field>
                  <HStack
                    hidden={typeof values.isRemember === "undefined"}
                    justify="space-between"
                  >
                    <Field
                      as={Checkbox}
                      id="isRemember"
                      name="isRemember"
                      colorScheme="brand.blue"
                      color="white"
                    >
                      Ingat Saya
                    </Field>
                    <NextLink href="/auth?type=forgot">
                      <Text
                        as="a"
                        color="white"
                        fontSize="sm"
                        fontWeight="semibold"
                        cursor="pointer"
                      >
                        Lupa Password?
                      </Text>
                    </NextLink>
                  </HStack>
                </Stack>
                <Text
                  hidden={type !== "register"}
                  fontSize="sm"
                  color="white"
                  mt="53px"
                >
                  Dengan melakukan pendaftaran akun di Golden Rama, anda telah
                  membaca dan menyetujui{" "}
                  <Text as="span" fontWeight="bold">
                    {" "}
                    Syarat & Ketentuan & Kebijakan privasi.
                  </Text>
                </Text>
                <CustomOrangeFullWidthButton
                  disabled={values?.unlockAt}
                  type="submit"
                  isLoading={isSubmitting}
                  mt={type === "register" ? "19px" : "42px"}
                >
                  {type === "register"
                    ? "Daftar"
                    : type === "forgot"
                    ? "Kirim"
                    : type === "reset"
                    ? "Simpan"
                    : "Login"}
                </CustomOrangeFullWidthButton>
                {values?.unlockAt && (
                  <Countdown
                    date={new Date(values?.unlockAt)}
                    onComplete={() => setFieldValue("unlockAt", null)}
                    renderer={({ minutes, seconds }) => (
                      <Text
                        variant="unstyled"
                        color="neutral.text.low"
                        fontSize="sm"
                        fontWeight="normal"
                        mt="16px"
                      >
                        Kirim ulang ({numberToDigits(minutes, 2)}:
                        {numberToDigits(seconds, 2)})
                      </Text>
                    )}
                  />
                )}
                <Text
                  hidden={["forgot", "reset"].includes(type)}
                  fontSize="sm"
                  color="white"
                  mt="22px"
                >
                  {type === "register"
                    ? "Sudah memiliki Akun? "
                    : "Belum punya akun? "}
                  <NextLink
                    href={type === "register" ? "/auth" : "/auth?type=register"}
                    passHref
                  >
                    <Text as="span" fontWeight="bold" cursor="pointer">
                      {type === "register" ? "Masuk" : "Daftar"}
                    </Text>
                  </NextLink>
                </Text>
                {/* <Box hidden={["forgot", "reset"].includes(type)} mt="70px">
                  <HStack justifyContent="center" gap="10px">
                    <Box w="81px" borderWidth="1px" borderColor="white" />
                    <Text fontSize="sm" color="white">
                      Atau masuk dengan
                    </Text>
                    <Box w="81px" borderWidth="1px" borderColor="white" />
                  </HStack>
                  <HStack justifyContent="center" mt="34.5px" gap="24px">
                    {socmeds.map((socmed, index) => (
                      <IconButton
                        key={index}
                        variant="unstyled"
                        icon={<socmed.icon />}
                        transition="all 0.2s"
                        _hover={{
                          transform: "scale(1.1)",
                        }}
                      />
                    ))}
                  </HStack>
                </Box> */}
                <HStack justifyContent="center" gap="10px">
                  <Box w="81px" borderWidth="1px" borderColor="white" />
                  <Text fontSize="sm" color="white">
                    Atau masuk dengan
                  </Text>
                  <Box w="81px" borderWidth="1px" borderColor="white" />
                </HStack>
                <HStack justifyContent="center" mt="34.5px" gap="24px">
                  <IconButton
                    variant="unstyled"
                    icon={<GoogleIcon />}
                    transition="all 0.2s"
                    _hover={{
                      transform: "scale(1.1)",
                    }}
                    onClick={() => {
                      signIn("google");
                    }}
                  />
                </HStack>
              </Center>
              <CustomFilterButton
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                title={
                  values?.isSuccessOpen
                    ? "Password Berhasil Diubah"
                    : "Password Gagal Diubah"
                }
                footer={
                  <CustomOrangeFullWidthButton
                    onClick={() => {
                      router.push(
                        values?.isSuccessOpen ? "/auth" : "/auth?type=forgot"
                      );
                      onClose();
                    }}
                  >
                    {values?.isSuccessOpen ? "Masuk" : "Kirim Ulang"}
                  </CustomOrangeFullWidthButton>
                }
              >
                {values?.isSuccessOpen
                  ? "Kata sandi anda telah diperbaruin, silahkan masuk kembali menggunakan akunmu"
                  : "Link reset passwordmu salah / sudah kadaluwarsa, kirim ulang link untuk merubah sandi"}
              </CustomFilterButton>
            </Form>
          )}
        </Formik>
      </Container>
    </Center>
  );
};

export default Auth;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
      meta: {
        title: "Login/Register",
      },
    },
  };
};
