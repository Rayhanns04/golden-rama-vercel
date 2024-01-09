import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  Stack,
  Tag,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useSteps, Steps, Step } from "chakra-ui-steps";
import Layout from "../../../src/components/layout";
import ListDetail from "../../../src/components/list-detail";
import { CustomOrangeFullWidthButton } from "../../../src/components/button";
import checked from "../../../public/svg/icons/checked2.svg";
import { formatSecretCardNumber } from "../../../src/helpers";
import { useEffect } from "react";
import { checkMinTopUp, onReload } from "../../../src/services/travelcard.service";
import { paymentData } from "../../../src/state/travelcard/travelcard.slice";

const OrderDetails = () => {
  const router = useRouter();
  const steps = useSteps({
    initialStep: 0,
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const [form, setForm] = useState({
    amount: "",
  });
  const { isLoggedIn, user, jwt } = useSelector((s) => s.authReducer);

  const [customer, setCustomer] = useState({
    fullName: isLoggedIn ? user?.full_name : "",
    email: isLoggedIn ? user?.email : "",
    phone: isLoggedIn ? user?.phone : "",
  });

  const { data: minTopUp, isLoading: isLoadingTopUp } = useQuery(["checkMinTopUp", isLoggedIn], async () => {
    try {
      if (user) {
        const response = await checkMinTopUp();
        return response;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  const handleSubmit = () => {
    if (form.amount < parseInt(minTopUp.amount)) {
      return toast({
        title: "Top Up Gagal",
        description: minTopUp.description,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    const payload = {
      ...form,
      customer,
      cardNumber: user.card?.card,
      jwt,
    };
    mutateBooking(payload);
  };

  const { mutate: mutateBooking, isLoading: isLoadingBooking } = useMutation(
    async (data) => {
      const response = await onReload(data);
      return Promise.resolve(response);
    },
    {
      onSuccess: (data) => {
        dispatch(paymentData({ transaction: data }));
        router.push("/account/travel-card/payment");
      },
      onError: (error) => {
        toast({
          title: "Booking Gagal",
          description: "Silahkan cek kembali data anda",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const LowerSection = () => (
    <HStack
      justifyContent="space-between"
      py="16px"
      spacing={12}
      pt="40vh"
      alignItems="center"
    // position={isLargerThan768 ? "relative" : "sticky"}
    >
      <CustomOrangeFullWidthButton
        isLoading={isLoadingBooking}
        onClick={() => handleSubmit()}
        isDisabled={isLoadingTopUp}
      >
        Lanjutkan
      </CustomOrangeFullWidthButton>
    </HStack>
  );
  return (
    <Layout
      type="nested"
      position="relative"
      metatitle={"Konfirmasi Top Up"}
      pagetitle={"Konfirmasi Top Up"}
    >
      <Grid
        templateColumns={{ md: "repeat(1,2fr)" }}
        columnGap="calc(20px + 24px)"
        maxW={{ lg: "container.md", xl: "container.md" }}
        mx="auto"
        py={{ md: "34px" }}
      >
        <GridItem colSpan={{ md: 1 }} order={isLargerThan768 ? -1 : 1}>
          <Box mx={{ base: "-24px", md: 0 }} px="24px">
            <Box>
              <Box py="24px">
                <HStack justifyContent="space-between">
                  <Text
                    fontFamily="heading"
                    color="black"
                    fontWeight="bold"
                    mb="18px"
                  >
                    Masukan Nominal Top Up
                  </Text>
                </HStack>
                <Box>
                  <Box>
                    <InputGroup
                      size="lg"
                      variant="filled"
                      borderRadius="8px"
                      bg="white"
                      border="1px solid #E2E8F0"
                      _hover={{ border: "1px solid #CBD5E0" }}
                      _focusWithin={{ border: "1px solid #CBD5E0" }}
                    >
                      <Input
                        type="number"
                        name="nominal"
                        placeholder="Rp. 0"
                        value={form.amount}
                        onChange={(e) => {
                          setForm({ ...form, amount: e.target.value });
                        }}
                        required
                      />
                    </InputGroup>
                  </Box>
                  {/* description text */}
                  <Box mt="16px">
                    <Text fontSize="sm" color="gray.500">
                      {minTopUp?.description}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <LowerSection />
        </GridItem>
        {/* <GridItem>
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
                            <Card />
                        </Box>
                        {isLargerThan768 && <LowerSection />}
                    </Box>
                </GridItem> */}
      </Grid>
      <Box
        hidden={isLargerThan768}
        position="sticky"
        bottom={0}
        bg="white"
        borderTop="1px solid #e9e9e9"
      ></Box>
    </Layout>
  );
};

const Card = () => {
  const { user } = useSelector((s) => s.authReducer);
  return (
    <Box bg="white" borderRadius="12px" px="16px" py="14px">
      <Stack pb="16px" borderBottom="1px dashed #f1f1f1">
        <Text flexShrink={0} color="neutral.text.high" fontWeight="bold">
          Top Up Travel Privilage Card
        </Text>
      </Stack>
      <HStack spacing="6px" mt="1em">
        <Box
          w="24px"
          h="24px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={checked} w="16px" h="16px" color="brand.orange.500" />
        </Box>
        <Text fontSize="xs">{formatSecretCardNumber(user.card?.card)}</Text>
      </HStack>
      <HStack spacing="6px" mt="1em">
        <Box
          w="24px"
          h="24px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={checked} w="16px" h="16px" color="brand.orange.500" />
        </Box>
        <Text fontSize="xs">{user.email}</Text>
      </HStack>
    </Box>
  );
};

export default OrderDetails;

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Konfirmasi Top Up",
      },
    },
  };
};
