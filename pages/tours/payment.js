import {
  Box,
  Center,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useBreakpointValue,
  Button,
  Divider,
  GridItem,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  Heading,
  AccordionIcon,
  AccordionPanel,
  useToast,
  Input,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import CopyToClipboard from "react-copy-to-clipboard";
import Countdown from "react-countdown";
import React, { useRef, useState } from "react";
import Layout from "../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "../../src/components/button";
import Clipboard from "../../public/svg/icons/clipboard.svg";
import Checked from "../../public/svg/icons/checked.svg";
import Unchecked from "../../public/svg/icons/unchecked.svg";
import WalletIcon from "../../public/svg/flights/wallet.svg";
import {
  getPaymentMethods,
  generateVirtualAccount,
  generateCreditCard,
  paymentTravelCard,
} from "../../src/services/payment.service";
import { useSelector } from "react-redux";
import {
  convertDateToTimestamp,
  convertRupiah,
  mappingDetailPriceDeposit,
} from "../../src/helpers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TourDetails } from "../../src/components/card";
import {
  getOrderDetailTour,
  getTourBySlugWithIteneraryV2,
} from "../../src/services/tour.service";
import { DrawerPromo } from "../../src/components/checkout-detail";
import { checkPromo, getPromoByCode } from "../../src/services/promo.service";

const Payment = (props) => {
  const router = useRouter();
  const toast = useToast();
  const { paymentMethods, defaultPaymentMethod } = props;
  const { transaction, tourDetail } = useSelector((state) => state.tourReducer);
  const { user, jwt, isLoggedIn } = useSelector((s) => s.authReducer);
  const [selectedPayment, setSelectedPayment] = useState(defaultPaymentMethod);
  const [isWaiting, setIsWaiting] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const [isPromoAvailable, setIsPromoAvailable] = useState({});
  const [pin, setPin] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPIN,
    onOpen: onOpenPIN,
    onClose: onClosePIN,
  } = useDisclosure();

  let slug = {
    tourSlug: tourDetail.slug,
    departureId: tourDetail.departure_date,
  };
  const { data, isLoading } = useQuery(["getTourDetail"], async () => {
    const result = await getTourBySlugWithIteneraryV2(slug);
    return Promise.resolve(result);
  });

  const detail_prices = mappingDetailPriceDeposit(
    tourDetail.participants,
    transaction.downPayment,
    isPromoAvailable?.totalDiscount
  );

  const handleSelectPayment = (selected) => {
    setSelectedPayment(selected);
  };
  const isDesktop = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  const handlePayment = () => {
    let form = {
      order_id: transaction.orderNumber,
    };
    if (isPromoAvailable.available) {
      form = {
        ...form,
        promoCode: isPromoAvailable.promoCode,
        discount: isPromoAvailable.totalDiscount,
      };
    }
    if (!selectedPayment) {
      return toast({
        title: "Harap pilih metode pembayaran terlebih dahulu!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (selectedPayment.attributes.productCode == "CREDITCARD") {
      mutationCreditCard.mutate(form);
    }
    if (selectedPayment.attributes.productCode == "TRAVELCARD") {
      if (!pin || pin == "") {
        return toast({
          title: "PIN Wajib Diisi",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      if (isLoggedIn && user.card?.card) {
        mutationTravelCard.mutate({
          ...form,
          pinCode: pin,
          cardNumber: user.card?.card,
        });
        setPin("");
      }
    } else {
      form.bank_code = selectedPayment.attributes.bankCode;
      mutationVirtualAccount.mutate(form);
    }
  };

  const handleStatusPayment = () => {
    const form = {
      orderNumber: transaction.orderNumber,
    };
    mutationCheckStatusPayment.mutate(form);
  };

  const mutationVirtualAccount = useMutation(
    async (form) => {
      const response = await generateVirtualAccount(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        setPaymentDetail(response);
        setIsWaiting(true);
      },
    }
  );

  const mutationCreditCard = useMutation(
    async (form) => {
      const response = await generateCreditCard(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        location.href = response.redirect_url;
      },
    }
  );

  const mutationTravelCard = useMutation(
    async (form) => {
      const response = await paymentTravelCard(form, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        if (response.data.reference_number)
          router.push({
            pathname: "/tours/order-success",
            query: {
              orderNumber: response.data.order_id,
            },
          });
        else setStatusPayment(false);
      },
      onError: (error) => {
        if (
          error.response.data.error.message ==
            "Card blacklisted, too many attempt" ||
          error.response.data.error.message == "Card blacklisted"
        ) {
          return toast({
            title: "Kartu Anda Diblokir, Silahkan Hubungi Customer Service",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: "Cek Kembali PIN Anda / Saldo Anda",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const mutationCheckStatusPayment = useMutation(
    async (form) => {
      const response = await getOrderDetailTour(form);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        if (response.status == "paid" || response.status == "confirmed")
          router.push({
            pathname: "/tours/order-success",
            query: {
              orderNumber: response.orderNumber,
            },
          });
        else setStatusPayment(false);
      },
    }
  );

  const handlePromo = async (promoCode) => {
    const payment = await getPromoByCode(promoCode, "tour");
    if (!payment) {
      return toast({
        title: "Promo tidak bisa digunakan!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setSelectedPayment(payment);
    const payload = {
      promo: promoCode,
      totalPrice: transaction.downPayment,
      category: "tour",
      bank_code: payment.attributes.bankCode,
    };
    mutationPromo.mutate(payload);
  };

  const mutationPromo = useMutation(
    async (data) => {
      const response = await checkPromo(data, jwt);
      return Promise.resolve(response);
    },
    {
      onSuccess: (response) => {
        setIsPromoAvailable({
          available: true,
          totalDiscount: response.promo_detail.discount_amount,
          promoCode: response.promo_detail.promoCode,
        });
      },
      onError: (error) => {
        setIsPromoAvailable({
          available: false,
          totalDiscount: 0,
          promoCode: "",
          error: error?.response?.data?.error,
        });
      },
    }
  );

  const handleCopy = () => {
    toast({
      title: "",
      description: "Berhasil dicopy",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const onOpenModalPIN = () => {
    onOpenPIN();
  };

  const handlePIN = (pin) => {
    setPin(pin);
  };

  return (
    <Layout
      type={"nested"}
      position={"relative"}
      pagetitle={"Pembayaran"}
      hideBottomBar
    >
      {isWaiting && paymentDetail != null ? (
        <Box
          as={"section"}
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          py={{ md: "24px" }}
        >
          <Grid
            templateColumns={{ md: "repeat(3,1fr)" }}
            // py={"24px"}
            columnGap={"calc(20px + 24px)"}
          >
            <GridItem
              colSpan={{ md: 2 }}
              mx={{ base: "-24px", md: 0 }}
              rounded={{ base: "none", md: "lg" }}
              h={"fit-content"}
              overflow={"hidden"}
            >
              <HStack
                alignItems="center"
                justifyContent="space-between"
                bg={"brand.blue.400"}
                px={"24px"}
                py={"16px"}
              >
                <Text fontWeight="semibold" color="white">
                  Selesaikan Dalam
                </Text>
                <Countdown
                  date={convertDateToTimestamp(paymentDetail.expired)}
                  renderer={({ hours, minutes, seconds }) => {
                    return (
                      <HStack alignItems="center">
                        {[hours, minutes, seconds].map((item, index) => (
                          <HStack key={index} alignItems="center">
                            {index > 0 && (
                              <Text color="white" fontWeight="semibold">
                                :
                              </Text>
                            )}
                            <Center
                              bg="white"
                              w="30px"
                              h="30px"
                              borderRadius="6px"
                              color="brand.blue.400"
                              fontWeight="semibold"
                            >
                              {item}
                            </Center>
                          </HStack>
                        ))}
                      </HStack>
                    );
                  }}
                />
              </HStack>
              <Box bg={"brand.blue.100"} p={"24px"}>
                <Stack spacing={5}>
                  {[
                    {
                      t: "Virtual Account",
                      i: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedPayment.attributes.logo.data.attributes.url}`,
                    },
                    {
                      t: "Nomor Virtual Account",
                      p: `${paymentDetail.va_number}`,
                      c: true,
                    },
                    {
                      t: "Total Pembayaran",
                      p: `IDR ${convertRupiah(transaction.downPayment)}`,
                    },
                    {
                      t: "Status Pembayaran",
                      p: `${statusPayment ? "Sudah dibayar" : "Belum dibayar"}`,
                    },
                  ].map((item, index, arr) => (
                    <HStack
                      key={index}
                      justifyContent="space-between"
                      borderBottom={
                        index === arr.length - 1 ? "none" : "1px dashed #9E9E9E"
                      }
                      py="12px"
                    >
                      <Stack spacing={0.75}>
                        <Text fontSize="sm" color="neutral.text.low">
                          {item.t}
                        </Text>
                        {item.p && (
                          <Text fontSize="lg" fontWeight="semibold">
                            {item.p}
                          </Text>
                        )}
                        {item.i && (
                          <Box
                            position={"relative"}
                            height={"30px"}
                            width={"100%"}
                          >
                            <Image
                              src={item.i}
                              alt="bank"
                              layout={"fill"}
                              objectPosition={"left"}
                              objectFit="contain"
                            />
                          </Box>
                        )}
                      </Stack>
                      {item.c && (
                        <CopyToClipboard
                          onCopy={handleCopy}
                          text={item.p.replaceAll(" ", "")}
                        >
                          <IconButton aria-label="copy" icon={<Clipboard />} />
                        </CopyToClipboard>
                      )}
                    </HStack>
                  ))}
                </Stack>
              </Box>
            </GridItem>
            <GridItem position={"relative"} spacing={12}>
              <Stack spacing={"12px"} position={"sticky"} top={24}>
                <Stack
                  as="section"
                  pb={{ base: "24px", md: 0 }}
                  py={{ base: "24px", md: 0 }}
                  spacing={2}
                >
                  <Heading fontSize="lg" fontWeight="semibold">
                    Tata Cara Pembayaran
                  </Heading>
                  <Text color="neutral.text.medium" fontSize={"sm"}>
                    Lakukan pembayaran untuk pesanan Anda dengan mengikuti
                    beberapa langkah berikut :
                  </Text>
                  <Accordion allowMultiple>
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton
                        _hover={{ background: "transparent" }}
                        px={0}
                      >
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"18px"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Melalui Mobile Banking
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"24px"}>
                          <Text
                            as={"div"}
                            fontSize={"sm"}
                            dangerouslySetInnerHTML={{
                              __html:
                                selectedPayment?.attributes?.howToPayMobile,
                            }}
                          />
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem border={0} pb={"12px"}>
                      <AccordionButton
                        _hover={{ background: "transparent" }}
                        px={0}
                      >
                        <Box flex="1" textAlign="left">
                          <Heading
                            fontSize={"18px"}
                            color={"brand.blue.400"}
                            as={"h2"}
                          >
                            Melalui ATM
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel py={"16px"}>
                        <Stack spacing={"24px"}>
                          <Text
                            as={"div"}
                            fontSize={"sm"}
                            dangerouslySetInnerHTML={{
                              __html: selectedPayment?.attributes?.howToPay,
                            }}
                          />
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Box
                    py="6px"
                    borderTop={{ base: "1px solid #9E9E9E", md: 0 }}
                  >
                    <CustomOrangeFullWidthButton
                      onClick={() => handleStatusPayment()}
                    >
                      Cek Status Pembayaran
                    </CustomOrangeFullWidthButton>

                    <CustomOrangeFullWidthButton
                      onClick={() => router.push("/")}
                    >
                      Kembali ke Beranda
                    </CustomOrangeFullWidthButton>
                  </Box>
                </Stack>
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      ) : (
        <>
          <Box
            as={"section"}
            bg={"white"}
            px={"24px"}
            // bg={{ base: "brand.blue.100", md: "brand.blue.100" }}
            mx={"-24px"}
          >
            <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
              {!isLoading ? (
                <TourDetails hidden={!isDesktop} data={data} />
              ) : (
                <Center>
                  <Spinner hidden={!isDesktop}></Spinner>
                </Center>
              )}
              <SimpleGrid
                maxW={{ lg: "container.lg", xl: "container.xl" }}
                mx={"auto"}
                spacing={12}
                columns={[1, 1, 1, 2]}
                pb={10}
              >
                <Stack
                  // px={{ base: "24px", xl: 0 }}
                  pt={5}
                  spacing={5}
                  // minH="55vh"
                >
                  <Stack>
                    <DrawerPromo
                      handlePromo={handlePromo}
                      isFromTour={true}
                      category="tour"
                      dataTransaction={transaction}
                    />
                    {(isPromoAvailable && isPromoAvailable.available) ||
                    (transaction?.promo_code &&
                      transaction?.discountPromo > 0) ? (
                      <Text fontSize={{ base: "sm", md: "md" }} color="green">
                        Anda mendapatkan diskon IDR{" "}
                        {convertRupiah(
                          isPromoAvailable.totalDiscount ??
                            transaction?.discountPromo
                        )}
                      </Text>
                    ) : (
                      isPromoAvailable &&
                      isPromoAvailable.available == false && (
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          color="alert.failed"
                        >
                          Promo tidak bisa digunakan
                        </Text>
                      )
                    )}
                  </Stack>
                  <Divider variant={"dashed"} />
                  <Stack>
                    {detail_prices.map((item, parentIndex) => (
                      <>
                        {item.map((i, index) => (
                          <>
                            {!i.h && (
                              <HStack
                                // px={"24px"}
                                key={index}
                                w="full"
                                justifyContent="space-between"
                              >
                                <Text
                                  fontSize={{
                                    base: `${
                                      parentIndex === 3 && index == 1
                                        ? "xs"
                                        : "sm"
                                    }`,
                                    md: "md",
                                  }}
                                  color={
                                    parentIndex === 3
                                      ? "neutral.text.medium"
                                      : "neutral.text.high"
                                  }
                                >
                                  {i.t}
                                </Text>
                                <Text
                                  fontSize={{ base: "sm", md: "md" }}
                                  color={
                                    i.g
                                      ? "green.400"
                                      : parentIndex === 3
                                      ? "neutral.text.medium"
                                      : "neutral.text.high"
                                  }
                                  fontWeight={i.b && "semibold"}
                                >
                                  {i.p}
                                </Text>
                              </HStack>
                            )}
                          </>
                        ))}
                        <Divider
                          hidden={parentIndex != 2}
                          variant={"dashed"}
                          // borderColor={"red"}
                        />
                      </>
                    ))}
                  </Stack>
                  <Divider variant={"dashed"} />
                  <HStack
                    justifyContent="space-between"
                    // borderBottom="1px dashed #9E9E9E"
                  >
                    <Text fontSize="lg" fontWeight="semibold">
                      Metode Pembayaran
                    </Text>
                    <DrawerMethods
                      paymentMethods={paymentMethods}
                      handleSelectPayment={handleSelectPayment}
                      selectedPayment={selectedPayment}
                      isWithPromo={isPromoAvailable?.available}
                    />
                  </HStack>
                  <Divider variant={"dashed"} />
                  <Text color="neutral.text.low">
                    {selectedPayment?.attributes?.productCode === "BCAATM"
                      ? "Rekomendasi metode pembayaran"
                      : "Metode pembayaran yang dipilih"}
                  </Text>
                  <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    bg="brand.blue.100"
                    borderRadius="6px"
                    px="16px"
                    py="20px"
                  >
                    <HStack alignItems="center">
                      {selectedPayment ? (
                        <Center w="50px" h="26px" bg="white">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedPayment.attributes.logo.data.attributes.url}`}
                            alt="bank"
                            width={50}
                            height={26}
                            objectFit="contain"
                          />
                        </Center>
                      ) : (
                        <WalletIcon />
                      )}
                      <Text fontWeight="semibold">
                        {selectedPayment
                          ? selectedPayment.attributes.productName
                          : "Pilih Metode Pembayaran"}
                      </Text>
                    </HStack>
                    {selectedPayment ? <Checked /> : <Unchecked />}
                  </HStack>
                  <Text color="neutral.text.low">
                    {selectedPayment?.attributes?.productCode === "CREDITCARD"
                      ? "Nasabah YTH, Untuk pembayaran dengan menggunakan Kartu Kredit, tagihan yang akan tercetak di lembar tagihan kartu kredit pelanggan adalah atas nama ESPAY"
                      : ""}
                  </Text>
                </Stack>
                <Stack
                  position={{ base: "sticky", md: "static" }}
                  bottom={0}
                  bg={"white"}
                  spacing="12px"
                >
                  {!isLoading ? (
                    <TourDetails hidden={isDesktop} data={data} />
                  ) : (
                    <Center>
                      <Spinner hidden={isDesktop}></Spinner>
                    </Center>
                  )}
                  <Divider variant={"dashed"} />
                  <HStack
                    bottom={0}
                    py={"24px"}
                    // px={{ base: "24px", xl: 0 }}
                    // borderTop="1px dashed #9E9E9E"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="brand.orange.400"
                      w="full"
                    >
                      IDR{" "}
                      {convertRupiah(
                        transaction.downPayment -
                          (isPromoAvailable?.totalDiscount ?? 0)
                      )}
                    </Text>
                    <CustomOrangeFullWidthButton
                      isLoading={
                        mutationCreditCard.isLoading ||
                        mutationTravelCard.isLoading ||
                        mutationVirtualAccount.isLoading
                      }
                      disabled={!selectedPayment}
                      onClick={() =>
                        selectedPayment?.attributes?.productCode ===
                        "TRAVELCARD"
                          ? onOpenModalPIN()
                          : handlePayment()
                      }
                    >
                      Bayar
                    </CustomOrangeFullWidthButton>
                  </HStack>
                </Stack>
              </SimpleGrid>
            </Box>
          </Box>
        </>
      )}
      <ModalPIN
        isOpen={isOpenPIN}
        onClose={onClosePIN}
        handleSubmit={handlePayment}
        pinCode={handlePIN}
      />
    </Layout>
  );
};

export default Payment;

const DrawerMethods = ({
  paymentMethods,
  handleSelectPayment,
  selectedPayment,
  isWithPromo = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();
  const { isLoggedIn, user } = useSelector((s) => s.authReducer);
  const toast = useToast();
  const methods = ["Mandiri", "BCA", "BNI", "BRI", "Card"];
  const handleSubmit = (values, actions) => {
    setTimeout(() => {
      actions.setSubmitting(false);
      alert(JSON.stringify(values, null, 2));
      onClose();
    }, 1000);
  };
  return (
    <>
      <Button
        as={motion.div}
        variant={"ghost"}
        onClick={onOpen}
        ref={ref}
        fontWeight="semibold"
        color="brand.blue.400"
        cursor="pointer"
        animate={{
          scale: [1, 1.1, 1, 1.1, 1],
          backgroundColor: ["#fff", "#f0f4f5", "#fff", "#f0f4f5", "#fff"],
        }}
      >
        Ubah
      </Button>
      <CustomFilterButton
        isOpen={isOpen}
        onClose={onClose}
        title="Pilih Metode"
      >
        {isLoggedIn && (
          <>
            <Stack spacing={5}>
              <Stack py="12px">
                <Text fontSize="lg" fontWeight="semibold">
                  Travel Card
                </Text>
                <Text fontSize="sm" color="neutral.text.low">
                  Anda dapat melakukan transfer melalui Kartu Travel Card
                </Text>
              </Stack>
              <Stack>
                {paymentMethods
                  .filter((item) => {
                    return item.attributes.productCode === "TRAVELCARD";
                  })
                  .map((item, index) => (
                    <HStack
                      key={index}
                      alignItems="center"
                      justifyContent="space-between"
                      borderRadius="6px"
                      py="20px"
                      onClick={() =>
                        user.card?.card
                          ? handleSelectPayment(item)
                          : toast({
                              title: "Kartu Travel Card belum terdaftar",
                              description:
                                "Silahkan daftarkan kartu travel card anda terlebih dahulu",
                              status: "error",
                              duration: 9000,
                              isClosable: true,
                            })
                      }
                    >
                      <HStack alignItems="center">
                        <Center
                          minW="50px"
                          h="26px"
                          borderWidth="0.5px"
                          borderColor="neutral.text.low"
                          borderRadius="4px"
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.logo.data.attributes.url}`}
                            alt="logo"
                            width={50}
                            height={26}
                            objectFit="contain"
                          />
                        </Center>
                        <Text flexBasis="80%" fontWeight="semibold">
                          {item.attributes.productName}
                        </Text>
                      </HStack>
                      {selectedPayment?.id == item.id ? (
                        <Checked />
                      ) : (
                        <Unchecked />
                      )}
                    </HStack>
                  ))}
              </Stack>
            </Stack>
          </>
        )}
        <Stack spacing={5}>
          <Stack py="12px">
            <Text fontSize="lg" fontWeight="semibold">
              Virtual Account
            </Text>
            <Text fontSize="sm" color="neutral.text.low">
              Anda dapat melakukan transfer melalui Mobile Banking
            </Text>
          </Stack>
          <Stack>
            {paymentMethods
              .filter((item) => {
                return (
                  item.attributes.productCode !== "CREDITCARD" &&
                  item.attributes.productCode !== "TRAVELCARD"
                );
              })
              .map((item, index) => (
                <HStack
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                  borderRadius="6px"
                  py="20px"
                  onClick={() => handleSelectPayment(item)}
                  hidden={
                    isWithPromo
                      ? selectedPayment && selectedPayment.id == item.id
                        ? false
                        : true
                      : false
                  }
                >
                  <HStack alignItems="center">
                    <Center
                      minW="50px"
                      h="26px"
                      borderWidth="0.5px"
                      borderColor="neutral.text.low"
                      borderRadius="4px"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.attributes.logo.data.attributes.url}`}
                        alt="logo"
                        width={50}
                        height={26}
                        objectFit="contain"
                      />
                    </Center>
                    <Text flexBasis="80%" fontWeight="semibold">
                      {item.attributes.productName}
                    </Text>
                  </HStack>
                  {selectedPayment && selectedPayment.id == item.id ? (
                    <Checked />
                  ) : (
                    <Unchecked />
                  )}
                </HStack>
              ))}
          </Stack>
        </Stack>
        <Stack spacing={5}>
          <Stack py="12px">
            <Text fontSize="lg" fontWeight="semibold">
              Kartu Debit/Kredit
            </Text>
            {/* <Text fontSize="sm" color="neutral.text.low">
              Anda dapat melakukan transfer melalui Mobile Banking
            </Text> */}
          </Stack>
          <Stack>
            {paymentMethods
              .filter((item) => {
                return item.attributes.productCode === "CREDITCARD";
              })
              .map((item, index) => (
                <HStack
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                  borderRadius="6px"
                  py="20px"
                  onClick={() => handleSelectPayment(item)}
                  hidden={
                    isWithPromo
                      ? selectedPayment && selectedPayment.id == item.id
                        ? false
                        : true
                      : false
                  }
                >
                  <HStack alignItems="center">
                    <Center
                      minW="50px"
                      h="26px"
                      borderWidth="0.5px"
                      borderColor="neutral.text.low"
                      borderRadius="4px"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.attributes.logo.data.attributes.url}`}
                        alt="logo"
                        width={50}
                        height={26}
                        objectFit="contain"
                      />
                    </Center>
                    <Text flexBasis="80%" fontWeight="semibold">
                      {item.attributes.productName}
                    </Text>
                  </HStack>
                  {selectedPayment && selectedPayment.id == item.id ? (
                    <Checked />
                  ) : (
                    <Unchecked />
                  )}
                </HStack>
              ))}
          </Stack>
        </Stack>
      </CustomFilterButton>
    </>
  );
};

const ModalPIN = ({ isOpen, onClose, handleSubmit, pinCode }) => {
  const [show, setShow] = useState(false);

  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      title="Input PIN"
      footer="Input PIN"
      onSubmit={() => {
        handleSubmit();
        onClose();
      }}
    >
      <Stack spacing={5}>
        <Text fontSize="sm" color="neutral.text.low">
          Masukkan PIN Anda untuk melanjutkan pembayaran
        </Text>
        <Input
          type={show ? "text" : "password"}
          placeholder="Masukkan PIN"
          onChange={(e) => pinCode(e.target.value)}
          maxLength={4}
        />
      </Stack>
    </CustomFilterButton>
  );
};

export const getServerSideProps = async () => {
  const paymentMethods = await getPaymentMethods();
  return {
    props: { paymentMethods, defaultPaymentMethod: null },
  };
};
