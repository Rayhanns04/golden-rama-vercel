import {
  chakra,
  AspectRatio,
  Box,
  Center,
  Circle,
  Heading,
  SimpleGrid,
  Text,
  Link,
  Stack,
} from "@chakra-ui/react";
import { data } from "autoprefixer";
import Image from "next/image";
import NextLink from "next/link";
import React from "react";
import Layout from "../src/components/layout";
import HeadquarterIcon from "../public/svg/icons/headquarter.svg";
import OfficeIcon from "../public/svg/icons/office.svg";
import { formatPhoneNumber } from "../src/helpers";

const ContactUs = (props) => {
  const ContactItem = ({
    name,
    address,
    tel,
    info = null,
    country = null,
    city,
    postalCode = null,
    isHeadOffice = false,
  }) => {
    return (
      <>
        {!isHeadOffice && (
          <Box className="col-sm-6 col-md-3">
            <Box className="alamat_cabang">
              <Text fontSize={"sm"} className="title">
                <chakra.strong>{name}</chakra.strong>
              </Text>

              <Text fontSize={"sm"} className="desc">
                {address}
                {city && ","}
                <br />
                {city} {postalCode} {country ? ", " + country : ""}
                {city && <br />}
                {tel.map((item, i) => (
                  <>
                    Tel.{" "}
                    <Link href={"tel:" + item} color="brand.blue.400">
                      {item}
                    </Link>
                    <br />
                  </>
                ))}
                {info &&
                  info.map((item, i) => (
                    <>
                      {item} <br />
                    </>
                  ))}
              </Text>
            </Box>
          </Box>
        )}
      </>
    );
  };
  const HeadOfficeItem = ({ data }) => {
    if (data.isHeadOffice)
      return (
        <Box className="col-sm-12" pb={"24px"}>
          <Box textAlign={"center"}>
            <Heading fontSize={"lg"} textTransform="uppercase">
              Our HeadQuarter
            </Heading>
            <Circle my="24px" size="68px" border="2px solid #41778A" mx="auto">
              <HeadquarterIcon />
            </Circle>
            <Text fontSize={"sm"} className="title">
              <chakra.strong>Golden Rama Head Office</chakra.strong>
            </Text>

            <Text fontSize={"sm"} className="desc">
              {data.address},
              <br />
              {data.city} {data.postalCode}, {data.country}.
              <br />
              {data.tel.map((item, i) => (
                <>
                  Tel :{" "}
                  <Link href={"tel:" + item} color="brand.blue.400">
                    {item}
                  </Link>
                </>
              ))}
              <br />
              E-mail :{" "}
              <Link
                href="mailto:contact.us@goldenrama.com"
                color="brand.blue.400"
              >
                contact.us@goldenrama.com
              </Link>
            </Text>

            <Text fontSize={"sm"} className="desc">
              {data.additionalInfo.map((item, i) => (
                <>
                  {item}
                  <br />
                </>
              ))}
            </Text>
          </Box>
        </Box>
      );
  };
  return (
    <Layout pagetitle={"Hubungi Kami"} meta={props.meta}>
      <Box mx="-24px">
        <AspectRatio
          ratio={414 / 200}
          mx="auto"
          maxW="container.sm"
          borderRadius={{ md: "12px" }}
          overflow="clip"
        >
          <Image
            src="/png/hq-building.png"
            alt="Headquarter"
            layout="fill"
            objectFit="cover"
          />
        </AspectRatio>
      </Box>
      <Box
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"auto"}
        py={"24px"}
      >
        <Stack spacing={"12px"} textAlign={{ md: "center" }}>
          <Heading fontSize={"lg"} textTransform="uppercase">
            Hubungi Kami
          </Heading>
          <Box className="description">
            <Text fontSize={"sm"}>
              Silakan kunjungi kantor Golden Rama Tours & Travel yang terdekat
              dengan lokasi Anda.
            </Text>

            <Text fontSize={"sm"} fontWeight={"bold"} className="hotlines">
              Hotlines:{" "}
              <Link href="tel:02129806000" color="brand.blue.400">
                (021) 2980 6000
              </Link>{" "}
              /{" "}
              <Link href="tel:02129631999" color="brand.blue.400">
                (021) 2963 1999
              </Link>
            </Text>
            <Text fontSize={"sm"} fontWeight={"bold"} className="hotlines">
              Email:{" "}
              <Link
                href="mailto:contact.us@goldenrama.com"
                color="brand.blue.400"
              >
                contact.us@goldenrama.com
              </Link>
            </Text>
          </Box>
        </Stack>
        <Box py={"24px"}>
          <Box
            className="row"
            bg="brand.blue.100"
            w="100vw"
            ml="calc(50% - 50vw)"
            pt="40px"
            pb="50px"
          >
            {props.data.map((item, i) => (
              <HeadOfficeItem data={item} key={i} />
            ))}
          </Box>
          <Center flexDir="column" pt="40px">
            <Heading fontSize={"lg"} textTransform="uppercase">
              Our Branch
            </Heading>
            <Circle my="24px" size="68px" border="2px solid #41778A" mx="auto">
              <OfficeIcon />
            </Circle>
          </Center>
          <SimpleGrid columns={[1, 2, 3, 4]} gap={"24px"} className="row">
            {props.data.map((item, i) => (
              <ContactItem
                key={i}
                address={item.address}
                info={item.additionalInfo}
                name={item.name}
                tel={item.tel}
                city={item.city}
                country={item.country}
                postalCode={item.postalCode}
                isHeadOffice={item.isHeadOffice}
              />
            ))}
          </SimpleGrid>
        </Box>
        <Stack
          spacing={"12px"}
          className="text-center col-xs-12"
          // m={{ md: 20, base: "24px" }}
          m={"24px"}
        >
          <Box className="row">
            <Text fontSize={"sm"} textAlign={"center"} className="title">
              <chakra.span fontSize={"md"}>
                Email:{" "}
                <chakra.u fontWeight={"bold"}>
                  <NextLink href="mailto:contact.us@goldenrama.com?Subject=Bantuan Pemesanan&amp;Body=">
                    contact.us@goldenrama.com
                  </NextLink>
                </chakra.u>
              </chakra.span>
            </Text>
          </Box>

          <Box hidden className="row">
            <Text fontSize={"sm"} textAlign={"center"} className="title">
              <Box>
                <chakra.span
                  w={"full"}
                  justifyContent={"center"}
                  display={"flex"}
                  alignItems={"center"}
                  fontSize={"md"}
                >
                  &nbsp;
                  <Image
                    alt=""
                    src="/png/contact-us/1024px-LINE_logo.svg.png"
                    width={25}
                    height={25}
                  />
                  &nbsp;LINE ID:{" "}
                  <chakra.u>
                    <chakra.strong>
                      <NextLink
                        href="http://line.me/ti/p/~@goldenramatours"
                        passHref
                      >
                        <Link color={"brand.blue.400"} isExternal>
                          @GoldenRamaTours
                        </Link>
                      </NextLink>
                    </chakra.strong>
                  </chakra.u>
                </chakra.span>
              </Box>
            </Text>
          </Box>

          <Box className="col-sm-4 sosmed">&nbsp;</Box>
        </Stack>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async (ctx) => {
  const data = [
    {
      name: "Kantor Pusat",
      address: "Jl. Tanah Abang II No. 73 - 75,  10160, Indonesia.",
      city: "Jakarta Pusat",
      postalCode: "10160",
      country: "Indonesia",
      tel: ["(021) 2980 6000"],
      additionalInfo: [
        "Senin - Jumat : 08.45 - 16.45",
        "Sabtu : 08.45 - 14.00",
        "Minggu & Hari libur : Tutup",
      ],
      isHeadOffice: true,
    },
    {
      name: "Golden Rama Menteng",
      address: "Jl. Boulevard Barat Raya Block LA-1 No. 26 - 27",
      city: "Jakarta",
      postalCode: "14240",
      tel: ["(021) 2980 6000"],
    },
    {
      name: "Golden Rama Kelapa Gading",
      address: "Jl. Boulevard Barat Raya Block LA-1 No. 26 - 27",
      city: "Jakarta",
      postalCode: "14240",
      tel: ["(021) 451 3300", "(021)450 2987"],
    },
    {
      name: "Golden Rama Kebayoran",
      address: "Wijaya Graha Puri Block G31-32 Jalan Wijaya II, Kebayoran Baru",
      city: "Jakarta",
      postalCode: "12160",
      tel: ["(021) 2277 6888", "(021) 720 4240"],
    },
    {
      name: "Golden Rama Gandaria City",
      address:
        "Mall Gandaria City, Lt.2 unit 245 JL. Sultan Iskandar Muda, Kebayoran Lama",
      city: "Jakarta Selatan",
      tel: ["(021) 2277 3918"],
    },
    {
      name: "Golden Rama Lippo Mall Puri",
      address:
        "Lippo Mall Puri Lt. 2 Unit 11 Jalan Puri Indah Raya Block U1, Puri Indah, CBD Kembangan",
      city: "Jakarta",
      postalCode: "11610",
      tel: ["(021) 2952 1978"],
    },
    {
      name: "Golden Rama Puri Indah Mall",
      address:
        "Puri Indah Mall Lt.2 Unit E-206A Jl. Puri Agung No.1, Kembangan",
      city: "Jakbar",
      postalCode: "11610",
      tel: ["(021) 582 2427"],
    },
    {
      name: "Golden Rama Serpong",
      address: "Jl. Boulevard Gading Serpong Ruko Alexandrite ALX003 No. 6",
      city: "Tangerang",
      postalCode: "15810",
      tel: ["(021) 5421 1500"],
    },
    {
      name: "Golden Rama Surabaya",
      address: "Ruko Darma Square Block D-06 Jalan Raya Darmo No. 54",
      city: "Surabaya",
      postalCode: "60265",
      tel: ["(031) 566 6565"],
    },
    {
      name: "Golden Rama Bandung",
      address: "Jl. Pajajaran No. 6",
      city: "Bandung",
      postalCode: "40116",
      tel: ["(022) 420 6457", "(022) 420 6458", "0812 2229 9644"],
    },
    {
      name: "Golden Rama Bali",
      address: "Jl. Sunset Road No. 78",
      city: "Kuta",
      postalCode: "80361",
      tel: ["(0361) 4755 999"],
    },
    {
      name: "Golden Rama Makassar",
      address: "Phinisi Point Lt Dasar (GF) – 32 Jl. Metro Tanjung Bunga No.2",
      tel: ["(0411) 899 3999"],
    },
  ];

  return {
    props: {
      data,
      meta: {
        title: "Hubungi Kami",
      },
    },
  };
};

export default ContactUs;
