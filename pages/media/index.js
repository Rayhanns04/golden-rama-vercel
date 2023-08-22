import { useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  LinkBox,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import Layout from "../../src/components/layout";
import {
  CustomFilterButton,
  CustomOrangeFullWidthButton,
} from "../../src/components/button";
import SearchIcon from "../../public/svg/header-search.svg";
import SortIcon from "../../public/svg/icons/sort.svg";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMedias } from "../../src/services/media.service";

const sorts = [
  { label: "Direkomendasikan", value: "isRecommended" },
  { label: "Terbaru", value: "updatedAt" },
];

const Media = () => {
  const [sort, setSort] = useState("isRecommended");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const { isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, data } =
    useInfiniteQuery(
      ["getMedias", searchTerm, sort],
      async ({ pageParam = 1 }) => {
        try {
          const response = await getMedias(searchTerm, pageParam, sort);
          return response;
        } catch (error) {
          Promise.reject(error);
        }
      },
      {
        getNextPageParam: (lastpage) => {
          try {
            if (lastpage) {
              if (lastpage.meta.pagination.pageCount === 0) return undefined;
              if (
                lastpage.meta.pagination.page !==
                lastpage.meta.pagination.pageCount
              ) {
                return lastpage.meta.pagination.page + 1;
              } else return undefined;
            }
          } catch (error) {
            console.error(error);
            return undefined;
          }
        },
      }
    );
  const { data: metatitle, isLoading: isLoadingMeta } = useQuery(
    ["getMedias"],
    () => getMedias(searchTerm, 1, sort),
    { keepPreviousData: true }
  );
  return (
    <Layout type="nested" pagetitle="Media">
      <Center
        mx="-24px"
        bgImage="url('/png/bg-media.png')"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        minH="400px"
      >
        <Container position="relative" maxW="container.xl" px="24px">
          <Text
            color="white"
            fontFamily="heading"
            fontSize="xl"
            fontWeight="bold"
            mb="40px"
          >
            Berita seputar tour terupdate dari berbagai macam negara populer
            yang dapat kamu kunjungi
          </Text>
          <Stack spacing="16px">
            <InputGroup>
              <Input
                type="text"
                variant="filled"
                size="lg"
                bg="white"
                colorScheme="brand.blue"
                _focus={{
                  bg: "white",
                }}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <InputRightElement pointerEvents="none">
                <SearchIcon />
              </InputRightElement>
            </InputGroup>
            <Text color="white" fontWeight="bold">
              <Text
                as="span"
                color="neutral.line.secondary"
                fontWeight="normal"
              >
                Berita Terbaru:{"  "}
              </Text>
              {/* mengambil tag dari 3 artikel terbaru */}
              {!isLoadingMeta && (
                <Text as="span">
                  {metatitle.data.map((item, i) => (
                    <Text as="span" key={i}>
                      {item.attributes.metatitle}
                      {i !== metatitle.data.length - 1 && ", "}
                    </Text>
                  ))}
                </Text>
              )}
            </Text>
          </Stack>
          <Text
            position="absolute"
            bottom={-82}
            right={0}
            p="24px"
            color="white"
            fontWeight="bold"
          >
            <Text as="span" color="neutral.line.secondary" fontWeight="normal">
              Berita oleh:{"  "}
            </Text>
            Golden Rama
          </Text>
        </Container>
      </Center>
      <HStack
        justifyContent="space-between"
        py="20px"
        maxW="container.xl"
        mx="auto"
      >
        {!isLoading && (
          <Text fontSize="xs">
            {" "}
            {data.pages[0].meta.pagination.total} Berita Tersedia
          </Text>
        )}
        <Button
          variant="ghost"
          colorScheme="brand.blue"
          color="brand.blue.400"
          fontSize="xs"
          fontWeight="normal"
          leftIcon={<SortIcon />}
          onClick={onOpen}
        >
          Urutkan
        </Button>
      </HStack>
      <Box bg="brand.blue.100" mx="-24px" px="24px" py="24px">
        {!isLoading ? (
          <SimpleGrid columns={[1, 1, 2, 3]} gap="24px">
            {data.pages.map((group) =>
              group.data.map((item, i) => (
                <NextLink key={i} href={`/media/${item.attributes.slug}`}>
                  <a rel="canonical">
                    <LinkBox borderRadius="12px" bg="white" overflow="clip">
                      <AspectRatio position="relative" ratio={366 / 148}>
                        <Skeleton isLoaded={true}>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item?.attributes.thumbnail.data?.attributes.url}`}
                            alt="unsplash"
                            layout="fill"
                          />
                        </Skeleton>
                      </AspectRatio>
                      <Box p="16px">
                        <SkeletonText
                          isLoaded={true}
                          noOfLines={3}
                          spacing={2}
                          minH="1rem"
                        >
                          <Text color="neutral.text.high" fontWeight="bold">
                            {item.attributes.title}
                          </Text>
                        </SkeletonText>
                      </Box>
                    </LinkBox>
                  </a>
                </NextLink>
              ))
            )}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={[1, 1, 2, 3]} gap="24px">
            {Array.from({ length: 3 }).map((_, i) => (
              // <NextLink key={i} href={`/media/${i}`}>
              <a key={i}>
                <LinkBox borderRadius="12px" bg="white" overflow="clip">
                  <AspectRatio position="relative" ratio={366 / 148}>
                    <Skeleton isLoaded={true}>
                      {/* <Image
                        src="/png/unsplash_mSESwdMZr-A.png"
                        alt="unsplash"
                        layout="fill"
                      /> */}
                    </Skeleton>
                  </AspectRatio>
                  <Box p="16px">
                    <SkeletonText
                      isLoaded={true}
                      noOfLines={3}
                      spacing={2}
                      minH="1rem"
                    >
                      <Text fontSize="xs">
                        {format(new Date(), "dd MMMM yyyy, HH:mm")}
                      </Text>
                      <Text color="neutral.text.high" fontWeight="bold">
                        {/* Pernah Dijadikan Lokasi Syuting Drama Korea,
                        Tempat-tempat Ini Kini Jadi Destinasi Wisata */}
                      </Text>
                    </SkeletonText>
                  </Box>
                </LinkBox>
              </a>
              // </NextLink>
            ))}
          </SimpleGrid>
        )}

        <Center>
          <CustomOrangeFullWidthButton
            maxW="container.sm"
            hidden={!hasNextPage}
            onClick={fetchNextPage}
            isLoading={isFetchingNextPage}
          >
            Lihat Lebih Banyak
          </CustomOrangeFullWidthButton>
        </Center>
      </Box>
      <ModalSort
        isOpen={isOpen}
        onClose={onClose}
        sortState={[sort, setSort]}
      />
    </Layout>
  );
};

const ModalSort = ({ isOpen, onClose, sortState }) => {
  const [sort, setSort] = sortState;
  const [temp, setTemp] = useState(sort);
  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => setSort(temp)}
      title="Urutkan"
      footer="Terapkan"
    >
      <RadioGroup
        onChange={(value) => setTemp(value)}
        defaultValue={sort}
        colorScheme="brand.blue"
      >
        <Stack spacing="12px">
          {sorts.map((item) => (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </CustomFilterButton>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Media",
      },
    },
  };
};

export default Media;
