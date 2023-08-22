/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Layout from "../src/components/layout";
import {
  Box,
  Center,
  Circle,
  Flex,
  Heading,
  HStack,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import AchieveIcon from "../public/svg/icons/achieve.svg";
import GlobeIcon from "../public/svg/icons/globe.svg";
import ThumbIcon from "../public/svg/icons/thumb.svg";

const AboutUs = (props) => {
  const icon = {
    achieve: <AchieveIcon />,
    globe: <GlobeIcon />,
    thumb: <ThumbIcon />,
  };
  return (
    <Layout pagetitle={"Company Profile"} meta={props.meta}>
      <Flex
        pt={{ base: 0, lg: "40px" }}
        pb={{ base: 0, lg: "50px" }}
        alignItems="center"
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"auto"}
        flexDir={{ base: "column", lg: "row" }}
        gap="24px"
      >
        <Center
          flexShrink={0}
          as="section"
          mx={{ base: "-24px", lg: 0 }}
          px="24px"
          h={{ base: "190px", lg: "285px" }}
          w={{ base: "auto", lg: "621px" }}
          bgImage="url('/png/bg-aboutus.png')"
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPosition="center"
          rounded={{ lg: "12px" }}
        >
          <chakra.blockquote
            maxW="container.md"
            mx="auto"
            color={"white"}
            fontFamily="heading"
            fontSize={{ base: "md", md: "lg", lg: "xl", xl: "2xl" }}
            fontWeight={"bold"}
            textAlign={"center"}
          >
            "Komitmen dan dedikasi kami bertujuan untuk memberikan pengalaman
            perjalanan yang terbaik untuk anda."
          </chakra.blockquote>
        </Center>
        <Stack spacing={"12px"} py={"24px"}>
          <Heading
            fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
            fontWeight="bold"
            textAlign={{ base: "center", lg: "right" }}
            textTransform="uppercase"
          >
            Bersama Anda Sejak 1971
          </Heading>
          <Text textAlign={{ base: "center", lg: "right" }} fontSize="sm">
            Golden Rama Tours & Travel adalah travel agent terdepan di Indonesia
            yang telah berdiri sejak 1971. Dengan kantor - kantor cabang yang
            tersebar di Indonesia dan situs goldenrama.com, kami hadir untuk
            menjadi pintu gerbang Anda menuju destinasi yang luar biasa.
          </Text>
        </Stack>
      </Flex>
      <Box
        mx="-24px"
        pt={{ base: 0, lg: "40px" }}
        pb="50px"
        bg="brand.blue.100"
      >
        <Flex
          alignItems="center"
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          flexDir={{ base: "column", lg: "row-reverse" }}
          gap="24px"
        >
          <Box
            flexShrink={0}
            position="relative"
            as="section"
            mx={{ base: "-24px", lg: 0 }}
            h={{ base: "190px", lg: "285px" }}
            w={{ base: "full", lg: "621px" }}
            rounded={{ lg: "12px" }}
            overflow="clip"
          >
            <Image
              src="/png/bg-aboutus2.png"
              alt="bg-aboutus2"
              layout="fill"
              objectFit="cover"
            />
          </Box>
          <Box pt={{ base: "40px", lg: 0 }} px="24px">
            <Heading
              color="brand.blue.600"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
              fontWeight="bold"
              textAlign={{ base: "center", lg: "left" }}
              textTransform="uppercase"
              pb="12px"
            >
              Jelajahi Dunia Bersama Kami
            </Heading>
            <Text fontSize={"md"} textAlign={{ base: "center", lg: "left" }}>
              Selama hampir 45 tahun Golden Rama telah menjadi sahabat dan mitra
              Anda dalam menjelajahi dunia, dengan itu juga kami mencetak
              pencapaian yang luar biasa meliputi:
            </Text>
            <UnorderedList
              fontSize={"md"}
              textAlign={{ base: "center", lg: "left" }}
            >
              <ListItem>
                Setiap tahun membawa lebih dari 250.000 pelanggan setia untuk
                mengunjungi berbagai destinasi yang luar biasa.
              </ListItem>
              <ListItem>
                Bekerjasama dengan hampir 800 maskapai penerbangan.
              </ListItem>
              <ListItem>
                Bermitra dengan lebih dari 60,000 Hotel dan properti di seluruh
                dunia.
              </ListItem>
              <ListItem>Menjelajahi samudra dengan 12 kapal pesiar</ListItem>
            </UnorderedList>
          </Box>
        </Flex>
      </Box>
      <Stack
        gap={"12px"}
        pt="40px"
        pb="50px"
        as={"section"}
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"auto"}
      >
        <Heading
          fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
          fontWeight="bold"
          textAlign="center"
          textTransform="uppercase"
        >
          Golden Rama, The Milestones
        </Heading>
        <SimpleGrid gap={"24px"} columns={[1, 1, 2, 4]}>
          {props.milestones.map((item, index) => (
            <Stack gap={"12px"} alignItems={"center"} key={index}>
              <Text
                textAlign={"center"}
                color={"neutral.text.low"}
                fontSize={"lg"}
                className="tahun"
                fontWeight={"bold"}
              >
                {item.year}
              </Text>
              <Image
                objectFit="contain"
                alt={item.icon}
                className="img-block"
                height={120}
                width={328}
                src={`/png/about-us/milestones/${item.icon}`}
              />
              <Text fontSize={"md"} textAlign="center">
                {item.text}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
      <Box
        mx={"-24px"}
        bg={"brand.blue.100"}
        as={"section"}
        alignItems="flex-start"
        px={"24px"}
        pt={"40px"}
        pb={"50px"}
      >
        <Box
          maxW={{ lg: "container.lg", xl: "container.xl" }}
          mx={"auto"}
          alignItems={"flex-start"}
        >
          <Box mx={"-24px"} px={"24px"} alignSelf={"stretch"}>
            <Heading
              color="brand.blue.600"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
              fontWeight="bold"
              textAlign="center"
              textTransform="uppercase"
              pb="32px"
            >
              MENGAPA MEMILIH GOLDEN RAMA
            </Heading>
            <Swiper
              id="travel-post-banner"
              spaceBetween={24}
              slidesPerView={useBreakpointValue(
                { base: 1, md: 3 },
                { ssr: false }
              )}
            >
              {props.about.map((item, index) => (
                <SwiperSlide key={index}>
                  <Stack
                    justifyContent={"space-around"}
                    direction={"column"}
                    bg={"white"}
                    px={"15px"}
                    py={"24px"}
                    rounded={"2xl"}
                    alignItems={"center"}
                    spacing={"20px"}
                    w={"100%"}
                    h="auto"
                    flexShrink={0}
                  >
                    <Circle border="1px solid #41778A" size="40px">
                      {icon[item.icon]}
                    </Circle>
                    <Stack spacing={"5px"}>
                      <Heading
                        color={"brand.blue.400"}
                        fontSize={"lg"}
                        textAlign={"center"}
                      >
                        {item.title}
                      </Heading>
                      <Text textAlign={"center"} fontSize="sm">
                        {item.text}
                      </Text>
                    </Stack>
                  </Stack>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      </Box>
      <Box as={"section"} mx={"-24px"} px={"24px"}>
        <Flex mx="-24px" justifyContent={"center"}>
          <Box w={"full"} p={"40px"} bg={"brand.orange.400"}>
            <Text fontSize={"lg"} textAlign={"center"} color={"white"}>
              Gateway to Great Destinations : Golden Rama Melayani Lebih Dari
              225 Tujuan Wisata di Seluruh Dunia
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box as={"section"} mx={"-24px"} px={"24px"}>
        <Flex mx="-24px" bg={"brand.blue.400"} justifyContent={"center"}>
          <Stack
            justifyContent={"center"}
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            minH={"320px"}
            w={"full"}
            p={"40px"}
            position="relative"
          >
            <Image
              objectFit="contain"
              src={"/png/about-us/dummy-map.png"}
              layout={"fill"}
              alt={"map"}
              position="absolute"
              objectPosition={"right"}
            />
            <Heading
              color="white"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
              fontWeight="bold"
              textAlign="center"
              textTransform="uppercase"
            >
              Services
            </Heading>
            <Text fontSize={"sm"} textAlign={"center"} color={"white"}>
              Golden Rama memiliki berbagai layanan perjalanan dan wisata yang
              terpadu seperti: Reservasi Hotel, Tiket penerbangan domestik dan
              internasional, tour, cruise, paket, corporate incentive and
              ticketing sampai Dokumen perjalanan.
            </Text>
          </Stack>
        </Flex>
      </Box>
      <Box as={"section"} mx={"-24px"}>
        <Flex position={"relative"} minH={350} justifyContent={"start"}>
          <Image
            layout="fill"
            objectFit="cover"
            alt="dummy-services"
            style={{ filter: "brightness(50%)" }}
            src="/png/about-us/dummy-services.jpg"
          />
          <Box w={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
            <Stack
              justifyContent={{ base: "center", lg: "start" }}
              w={{ base: "full", lg: "60%" }}
              textAlign={{ base: "center", md: "left" }}
              position={"relative"}
              p={{ base: "24px", md: 24 }}
            >
              <Heading
                color="white"
                fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
                fontWeight="bold"
                textTransform="uppercase"
              >
                Integritas
              </Heading>
              <Text color={"white"} fontSize="sm">
                Menjalin kemitraan bersama Egencia yang saat ini beroperasi di
                beberapa negara di seluruh Eropa, Amerika Utara dan Asia Pasifik
                untuk menawarkan dukungan dan layanan yang luar biasa kepada
                klien kami. Jaringan kemitraan kami memungkinkan untuk melayani
                dan mendukung kebutuhan perjalanan Anda di seluruh dunia dengan
                lebih baik
              </Text>
              <Box h={100} w={{ base: "full", md: 256 }} position={"relative"}>
                <Image
                  objectFit="contain"
                  alt="egencia"
                  layout="fill"
                  src="/png/about-us/egencia-gre.png"
                />
              </Box>
              <Text color="brand.blue.100" fontSize="10px" fontStyle="italic">
                © 2022 Egencia LLC. All rights reserved. Egencia and the
                stylized bird in flight logo are trademarks and registered
                trademarks of Egencia LLC
              </Text>
            </Stack>
          </Box>
        </Flex>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const milestones = [
    {
      year: 1971,
      icon: "logolama.png",
      text: "Hadir sebagai General Sales Agent untuk British Overseas Airways Corporation",
    },
    {
      year: 1990,
      icon: "leisure.png",
      text: "Memperkenalkan unit bisnis Leisure Travel",
    },
    {
      year: 2003,
      icon: "insentif.png",
      text: "Meluncurkan divisi insentif yang menangani kebutuhan korporasi",
    },
    {
      year: 2008,
      icon: "golden-logo3.png",
      text: "Meluncurkan visi dan misi sebagai pintu gerbang menuju destinasi yang luar biasa",
    },
    {
      year: 2015,
      icon: "gedung.png",
      text: "Peresmian kantor pusat baru yang berlokasi di Jln Tanah Abang II no. 73-75",
    },
    {
      year: 2017,
      icon: "egencia.png",
      text: "Menjalin kemitraan strategis Global bersama  Egencia yang memiliki jaringan tersebar di lebih  dari 70+ Negara",
    },
    {
      year: 2018,
      icon: "greet.png",
      text: "Membantu ekosistem industri pariwisata dengan menghadirkan solusi  teknologi GROWS untuk pelaku bisnis wisata . Tidak berhenti disini  GREET juga hadir sebagai teknologi yang mampu memenuhi kebutuhan  perjalanan perusahaan.",
    },
    {
      year: 2020,
      icon: "be-safe.png",
      text: "Meluncurkan program BeSafe sebagai upaya  adaptasi terhadap perubahan lanskap perjalanan  yang terintegrasi dengan sektor kesehatan.",
    },
  ];

  const about = [
    {
      icon: "globe",
      title: "Terdepan",
      text: "Dengan teknologi yang terdepan dan terintegrasi kami memberikan kemudahan, kenyamanan dan keamanan dalam kebutuhan perjalanan Anda.",
    },
    {
      icon: "achieve",
      title: "Kualitas Pelayanan",
      text: "Konsistensi dan pengalaman untuk memberikan pelayanan dari hati merupakan dedikasi kami dalam memberikan kualitas pelayanan yang terbaik.",
    },
    {
      icon: "thumb",
      title: "Layanan yang Terintegrasi",
      text: "Dengan berbagai layanan perjalanan wisata yang terintegrasi sebagai solusi untuk kebutuhan perjalanan anda. Kami melayani segala kebutuhan konsumen baik dari sektor ritel ataupun korporasi",
    },
  ];

  const meta = {
    title: "Company Profile",
  };

  return {
    props: { milestones, about, meta },
  };
};

export default AboutUs;
