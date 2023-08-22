import {
  Box,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { forwardRef, useState } from "react";
import { CustomDivider } from "../../src/components/divider";
import Layout from "../../src/components/layout";
import NextLink from "next/link";
import MonthsActiveIcon from "../../public/svg/icons/months-active.svg";
import MonthsInactiveIcon from "../../public/svg/icons/months-inactive.svg";
import SeasonsActiveIcon from "../../public/svg/icons/weather-active.svg";
import SeasonsInactiveIcon from "../../public/svg/icons/weather-inactive.svg";
import { useRouter } from "next/router";

const Destinations = () => {
  const router = useRouter();
  const { active } = router.query;
  const [activeTab, setActiveTab] = useState(0);
  React.useEffect(() => {
    if (active === "musim") {
      setActiveTab(1);
    }
  }, [active]);
  return (
    <Layout
      type="alt"
      pagetitle="Inspirasi Destinasi Liburan"
      pagedescription={
        "Pilih Destinasi liburan kamu dari Bulan - bulan Pilihan & Musim - musim menarik yang tak terlupakan."
      }
    >
      <Box>
        <Tabs isFitted onChange={setActiveTab} index={activeTab}>
          <TabList
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            border={0}
          >
            <Tab
              color={"neutral.text.low"}
              p={"24px"}
              fontSize="sm"
              _selected={{
                color: "brand.blue.400",
                fontWeight: "bold",
              }}
              border={0}
            >
              <Flex alignItems={"center"} gap={"10px"}>
                {activeTab === 0 ? (
                  <MonthsActiveIcon />
                ) : (
                  <MonthsInactiveIcon />
                )}
                Bulan
              </Flex>
            </Tab>
            <Tab
              color={"neutral.text.low"}
              p={"24px"}
              fontSize="sm"
              _selected={{
                color: "brand.blue.400",
                fontWeight: "bold",
              }}
              border={0}
            >
              <Flex alignItems={"center"} gap={"10px"}>
                {activeTab === 1 ? (
                  <SeasonsActiveIcon />
                ) : (
                  <SeasonsInactiveIcon />
                )}
                Musim{" "}
              </Flex>
            </Tab>
          </TabList>
          <CustomDivider />
          <TabPanels
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
          >
            <TabPanel px={0}>
              <Box as={"section"} py={"24px"}>
                <SimpleGrid columns={[1, 2, 3]} spacing={"16px"}>
                  {[
                    { name: "Januari", value: "january", month: 1 },
                    { name: "Februari", value: "february", month: 2 },
                    { name: "Maret", value: "march", month: 3 },
                    { name: "April", value: "april", month: 4 },
                    { name: "Mei", value: "may", month: 5 },
                    { name: "Juni", value: "june", month: 6 },
                    { name: "Juli", value: "july", month: 7 },
                    { name: "Agustus", value: "august", month: 8 },
                    { name: "September", value: "september", month: 9 },
                    { name: "Oktober", value: "october", month: 10 },
                    { name: "November", value: "november", month: 11 },
                    { name: "Desember", value: "december", month: 12 },
                  ].map((item, index) => (
                    <LinkBox key={index}>
                      <NextLink
                        href={
                          "/destinations/months/" + item.value.toLowerCase()
                        }
                      >
                        <Box
                          as="a"
                          rel="canonical"
                          overflow={"hidden"}
                          rounded={"xl"}
                          position={"relative"}
                        >
                          <LinkOverlay>
                            <Box h="100px">
                              <Image
                                objectFit="cover"
                                layout="fill"
                                style={{ filter: "brightness(0.5)" }}
                                src={`/png/destinations/months/${item.name}.jpg`}
                                alt={item.name}
                                priority={index < 11}
                              />
                            </Box>
                            <Flex justifyContent={"center"}>
                              <Heading
                                display="flex"
                                justifyContent={"center"}
                                alignItems={"center"}
                                color={"white"}
                                position={"absolute"}
                                inset={0}
                                fontSize={{ base: "md", md: "lg" }}
                                textAlign={"center"}
                              >
                                {item.name}
                              </Heading>
                            </Flex>
                          </LinkOverlay>
                        </Box>
                      </NextLink>
                    </LinkBox>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
            <TabPanel px={0}>
              <Box as={"section"} py={"24px"}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={"16px"}>
                  {[
                    { name: "Musim Dingin", value: "winter" },
                    { name: "Musim Semi", value: "spring" },
                    { name: "Musim Panas", value: "summer" },
                    { name: "Musim Gugur", value: "fall" },
                  ].map((item, index) => (
                    <LinkBox key={index}>
                      <NextLink
                        href={
                          "/destinations/seasons/" + item.value.toLowerCase()
                        }
                      >
                        <Box
                          as="a"
                          rel="canonical"
                          overflow={"hidden"}
                          rounded={"xl"}
                          position={"relative"}
                        >
                          <LinkOverlay>
                            <Box h="100px">
                              <Image
                                objectFit="cover"
                                layout="fill"
                                style={{ filter: "brightness(0.5)" }}
                                src={`/png/destinations/seasons/${item.value}.jpg`}
                                alt={item.name}
                                priority={index < 11}
                              />
                            </Box>
                            <Flex justifyContent={"center"}>
                              <Heading
                                display="flex"
                                justifyContent={"center"}
                                alignItems={"center"}
                                color={"white"}
                                position={"absolute"}
                                inset={0}
                                fontSize={{ base: "md", md: "lg" }}
                                textAlign={"center"}
                              >
                                {item.name}
                              </Heading>
                            </Flex>
                          </LinkOverlay>
                        </Box>
                      </NextLink>
                    </LinkBox>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Inspirasi Destinasi Liburan",
        description:
          "Pilih Destinasi liburan kamu dari Bulan - bulan Pilihan & Musim - musim menarik yang tak terlupakan.",
      },
    },
  };
};

export default Destinations;
