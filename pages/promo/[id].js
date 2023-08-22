import {
  chakra,
  Box,
  Center,
  Heading,
  Stack,
  Text,
  Circle,
  Divider,
  Flex,
  HStack,
  Button,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  Accordion,
  Badge,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import Layout from "../../src/components/layout";
import DateIcon from "../../public/svg/flights/date.svg";
import ClipboardIcon from "../../public/svg/icons/clipboard.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";
import { dateIndonesia } from "../../src/helpers/dateIndonesia";
import { getTimeRemaining } from "../../src/helpers/countdown";
import _ from "underscore";
import { useSelector } from "react-redux";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
// import PrebookingDetails from "./prebooking";

const PromoDetail = (props) => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const { classes, fields, title } = props;
  const { promoDetail } = useSelector((state) => state.promoReducer);
  const isLoading = false;
  // const { data: promoDetail, isLoading } = useQuery(
  //   ["getDetailPromo", id],
  //   async () => {
  //     const response = await getPromoDetailPage(id);
  //     return Promise.resolve(response);
  //   }
  // );

  return (
    <Layout type={"nested"} pagetitle={"Semua Promo"}>
      <SimpleGrid
        columnGap={4}
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        columns={[1, 1, 1, 2]}
      >
        <Box>
          <Box as={"section"} mx={{ base: "-24px", md: 0 }}>
            <Box mx={"auto"}>
              <Skeleton isLoaded={!isLoading}>
                <Stack h={{ base: "550px", md: "240px" }} position={"relative"}>
                  {!isLoading && (
                    <Image
                      alt={promoDetail?.banner?.url}
                      priority
                      objectFit="contain"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${promoDetail?.banner?.url}`}
                      layout={"fill"}
                    />
                  )}
                </Stack>
              </Skeleton>
            </Box>
          </Box>
          <Stack spacing={"12px"} as={"section"} py={"24px"}>
            {/* <Stack>
          <Wrap>
            <WrapItem>
              <CustomTags>Tour</CustomTags>
            </WrapItem>
          </Wrap>
        </Stack> */}
            <Box mx={"auto"}>
              <Stack spacing={"24px"}>
                <Skeleton isLoaded={!isLoading}>
                  <Heading textAlign={"center"} fontSize={"24px"}>
                    {promoDetail?.name}
                  </Heading>
                </Skeleton>
                <Center>
                  <Skeleton isLoaded={!isLoading}>
                    {/* <ShareItem path={`/promo/${id}`} /> */}
                  </Skeleton>
                </Center>
                <Center>
                  <Skeleton isLoaded={!isLoading}>
                    <HStack spacing={"24px"}>
                      <Box>
                        <Badge
                          p={"10px"}
                          rounded={"md"}
                          variant={"solid"}
                          colorScheme={"brand.blue"}
                        >
                          <Heading fontSize={"lg"} as="span">
                            {/* {Math.max(
                              getTimeRemaining(getDetail?.end_date)
                                .days,
                              0
                            )} */}
                            {getTimeRemaining(promoDetail?.end_date).days}
                          </Heading>
                        </Badge>
                        <Text fontSize={"sm"} textAlign={"center"}>
                          Hari
                        </Text>
                      </Box>

                      <Box>
                        <Badge
                          p={"10px"}
                          rounded={"md"}
                          variant={"solid"}
                          colorScheme={"brand.blue"}
                        >
                          <Heading fontSize={"lg"} as="span">
                            {/* {Math.max(
                              getTimeRemaining(getDetail?.end_date)
                                .hours,
                              0
                            )} */}
                            {getTimeRemaining(promoDetail?.end_date).hours}
                          </Heading>
                        </Badge>
                        <Text fontSize={"sm"} textAlign={"center"}>
                          Jam
                        </Text>
                      </Box>

                      <Box>
                        <Badge
                          p={"10px"}
                          rounded={"md"}
                          variant={"solid"}
                          colorScheme={"brand.blue"}
                        >
                          <Heading fontSize={"lg"} as="span">
                            {/* {Math.max(
                              getTimeRemaining(getDetail?.end_date)
                                .minutes,
                              0
                            )} */}
                            {getTimeRemaining(promoDetail?.end_date).minutes}
                          </Heading>
                        </Badge>
                        <Text fontSize={"sm"} textAlign={"center"}>
                          Menit
                        </Text>
                      </Box>
                    </HStack>
                  </Skeleton>
                </Center>
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Box
            as={"section"}
            mx={{ base: "-24px", md: 0 }}
            py={"24px"}
            bg={"brand.blue.100"}
            rounded={{ base: "none", md: "xl" }}
            overflow={"hidden"}
          >
            <Box>
              <Center p={"15px"}>
                <Stack>
                  <Skeleton isLoaded={!isLoading}>
                    <Heading
                      color={"brand.blue.600"}
                      textAlign={"center"}
                      as={"h3"}
                      fontSize={"md"}
                    >
                      Periode Promo
                    </Heading>
                  </Skeleton>
                  <Heading
                    textAlign={"center"}
                    as={"div"}
                    color={"brand.blue.400"}
                    fontSize={"md"}
                  >
                    <Stack
                      alignItems={"center"}
                      alignContent={"center"}
                      direction={"row"}
                      spacing={"2px"}
                    >
                      <SkeletonCircle isLoaded={!isLoading}>
                        <DateIcon />{" "}
                      </SkeletonCircle>
                      <Skeleton isLoaded={!isLoading}>
                        <chakra.span>{`${dateIndonesia(
                          promoDetail?.start_date
                        )} - ${dateIndonesia(
                          promoDetail?.end_date
                        )}`}</chakra.span>
                      </Skeleton>
                    </Stack>
                  </Heading>
                </Stack>
              </Center>
              <Skeleton isLoaded={!isLoading}>
                <Stack rounded={"xl"} bg={"white"} m={"24px"} spacing={0}>
                  <Stack p={"20px"} minH={"90px"}>
                    <Heading as={"h4"} fontSize={"md"}>
                      Kode Voucher
                    </Heading>
                  </Stack>
                  <Flex
                    alignItems={"center"}
                    overflow={"hidden"}
                    position={"relative"}
                    minH={"20px"}
                  >
                    <Circle
                      position={"absolute"}
                      left={"-5px"}
                      w={"16px"}
                      h={"16px"}
                      zIndex={1}
                      bgColor={"brand.blue.100"}
                    />
                    <Divider
                      variant={"dashed"}
                      borderColor={"neutral.color.line.secondary"}
                      borderBottomWidth={"2px"}
                    />
                    <Circle
                      position={"absolute"}
                      right={"-5px"}
                      w={"16px"}
                      h={"16px"}
                      zIndex={1}
                      bgColor={"brand.blue.100"}
                    />
                  </Flex>
                  <HStack p={"20px"} justifyContent={"space-between"}>
                    <Heading
                      fontSize={"lg"}
                      fontWeight={"bold"}
                      color={"brand.orange.400"}
                    >
                      {promoDetail?.code}
                    </Heading>
                    <CopyToClipboard
                      options={{ message: "Copied" }}
                      text={promoDetail?.code}
                      onCopy={() => {
                        toast({
                          title: "Copied",
                          status: "success",
                          duration: "5000",
                          variant: "subtle",
                          isClosable: "true",
                        });
                      }}
                    >
                      <Button
                        size={"xs"}
                        py={4}
                        colorScheme={"brand.blue"}
                        variant={"ghost"}
                        color={"brand.blue.500"}
                        leftIcon={<ClipboardIcon />}
                      >
                        Copy
                      </Button>
                    </CopyToClipboard>
                  </HStack>
                </Stack>
              </Skeleton>
            </Box>
          </Box>
          {/* Hashtag */}
          <Stack spacing={"24px"} as={"section"} py={"24px"}>
            <SkeletonText noOfLines={10} isLoaded={!isLoading}>
              <Text
                fontSize={"sm"}
                dangerouslySetInnerHTML={{
                  __html: promoDetail?.description,
                }}
              />
            </SkeletonText>
            {/* <Divider
              borderColor={"neutral.color.line.secondary"}
              variant={"dashed"}
            /> */}
          </Stack>
        </Box>
      </SimpleGrid>
      {/* <CustomDivider /> */}
      {true && (
        <Box as={"section"} py={"24px"}>
          <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
            <Accordion allowMultiple mx={"-24px"} px={"12px"}>
              <AccordionItem border={0} pb={"20px"}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading
                      fontSize={"18px"}
                      color={"brand.blue.400"}
                      as={"h2"}
                    >
                      Syarat dan Ketentuan
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel py={"16px"}>
                  <Stack spacing={"24px"}>
                    <SkeletonText noOfLines={8} isLoaded={!isLoading}>
                      <Text
                        as={"div"}
                        fontSize={"sm"}
                        dangerouslySetInnerHTML={{
                          __html: `
                    <p>Pemesanan berdasarkan ketersediaan kursi.</p>
                    <ul>
    <li>Harga dapat diinformasikan H-1 atau pada saat pameran berlangsung.</li>
    <li>Promo cashback baru dapat diketahui H-1 atau saat pameran.</li>
    <li>Setiap reservasi yang waitinglist (belum dikonfirmasi) tidak menjamin bisa mendapatkan harga promo.</li>
    <li>Semua reservasi yang ada batas waktu (time limit) harus dicek terlebih dahulu.</li>
</ul>
<p>*Data pribadi Anda akan masuk dalam penyimpanan informasi (database) guna mempermudah travel konsultan kami dalam melakukan kontak via telepon, chat atau email</p>`,
                        }}
                      />
                    </SkeletonText>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border={0} pb={"20px"}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading
                      fontSize={"18px"}
                      color={"brand.blue.400"}
                      as={"h2"}
                    >
                      Cara Pemakaian
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel py={"16px"}>
                  <Stack spacing={"24px"}>
                    <SkeletonText noOfLines={8} isLoaded={!isLoading}>
                      <Text
                        as={"div"}
                        fontSize={"sm"}
                        dangerouslySetInnerHTML={{
                          __html: `
                    <p>Gunakan kode promo ini dengan cara berikut</p>
<ul>
    <li>Lorem ipsum dolor sit amet</li>
    <li>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.&nbsp;</li>
    <li>Velit officia consequat duis enim velit mollit.</li>
</ul>
<p>*Note catatan tambahan &nbsp;</p>`,
                        }}
                      />
                    </SkeletonText>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Divider mx={"-24px"} />
            <CustomOrangeFullWidthButton>
              Cari Tiket Sekarang
            </CustomOrangeFullWidthButton>
            {/* <Prebooking /> */}
          </Box>
          {/* <Box as={"section"} mx={"-24px"}>
          <Box height={90} w={"100%"} position={"relative"}>
            <Image
              src={"https://dummyimage.com/400x180"}
              objectFit={"cover"}
              layout="fill"
            />
          </Box>
          <Stack p={"24px"}>
            <Heading color={"brand.blue.600"} as={"h4"} fontSize={"18px"}>
              Cari Tiket Pesawat
            </Heading>
            <FlightForm />
            <Heading color={"brand.blue.600"} as={"h4"} fontSize={"18px"}>
              Pilih Produk
            </Heading>
            <Text>Lorem ipsum dolor sit amet</Text>
          </Stack>
        </Box> */}
        </Box>
      )}
    </Layout>
  );
};

// export const getStaticPaths = async () => {
//   const promos = await getPromoListV2();

//   const response = {
//     paths: promos.data.map((item) => {
//       return { params: { id: ite.code } };
//     }),
//     fallback: false,
//   };
//   return response;
// };

export const getServerSideProps = async () => {
  // const promos = await getPromoListV2();
  // const promo = _.filter(promos.data, function (obj) {
  //   return ob.code === ctx.params.id;
  // })?.[0];
  const classes = [
    { label: "Economy", value: "E" },
    { label: "Premium Economy", value: "PE" },
    { label: "Business Class", value: "B" },
    { label: "First Class", value: "F" },
  ];

  const title = [
    { label: "Mr", value: "mr" },
    { label: "Mrs", value: "mrs" },
    { label: "Miss", value: "Miss" },
  ];

  const fields = [
    {
      name: "departure",
      label: "Asal",
    },
    {
      name: "destination",
      label: "Tujuan",
    },
    {
      name: "departure_date",
      label: "Tanggal Pergi",
    },
    {
      name: "return_date",
      label: "Tanggal Pulang",
    },
    {
      name: "class",
      label: "Kelas Penerbangan",
    },
    [
      {
        name: "adult",
        label: "Dewasa",
      },
      {
        name: "child",
        label: "Anak",
      },
      {
        name: "infant",
        label: "Bayi",
      },
    ],
  ];

  return {
    props: {
      // data: promo,
      classes,
      fields,
      title,
    },
  };
};

export default PromoDetail;
