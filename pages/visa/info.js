import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Twemoji from "react-twemoji";
import Layout from "../../src/components/layout";
import countries from "../../src/mocks/countries.json";

const VisaInfo = ({ regions, meta }) => {
  const router = useRouter();
  const { type } = router.query;
  const title = {
    free: "List Negara Bebas Visa",
    arrival: "List Negara Visa Saat Kedatangan",
    "not-processed": "List Negara Visa Tidak Dapat Diproses",
  };
  return (
    <Layout type="nested" pagetitle="VISA" meta={meta}>
      <Box
        maxW={{ md: "container.lg", lg: "container.xl" }}
        mx="auto"
        py="24px"
      >
        <Heading color="brand.blue.400" fontSize="2xl" fontWeight="bold">
          {title[type]}
        </Heading>
        <Text fontSize="xs">
          Lihat beberapa negara yang tidak memelukan visa
        </Text>
      </Box>
      <Box h="8px" bg="brand.blue.100" mx="-24px" />
      <SimpleGrid
        columns={[1, 1, 1, 2]}
        columnGap={{ base: "12px", lg: "48px" }}
        maxW={{ md: "container.lg", lg: "container.xl" }}
        mx="auto"
      >
        {regions.map((region, index) => (
          <Box key={index} py="24px">
            <Heading fontSize="xl" fontWeight="bold">
              {region.name}
            </Heading>
            <Text fontSize="xs">Tersedia {region.countries.length} Negara</Text>
            <Stack pt="12px">
              {region.countries.map((country, index) => (
                <HStack key={index} justifyContent="space-between">
                  <HStack spacing="12px">
                    <Text
                      as={Twemoji}
                      w="16px"
                      options={{ className: "twemoji" }}
                    >
                      {countries.find((c) => c.code === country.code).emoji}
                    </Text>
                    <Text fontSize="sm">
                      {countries.find((c) => c.code === country.code).name}
                    </Text>
                  </HStack>
                  <Text fontSize="xs">
                    {country.day ? `${country.day} Hari Tinggal` : "-"}
                  </Text>
                </HStack>
              ))}
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Layout>
  );
};

export const getServerSideProps = ({ query }) => {
  const regions = {
    free: [
      {
        name: "Negara ASEAN",
        countries: [
          { code: "BN", day: 14 },
          { code: "PH", day: 30 },
          { code: "LA", day: 30 },
          { code: "KH", day: 30 },
          { code: "MY", day: 30 },
          { code: "MM", day: 14 },
          { code: "SG", day: 30 },
          { code: "TH", day: 30 },
          { code: "VN", day: 30 },
        ],
      },
      {
        name: "Negara Non-ASEAN",
        countries: [
          { code: "CL", day: 90 },
          { code: "DM", day: 21 },
          { code: "EC", day: 90 },
          { code: "FJ", day: 120 },
          { code: "HT", day: 90 },
          { code: "HK", day: 30 },
          { code: "CO", day: 90 },
          { code: "MO", day: 30 },
          { code: "MA", day: 90 },
          { code: "FM", day: 30 },
          { code: "PE", day: 183 },
          { code: "BR", day: 30 },
          { code: "QA", day: 30 },
          { code: "UZ", day: 30 },
          { code: "KZ", day: 30 },
          { code: "BB", day: 30 },
          { code: "KG", day: 30 },
          { code: "MV", day: 30 },
        ],
      },
    ],
    arrival: [
      {
        name: "AMERICA",
        countries: [{ code: "NI", day: 90 }],
      },
      {
        name: "ASIA",
        countries: [
          { code: "MV", day: 30 },
          { code: "NP", day: 90 },
          { code: "PG", day: 60 },
          { code: "TL", day: 30 },
        ],
      },
      {
        name: "AFRICA",
        countries: [
          { code: "DJ", day: 30 },
          { code: "GW", day: 90 },
          { code: "KE", day: 90 },
          { code: "KM", day: 90 },
          { code: "MG", day: 90 },
          { code: "SO", day: 90 },
          { code: "TZ", day: 90 },
          { code: "UG" },
          { code: "ZW", day: 90 },
        ],
      },
      {
        name: "MIDDLE EAST",
        countries: [
          { code: "AM", day: 120 },
          { code: "IR", day: 15 },
          { code: "OM", day: 10 },
          { code: "TJ", day: 45 },
        ],
      },
    ],
    "not-processed": [
      {
        name: "SEMUA NEGARA",
        countries: [
          { code: "AT" },
          { code: "BE" },
          { code: "CZ" },
          { code: "EE" },
          { code: "HU" },
          { code: "IS" },
          { code: "HR" },
          { code: "LV" },
          { code: "LI" },
          { code: "LT" },
          { code: "LU" },
          { code: "MT" },
          { code: "PL" },
          { code: "SK" },
          { code: "SI" },
          { code: "SE" },
        ],
      },
    ],
  };

  return {
    props: {
      regions: regions[query.type],
      meta: {
        title: "VISA",
      },
    },
  };
};

export default VisaInfo;
