import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getWishListsByType } from "../src/services/wishlist.service";
import Layout from "../src/components/layout";
import { CustomTags, CustomTagsOutlineIcon } from "../src/components/tags";
import AirlineIcon from "../public/svg/icons/airline.svg";
import LoveRedIcon from "../public/svg/icons/love-red.svg";
import WeatherIcon from "../public/svg/icons/weather.svg";
import ShipIcon from "../public/svg/icons/cruise.svg";
import LuggageIcon from "../public/svg/icons/luggage.svg";
import StarIcon from "../public/svg/icons/star-outline.svg";
import TagsIcon from "../public/svg/icons/tag.svg";
import { convertRupiah } from "../src/helpers";
import { NoResults } from "../src/components/card";

const Saved = () => {
  const [type, setType] = useState("tour");
  const customer = useSelector((state) => state.authReducer.user);
  const jwt = useSelector((state) => state.authReducer.jwt);
  const { data: wishlists, isLoading } = useQuery(
    ["wishlists", type],
    () => getWishListsByType(type, customer.id, jwt),
    {
      enabled: !!customer.id,
    }
  );
  const types = [
    {
      name: "tour",
      label: "Tour",
    },
    {
      name: "hotel",
      label: "Hotel",
    },
    {
      name: "package",
      label: "Package",
    },
    {
      name: "cruise",
      label: "Cruise",
    },
    {
      name: "attraction",
      label: "Atraksi & Hiburan",
    },
  ];
  const icons = {
    airline: <AirlineIcon />,
    weather: <WeatherIcon />,
    ship: <ShipIcon />,
    luggage: <LuggageIcon />,
    star: <StarIcon />,
    tag: <TagsIcon />,
  };
  return (
    <Layout pagetitle="Produk Tersimpan">
      <Box py="24px">
        <Text
          color="neutral.text.high"
          fontFamily="heading"
          fontWeight="bold"
          textTransform="uppercase"
        >
          produk tersimpan
        </Text>
        <Text fontSize="sm" color="neutral.text.medium">
          Cek kembali destinasi tersimpan untuk perjalanan berikutnya.
        </Text>
      </Box>
      <HStack
        pb="26px"
        gap="12px"
        overflowX="auto"
        __css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {types.map((t) => (
          <Button
            key={t.name}
            borderRadius="full"
            bg={t.name === type ? "brand.blue.400" : "#F6F6F6"}
            color={t.name === type ? "brand.blue.100" : "neutral.text.low"}
            colorScheme="brand.blue"
            fontSize="sm"
            fontWeight="normal"
            minW="fit-content"
            transition="all 0.2s"
            onClick={() => setType(t.name)}
          >
            {t.label}
          </Button>
        ))}
      </HStack>
      <SimpleGrid columns={[1, 1, 2, 3]}>
        {wishlists?.length > 0 &&
          wishlists?.map((wishlist) => {
            const { product } = wishlist.attributes;
            return (
              <LinkBox key={wishlist.id}>
                <Stack
                  justifyContent={"space-between"}
                  h={"full"}
                  bg={"white"}
                  overflow={"hidden"}
                  rounded={"xl"}
                >
                  <Box m={0} minH={150} w={"100%"} position={"relative"}>
                    <Image
                      layout={"fill"}
                      objectFit={"cover"}
                      alt={"Image"}
                      src={product.image}
                    />
                    <IconButton
                      hidden
                      zIndex={1}
                      right={0}
                      color={"whiteAlpha.900"}
                      position={"absolute"}
                      variant={"unstyled"}
                      icon={<LoveRedIcon />}
                    />
                  </Box>
                  <Stack
                    flexGrow={1}
                    justifyContent={"space-between"}
                    p={"16px"}
                    spacing={"8px"}
                  >
                    <Wrap>
                      {product?.tags?.map((tag) => (
                        <WrapItem key={tag}>
                          <CustomTags>{tag}</CustomTags>
                        </WrapItem>
                      ))}
                    </Wrap>
                    <Heading
                      color={"neutral.text.high"}
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      {product.title}
                    </Heading>
                    <Text>{product.subtitle}</Text>
                    <HStack spacing={"20px"}>
                      {product?.details?.map((detail) => (
                        <CustomTagsOutlineIcon
                          key={detail.text}
                          icon={icons[detail.icon]}
                        >
                          {detail.text}
                        </CustomTagsOutlineIcon>
                      ))}
                    </HStack>
                    <Stack spacing={0}>
                      {false && (
                        <Text
                          as={"span"}
                          fontSize={{ base: "sm", md: "md" }}
                          color={"neutral.text.low"}
                          textDecoration={"line-through"}
                        >
                          {`IDR ${convertRupiah("00876") ?? ""}`}
                        </Text>
                      )}
                      <HStack justifyContent={"space-between"}>
                        <Stack spacing={0}>
                          <Text
                            as={"span"}
                            fontWeight={"normal"}
                            textColor={"neutral.text.low"}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            Mulai dari
                          </Text>
                          <Text
                            as={"span"}
                            color={"brand.orange.400"}
                            fontSize={{ base: "md", md: "lg" }}
                            fontWeight={"bold"}
                          >
                            {`IDR ${
                              convertRupiah(product.startingPrice) ??
                              "16.888.000"
                            }`}
                          </Text>
                        </Stack>
                        <NextLink
                          href={`/${wishlist.attributes.type}s/${product.slug}`}
                          passHref
                        >
                          <LinkOverlay
                            fontSize={{ base: "sm", md: "md" }}
                            alignContent={"center"}
                            color={"brand.blue.400"}
                          >
                            Lihat Detail
                            <Icon
                              ml={"10px"}
                              fill="none"
                              width="16px"
                              height="16px"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.4947 3.99463C11.3952 3.99465 11.2979 4.02436 11.2154 4.07996C11.1329 4.13556 11.0688 4.21452 11.0314 4.30673C10.994 4.39894 10.985 4.50021 11.0054 4.59759C11.0259 4.69496 11.075 4.78402 11.1464 4.85335L13.6262 7.33317H1.16655C1.10029 7.33223 1.03451 7.34447 0.973024 7.36918C0.911539 7.39389 0.855579 7.43057 0.808394 7.47709C0.761209 7.52361 0.723741 7.57905 0.698167 7.64018C0.672593 7.70131 0.659424 7.76691 0.659424 7.83317C0.659424 7.89943 0.672593 7.96504 0.698167 8.02616C0.723741 8.08729 0.761209 8.14273 0.808394 8.18925C0.855579 8.23577 0.911539 8.27245 0.973024 8.29716C1.03451 8.32187 1.10029 8.33411 1.16655 8.33317H13.6262L11.1464 10.813C11.0984 10.8591 11.0601 10.9142 11.0337 10.9753C11.0073 11.0364 10.9933 11.1021 10.9927 11.1686C10.992 11.2351 11.0046 11.3011 11.0297 11.3627C11.0549 11.4243 11.0921 11.4802 11.1391 11.5273C11.1861 11.5743 11.2421 11.6115 11.3037 11.6366C11.3653 11.6618 11.4313 11.6744 11.4978 11.6737C11.5643 11.673 11.63 11.6591 11.6911 11.6327C11.7521 11.6063 11.8073 11.568 11.8534 11.52L15.1867 8.18669C15.2805 8.09291 15.3331 7.96576 15.3331 7.83317C15.3331 7.70058 15.2805 7.57343 15.1867 7.47966L11.8534 4.14632C11.8068 4.09833 11.751 4.06017 11.6894 4.03411C11.6278 4.00806 11.5616 3.99463 11.4947 3.99463Z"
                                fill="#41778A"
                              />
                            </Icon>
                          </LinkOverlay>
                        </NextLink>
                      </HStack>
                    </Stack>
                  </Stack>
                </Stack>
              </LinkBox>
            );
          })}
      </SimpleGrid>
      {wishlists?.length === 0 && (
        // <Portal>
        <NoResults hideButton />
        // </Portal>
      )}
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Produk Tersimpan",
      },
    },
  };
};

export default Saved;
