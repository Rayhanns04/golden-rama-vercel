import {
  Box,
  Divider,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  VStack,
  Spinner,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import Layout from "../../components/layout";
import { CustomOrangeFullWidthButton } from "../../components/button";
import { CustomDivider } from "../divider";
import { useLocalStorage } from "../../hooks";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { cancelStatus, checkStatus } from "../../services/payment.service";

const SuccessPageCruisePackage = ({ details, orderDetail }) => {
  const router = useRouter();
  //get path from url
  const { asPath } = router;
  const isLoading = false;
  const { status: statusOrder } = router.query;
  const path = asPath.split("/")[1];
  const { status, orderNumber } = orderDetail;
  const { isLoggedIn } = useSelector((s) => s.authReducer);
  let isSuccess = ["booking", "paid", "confirmed"].includes(status);
  // React.useEffect(() => {
  //   if (isSuccess) {
  //     router.push(asPath.replace("success", "status"));
  //   }
  // }, [isSuccess]);
  return (
    <Layout type="nested" pagetitle="Detail Pemesanan" hideBottomBar>
      <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
        <SimpleGrid columnGap={12} columns={[1, 1, 1, 2]}>
          <Stack alignItems="center" textAlign="center" py={"90px"}>
            {isLoading ? (
              <Box>
                <Spinner />
              </Box>
            ) : (
              <Box>
                <Image
                  src={
                    "/svg/icons/" + (isSuccess ? "success.svg" : "failed.svg")
                  }
                  alt={isSuccess ? "success" : "failed"}
                  width={140}
                  height={140}
                />
              </Box>
            )}
            <Text fontSize="xl" fontWeight="semibold" color="neutral.text.high">
              <SkeletonText noOfLines={1} isLoaded={!isLoading}>
                Pemesanan {isSuccess ? "Berhasil" : "Gagal"}
              </SkeletonText>
            </Text>
            <Text fontSize="sm" color="neutral.text.high">
              <SkeletonText noOfLines={1} isLoaded={!isLoading}>
                {isSuccess
                  ? "Terima Kasih sudah menyelesaikan pembayaran"
                  : "Silahkan hubungi customer service kami untuk informasi lebih lanjut"}
              </SkeletonText>
            </Text>
          </Stack>
          <Stack>
            <Box py={{ base: "5px", lg: 0 }} mx="-24px" bg={"brand.blue.100"} />
            {details.map((list, ind) => (
              <Fragment key={ind}>
                <Divider variant={"dashed"} hidden={!ind > 0} />
                <SimpleGrid columns={[1]} py="12px">
                  {list
                    .filter((item) => {
                      return !item.h;
                    })
                    .map((item, index) => (
                      <SimpleGrid
                        columns={2}
                        key={index}
                        w="full"
                        justifyContent="space-between"
                      >
                        {item.t && (
                          <Text
                            fontSize="sm"
                            color={
                              item.b
                                ? "neutral.text.high"
                                : "neutral.text.medium"
                            }
                            fontWeight={item.b && "semibold"}
                          >
                            {item.t}
                          </Text>
                        )}
                        {item.p &&
                          (typeof item.p === "string" ? (
                            <GridItem
                              as={Text}
                              colSpan={!item.t ? 2 : 1}
                              fontSize="sm"
                              color={
                                item.g
                                  ? "green.400"
                                  : item.b
                                  ? "neutral.text.high"
                                  : "neutral.text.medium"
                              }
                              fontWeight={item.b && "semibold"}
                              //on mobile, align right and width 55%
                              w={{ lg: "auto", xl: "auto" }}
                              textAlign={item.t && "right"}
                            >
                              {item.p}
                            </GridItem>
                          ) : (
                            <GridItem colSpan={2}>{item.p}</GridItem>
                          ))}
                      </SimpleGrid>
                    ))}
                </SimpleGrid>
              </Fragment>
            ))}
            <VStack pb={6}>
              {isLoggedIn ? (
                <>
                  <CustomOrangeFullWidthButton
                    onClick={() =>
                      router.push(`/order-histories/${orderDetail.orderNumber}`)
                    }
                  >
                    Lihat Detail Pemesanan
                  </CustomOrangeFullWidthButton>
                  <CustomOrangeFullWidthButton
                    onClick={() => router.push("/order-histories")}
                    isoutlined
                  >
                    Lihat List Pesanan
                  </CustomOrangeFullWidthButton>
                </>
              ) : (
                <CustomOrangeFullWidthButton onClick={() => router.push(`/`)}>
                  Kembali ke Beranda
                </CustomOrangeFullWidthButton>
              )}
              {/* <Button variant="unstyled" color="brand.orange.400">
          </Button> */}
            </VStack>
          </Stack>
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default SuccessPageCruisePackage;
