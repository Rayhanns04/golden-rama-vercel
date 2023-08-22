import Image from "next/image";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  IconButton,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Countdown, { zeroPad } from "react-countdown";
import CopyToClipboard from "react-copy-to-clipboard";
import { getOrderByOrderNumber } from "../../src/services/order.service";
import { getPaymentGatewayByOrderId } from "../../src/services/payment.service";
import Layout from "../../src/components/layout";
import ListDetail from "../../src/components/list-detail";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { CustomTags } from "../../src/components/tags";
import Clipboard from "../../public/svg/icons/clipboard.svg";
import DateIcon from "../../public/svg/icons/date.svg";
import UserMultipleIcon from "../../public/svg/icons/user-multiple.svg";
import AirlineIcon from "../../public/svg/icons/airline-outline.svg";
import {
  convertRupiah,
  getLogoUrlByBankCode,
  convertDateToTimestamp,
} from "../../src/helpers";
import { useSelector } from "react-redux";

const OrderHistoryDetail = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { isLoggedIn } = useSelector((s) => s.authReducer);
  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery(["getOrderByOrderNumber", id], () => getOrderByOrderNumber(id), {
    enabled: isLoggedIn,
  });

  const statusConfs = {
    unpaid: {
      color: "gradient.linear.orange",
      title: "Belum Dibayar",
      subtitle: "Silahkan selesaikan pembayaran sebelum",
    },
    active: {
      color: "gradient.linear.green",
      title: "Status Aktif",
      subtitle: "Aktif sampai tanggal pesanan",
    },
    done: {
      color: "gradient.linear.blue",
      title: "Status Selesai",
      subtitle: "Telah melewati tanggal pesanan",
    },
    cancelled: {
      color: "gradient.linear.red",
      title: "Status Dibatalkan",
      subtitle: "Gagal melakukan pembayaran",
    },
  };

  const statusConf = (() => {
    if (["unpaid", "booking"].includes(order?.status)) {
      if (["cruise", "package"].includes(order?.type)) {
        return new Date(order?.activeUntil) >= new Date()
          ? statusConfs.active
          : statusConfs.done;
      } else {
        return new Date(order?.transactionExpiration) >= new Date()
          ? statusConfs.unpaid
          : statusConfs.cancelled;
      }
    } else if (["paid", "confirmed"].includes(order?.status)) {
      return new Date(order?.activeUntil) >= new Date()
        ? statusConfs.active
        : statusConfs.done;
    } else {
      return statusConfs.cancelled;
    }
  })();
  const PaymentCard = () => {
    const { data: paymentGateway } = useQuery(
      ["getPaymentGatewayByOrderId", order?.orderNumber],
      () => getPaymentGatewayByOrderId(order?.orderNumber),
      {
        enabled: ["unpaid", "booking"].includes(order?.status),
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
    return (
      <Box
        hidden={!paymentGateway}
        bg={"brand.blue.100"}
        mx={{ base: "-24px", md: 0 }}
        p={"24px"}
        borderRadius={{ base: 0, md: "12px" }}
      >
        <Stack spacing={5}>
          {[
            {
              t: "Virtual Account",
              i: getLogoUrlByBankCode(
                paymentGateway?.attributes.response.bank_code
              ),
            },
            {
              t: "Nomor Virtual Account",
              p: paymentGateway?.attributes.response.va_number,
              c: true,
            },
            {
              t: "Total Pembayaran",
              p: `IDR ${convertRupiah(
                typeof paymentGateway?.attributes.response.amount === "string"
                  ? paymentGateway?.attributes.response.amount.split(".")[0]
                  : paymentGateway?.attributes.response.amount
              )}`,
            },
            {
              t: "Status Pembayaran",
              p: "Belum dibayar",
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
                  <Box position={"relative"} height={"30px"} width={"100%"}>
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
                  text={item.p?.replaceAll(" ", "")}
                >
                  <IconButton aria-label="copy" icon={<Clipboard />} />
                </CopyToClipboard>
              )}
            </HStack>
          ))}
        </Stack>
      </Box>
    );
  };

  const LowerSection = () => (
    <Box pt="16px" pb="24px">
      {["unpaid", "booking"].includes(order?.status) &&
      new Date(order?.transactionExpiration).getTime() <= Date.now() ? (
        <CustomOrangeFullWidthButton onClick={() => router.push("/")}>
          Pesan Lagi
        </CustomOrangeFullWidthButton>
      ) : (
        <>
          {order?.type === "tour" ? (
            <CustomOrangeFullWidthButton
              onClick={() => router.push(`/order-histories/docs/${id}`)}
            >
              Upload Dokumen
            </CustomOrangeFullWidthButton>
          ) : (
            <Text fontSize="xs">
              Kamu memiliki pertanyaan atau kendala terkait pesanan? Silahkan
              hubugi Golden Rama.
            </Text>
          )}
          <CustomOrangeFullWidthButton isoutlined>
            Hubungi Golden Rama E-Travel
          </CustomOrangeFullWidthButton>
        </>
      )}
    </Box>
  );

  return (
    <Layout pagetitle="Detail Pesanan" type="nested">
      <Box
        as={Skeleton}
        isLoaded={!isLoading}
        bg={statusConf.color}
        mx="-24px"
        px="24px"
        py="11.5px"
      >
        <Container maxW={{ base: "container.lg", xl: "container.xl" }}>
          <HStack justifyContent="space-between">
            <Box>
              <Text color="white" fontSize="sm" fontWeight="bold">
                {statusConf.title}
              </Text>
              <Text color="white" opacity=".8" fontSize="sm">
                {statusConf?.subtitle}
              </Text>
            </Box>
            {["unpaid", "booking"].includes(order?.status) &&
              new Date(order?.transactionExpiration).getTime() >=
                Date.now() && (
                <Countdown
                  date={convertDateToTimestamp(order?.transactionExpiration)}
                  ze
                  renderer={({ hours, minutes, seconds, completed }) => {
                    if (completed) {
                      setTimeout(() => {
                        router.reload();
                      }, 5000);
                    }
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
                              {zeroPad(item)}
                            </Center>
                          </HStack>
                        ))}
                      </HStack>
                    );
                  }}
                />
              )}
          </HStack>
        </Container>
      </Box>
      <Grid
        templateColumns={{ md: "repeat(3,1fr)" }}
        columnGap="calc(20px + 24px)"
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx="auto"
        py={{ md: "24px" }}
      >
        <GridItem colSpan={{ md: 2 }} order={isLargerThan768 ? -1 : 1}>
          <PaymentCard />
          <ListDetail details={order?.list} status={statusConf} />
        </GridItem>
        <GridItem>
          <Box
            position={{ base: "static", md: "sticky" }}
            top={24}
            spacing="16px"
          >
            <Box
              bg="brand.blue.100"
              mx={{ base: "-24px", md: 0 }}
              px="24px"
              py="24px"
              borderRadius={{ md: "12px" }}
            >
              {Array.isArray(order?.card) ? (
                <Accordion defaultIndex={[0]} allowToggle>
                  {order.card.map((card, index) => (
                    <AccordionItem key={index} border="none">
                      <AccordionButton>
                        <Box
                          flex="1"
                          textAlign="left"
                          color="brand.blue.500"
                          fontWeight="bold"
                        >
                          {card.accordion_title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <Card card={card} isLoading={isLoading} />
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card card={order?.card} isLoading={isLoading} />
              )}
            </Box>
            {isLargerThan768 && <LowerSection />}
          </Box>
        </GridItem>
      </Grid>
      <Box
        hidden={isLargerThan768}
        position="sticky"
        bottom={0}
        bg="white"
        borderTop="1px solid #e9e9e9"
      >
        <LowerSection order={order} />
      </Box>
    </Layout>
  );
};

const Card = ({ card, isLoading }) => {
  return (
    <Box bg="white" borderRadius="12px" px="16px" py="14px">
      <Stack pb="16px" borderBottom="1px dashed #f1f1f1">
        <HStack spacing="8px">
          {card?.tags?.map((tag) => (
            <CustomTags
              key={tag}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              fontSize="xs"
            >
              {tag}
            </CustomTags>
          ))}
          <Skeleton isLoaded={!isLoading} w="full">
            <Text flexShrink={0} color="neutral.text.high" fontWeight="bold">
              {card?.title || "Title"}
            </Text>
          </Skeleton>
        </HStack>
        <Text fontSize="xs">{card?.subtitle}</Text>
      </Stack>
      <Stack pt="16px" spacing="16px">
        <Text color="neutral.text.high" fontSize="sm" fontWeight="bold">
          {card?.name}
        </Text>
        {(card?.details || Array.from({ length: 3 })).map((detail, index) => (
          <Skeleton key={index} isLoaded={!isLoading}>
            <HStack spacing="6px">
              {detail?.type === "date" ? (
                <DateIcon />
              ) : detail?.type === "people" ? (
                <UserMultipleIcon />
              ) : (
                <AirlineIcon />
              )}
              <Text fontSize="xs">{detail?.text || "Text"}</Text>
              {detail?.tag && (
                <Tag
                  color="brand.orange.500"
                  bg="brand.orange.100"
                  size="sm"
                  fontSize="xs"
                >
                  {detail.tag}
                </Tag>
              )}
            </HStack>
          </Skeleton>
        ))}
      </Stack>
    </Box>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      meta: {
        title: "Detail Pesanan",
      },
    },
  };
};

export default OrderHistoryDetail;
