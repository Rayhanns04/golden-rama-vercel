import {
  AspectRatio,
  Box,
  Container,
  Circle,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import qs from "qs";
import {
  getSlugTours,
  getTourMomentsBySlug,
  getTourBySlugV2,
} from "../../../../src/services/tour.service";
import { CustomOrangeFullWidthButton } from "../../../../src/components/button";
import CameraIcon from "../../../../public/svg/icons/camera.svg";
import GalleryIcon from "../../../../public/svg/icons/gallery.svg";
import Layout from "../../../../src/components/layout";
import { toTitleCase } from "../../../../src/helpers";
import { useState } from "react";
import IMAGE_PLACEHOLDER from "public/png/placeholder-tour.png";
import IMAGE_NULL_PLACEHOLDER from "public/png/placeholder-tour.png";

const GalleryTour = () => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const { id } = router.query;
  const { data: tour, isLoading: isLoadingTour } = useQuery(
    ["getTour", id],
    () => getTourBySlugV2({ tourSlug: id }),
    {
      enabled: !!id,
    }
  );
  const { data: moments, isLoading: isLoadingMoments } = useQuery(
    ["getTourMomentsBySlug", id],
    () => getTourMomentsBySlug(id)
  );

  return (
    <Layout
      type={"nested"}
      pagetitle={tour?.name ? `Gallery | ${tour?.name}` : "Semua Foto"}
    >
      <Container maxWidth="container.xl" px={0}>
        <Box>
          <Skeleton isLoaded={!isLoadingTour} minHeight="24px">
            <Text
              color="neutral.text.high"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontFamily="heading"
              fontWeight="semibold"
              lineHeight={1.2}
              pb="2px"
            >
              {tour?.name}
            </Text>
          </Skeleton>
          <Skeleton
            hidden={!isLoadingTour}
            isLoaded={!isLoadingTour}
            minHeight="24px"
            width="50%"
            mt="4px"
          />
          <Text
            color="neutral.text.low"
            fontSize="sm"
            fontFamily="body"
            pb="6px"
          >
            {tour?.countries?.map((country) => country.name).join(", ")}
          </Text>
          <HStack>
            <Skeleton isLoaded={!isLoadingTour} minHeight="12px">
              <HStack flexBasis={{ base: "50%", md: "20%" }}>
                <CameraIcon />
                <Text color="brand.blue.400" fontSize="sm" fontFamily="body">
                  {tour?.pictures.length} Foto dari GR
                </Text>
              </HStack>
            </Skeleton>
            <Skeleton isLoaded={!isLoadingTour} minHeight="12px">
              <HStack flexBasis={{ base: "50%", md: "20%" }}>
                <GalleryIcon />
                <Text color="brand.blue.400" fontSize="sm" fontFamily="body">
                  {moments?.length} Foto Pengunjung
                </Text>
              </HStack>
            </Skeleton>
          </HStack>
        </Box>
        <Tabs variant="unstyled" py="24px">
          <Stack mx={"auto"}>
            <HStack
              as={TabList}
              spacing={4}
              justifyContent={{ base: "center", md: "start" }}
            >
              <Tab
                borderRadius="full"
                bg="white"
                fontSize={{ base: "sm", md: "md" }}
                _selected={{ color: "white", bg: "brand.blue.400" }}
              >
                Foto Golden Rama
              </Tab>
              <Tab
                borderRadius="full"
                bg="white"
                fontSize={{ base: "sm", md: "md" }}
                _selected={{ color: "white", bg: "brand.blue.400" }}
              >
                Foto Pengunjung
              </Tab>
            </HStack>
          </Stack>
          <TabPanels>
            <TabPanel p={0}>
              <Box as="section" py={{ base: "24px", md: "48px" }}>
                <Text
                  color="neutral.text.high"
                  fontSize="lg"
                  fontFamily="heading"
                  fontWeight="semibold"
                  pb="24px"
                >
                  Semua Foto
                </Text>
                <SimpleGrid columns={[1, 1, 2, 3]} gap="12px">
                  {(tour?.pictures || Array.from({ length: 5 })).map(
                    (picture, index) => (
                      <AspectRatio
                        key={index}
                        as={Skeleton}
                        ratio={366 / 200}
                        isLoaded={!isLoadingTour}
                        borderRadius="4px"
                        overflow="clip"
                      >
                        <Image
                          src={
                            imageError
                              ? IMAGE_PLACEHOLDER
                              : picture?.url || IMAGE_NULL_PLACEHOLDER
                          }
                          alt="photo"
                          layout="fill"
                          objectFit="cover"
                          placeholder="empty"
                          onError={() => {
                            setImageError(true);
                          }}
                        />
                      </AspectRatio>
                    )
                  )}
                </SimpleGrid>
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <Container
                as="section"
                px={0}
                py={{ base: "24px", md: "48px" }}
                maxWidth="container.md"
              >
                <Text
                  color="neutral.text.high"
                  fontSize="lg"
                  fontFamily="heading"
                  fontWeight="semibold"
                  pb="24px"
                >
                  Semua Foto
                </Text>
                <Stack gap="32px">
                  {(moments || Array.from({ length: 3 })).map(
                    (moment, index) => {
                      const list = [
                        {
                          type: "Location",
                          value: moment?.attributes.location,
                        },
                        {
                          type: "Tour Name",
                          value: moment?.attributes.tour,
                        },
                        {
                          type: "Departure Date",
                          value: moment
                            ? format(
                                new Date(
                                  moment?.attributes.departure || undefined
                                ),
                                "dd MMM yyyy"
                              )
                            : "",
                        },
                      ];
                      return (
                        <Stack key={index} spacing="12px">
                          <HStack justifyContent="space-between">
                            <HStack gap="12px">
                              <Text color="neutral.text.high" fontSize="sm">
                                {toTitleCase(
                                  moment?.attributes.customerDetail?.data
                                    ?.attributes.full_name
                                )}
                              </Text>
                            </HStack>
                            <Text color="neutral.text.low" fontSize="sm">
                              {moment &&
                                format(
                                  new Date(moment.attributes.createdAt),
                                  "dd MMM yyyy"
                                )}
                            </Text>
                          </HStack>
                          <AspectRatio
                            as={Skeleton}
                            isLoaded={!isLoadingMoments}
                            ratio={366 / 200}
                            borderRadius="4px"
                            overflow="clip"
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                                moment?.attributes.image.data.attributes.url ||
                                "/"
                              }`}
                              alt="photo"
                              layout="fill"
                              objectFit="cover"
                            />
                          </AspectRatio>
                          <Box>
                            <Text
                              color="neutral.text.high"
                              fontSize="lg"
                              fontWeight="semibold"
                              pb="12px"
                            >
                              {moment?.attributes.title}
                            </Text>
                            <Text
                              color="neutral.text.low"
                              fontSize="sm"
                              pb="12px"
                            >
                              {moment?.attributes.description}
                            </Text>
                            <Stack spacing="8px">
                              {list.map((item, i) => (
                                <HStack key={i} justifyContent="space-between">
                                  <Text color="neutral.text.low" fontSize="sm">
                                    {item.type}:
                                  </Text>
                                  <Text color="neutral.text.low" fontSize="sm">
                                    {item?.value}
                                  </Text>
                                </HStack>
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      );
                    }
                  )}
                </Stack>
                <Box position="sticky" bottom={0} py="24px">
                  <NextLink
                    href={`/tours/upload-moment?${qs.stringify({
                      slug: id,
                      tour: tour?.name,
                    })}`}
                    passHref
                  >
                    <CustomOrangeFullWidthButton>
                      Upload Foto
                    </CustomOrangeFullWidthButton>
                  </NextLink>
                </Box>
              </Container>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default GalleryTour;
