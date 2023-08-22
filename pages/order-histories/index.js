import { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  LinkBox,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Tag,
  Text,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistories } from "../../src/services/order.service";
import Layout from "../../src/components/layout";
import CustomCalendar from "../../src/components/calendar";
import { Unauthorized } from "../../src/components/card";
import { CustomFilterButton } from "../../src/components/button";
import { CustomCheckboxFill } from "../../src/components/checkbox";
import TourIcon from "../../public/svg/nav/tours.svg";
import AttractionIcon from "../../public/svg/nav/attractions.svg";
import FlightIcon from "../../public/svg/nav/flights.svg";
import CruiseIcon from "../../public/svg/nav/cruises.svg";
import PacketIcon from "../../public/svg/nav/packages.svg";
import InsuranceIcon from "../../public/svg/nav/insurances.svg";
import DateIcon from "../../public/svg/icons/date.svg";
import { format } from "date-fns";
import { toTitleCase } from "../../src/helpers";
import { mapDataOrders } from "../../src/helpers/mapDataOrder";

const OrderHistory = () => {
  const initialFilter = {
    dates: ["", ""],
    types: [],
    payments: [],
  };
  const [tab, setTab] = useState("unpaid");
  const [sortBy, setSortBy] = useState({
    label: "Update Terbaru",
    value: "desc",
  });
  const [filter, setFilter] = useState(initialFilter);
  const tabs = [
    {
      name: "unpaid",
      label: "Belum Dibayar",
    },
    {
      name: "active",
      label: "Aktif",
    },
    {
      name: "done",
      label: "Selesai",
    },
    {
      name: "canceled",
      label: "Pesanan Dibatalkan",
    },
  ];
  const { isLoggedIn } = useSelector((s) => s.authReducer);
  const { data: orderHistories, isLoading } = useQuery(
    ["orderHistories", filter, sortBy, tab],
    () => getOrderHistories({ filter, sort: sortBy.value, tab }),
    {
      enabled: isLoggedIn,
    }
  );

  const mappedOrderHistories = mapDataOrders(orderHistories)?.filter(
    (order) => {
      return tab === "active"
        ? new Date(order?.activeUntil).getTime() > Date.now()
        : tab === "done"
        ? new Date(order?.activeUntil).getTime() < Date.now()
        : true;
    }
  );
  return (
    <Layout pagetitle="Riwayat Pesanan">
      {isLoggedIn ? (
        <>
          <Text
            color="neutral.text.high"
            fontFamily="heading"
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="14px"
            mt="24px"
            mb="28px"
          >
            list pesanan anda
          </Text>
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
            {tabs.map((item) => {
              const isActive = item.name === tab;
              return (
                <Button
                  key={tab.name}
                  borderRadius="full"
                  bg={isActive ? "brand.blue.400" : "#F6F6F6"}
                  color={isActive ? "brand.blue.100" : "neutral.text.low"}
                  colorScheme="brand.blue"
                  fontSize="sm"
                  fontWeight="normal"
                  minW="fit-content"
                  onClick={() => setTab(item.name)}
                >
                  {item.label}
                </Button>
              );
            })}
          </HStack>
          <Box
            position="absolute"
            left={0}
            bg="brand.blue.100"
            h="8px"
            w="full"
          />
          <HStack
            maxW={{ lg: "container.lg", xl: "container.xl" }}
            mx={"auto"}
            py={"20px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            // h={"60px"}
          >
            <Skeleton isLoaded={!isLoading}>
              <Text
                color={"neutral.text.medium"}
                fontSize={{ base: "xs", md: "sm" }}
              >
                {mappedOrderHistories?.length || 0} Pesanan Tersedia
              </Text>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <HStack>
                <FilterButton
                  filterState={[filter, setFilter]}
                  initialFilter={initialFilter}
                />
                <SortButton sortByState={[sortBy, setSortBy]} />
              </HStack>
            </Skeleton>
          </HStack>
          <Box bg="brand.blue.100" mx="-24px" minH="44vh">
            <SimpleGrid
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              columns={[1, 1, 2, 3]}
              mx="auto"
              p="24px"
              spacing="24px"
            >
              {(isLoading
                ? Array.from({ length: 5 })
                : mappedOrderHistories
              )?.map((orderHistory, index) => (
                <Card
                  key={index}
                  orderHistory={orderHistory}
                  activeTab={tab}
                  isLoading={isLoading}
                />
              ))}
            </SimpleGrid>
          </Box>
        </>
      ) : (
        <Unauthorized withAuthButton />
      )}
    </Layout>
  );
};

const Card = ({ orderHistory, activeTab, isLoading }) => {
  const tabConfs = {
    unpaid: {
      color: "gradient.linear.orange",
      title: "Bayar",
    },
    active: {
      color: "gradient.linear.green",
      title: "Aktif",
    },
    done: {
      color: "gradient.linear.blue",
      title: "Selesai",
    },
    canceled: {
      color: "gradient.linear.red",
      title: "Dibatalkan",
    },
  };

  const icons = {
    attraction: <AttractionIcon />,
    cruise: <CruiseIcon />,
    flight: <FlightIcon />,
    hotel: <AttractionIcon />,
    package: <PacketIcon />,
    tour: <TourIcon />,
    insurance: <InsuranceIcon />,
  };
  return (
    <NextLink
      key={orderHistory?.id}
      href={`/order-histories/${orderHistory?.orderNumber}`}
    >
      <LinkBox as="a" rel="canonical" cursor="pointer" bg="white" borderRadius="12px">
        <HStack
          justifyContent="space-between"
          pl="16px"
          pr="10px"
          pt="13px"
          pb="10px"
          borderBottom="1px solid #E9E9E9"
        >
          <HStack spacing="16px">
            <SkeletonCircle isLoaded={!isLoading}>
              {icons[orderHistory?.type]}
            </SkeletonCircle>
            <Box>
              <Skeleton isLoaded={!isLoading}>
                <Text color="neutral.900" fontSize="sm">
                  {toTitleCase(orderHistory?.type || "Type")}
                </Text>
                <Text fontSize="xs">
                  Pesanan{" "}
                  {orderHistory?.transactionDate
                    ? format(
                        new Date(orderHistory.transactionDate),
                        "dd MMM yyyy"
                      )
                    : ""}
                </Text>
              </Skeleton>
            </Box>
          </HStack>
          <Skeleton isLoaded={!isLoading} rounded="full">
            <Box
              bg={tabConfs[activeTab]?.color}
              color="white"
              borderRadius="full"
              px="15.5px"
              py="3px"
            >
              <Text fontSize="xs">{tabConfs[activeTab]?.title}</Text>
            </Box>
          </Skeleton>
        </HStack>
        <Box px="16px" py="14px">
          <Skeleton isLoaded={!isLoading}>
            <Text color="neutral.text.high" fontSize="sm" fontWeight="bold">
              {orderHistory?.card?.title}
            </Text>
          </Skeleton>
          <Text fontSize="xs">{orderHistory?.card?.subtitle}</Text>
          <Box
            my="12px"
            h="1px"
            w="full"
            borderTopWidth="1px"
            borderStyle="dashed"
          />
          <SkeletonText isLoaded={!isLoading} noOfLines={4}>
            <Text color="neutral.text.high" fontSize="sm" fontWeight="bold">
              {orderHistory?.card?.name}
            </Text>
            <Stack spacing="16px">
              {orderHistory?.card?.details.map((detail, index) => (
                <HStack key={index}>
                  <DateIcon />
                  <Text fontSize="xs">{detail.text}</Text>
                  {detail.tag && (
                    <Tag
                      bg="brand.orange.100"
                      color="brand.orange.400"
                      size="sm"
                      fontSize="xs"
                    >
                      {detail.tag}
                    </Tag>
                  )}
                </HStack>
              ))}
            </Stack>
          </SkeletonText>
        </Box>
      </LinkBox>
    </NextLink>
  );
};

const SortButton = ({ sortByState }) => {
  const [sortBy, setSortBy] = sortByState;
  const [tempSortBy, setTempSortBy] = useState(sortBy);
  const drawerRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const options = [
    {
      label: "Update Terbaru",
      value: "desc",
    },
    {
      label: "Update Terlama",
      value: "asc",
    },
  ];
  return (
    <>
      <Button
        variant={"link"}
        colorScheme={"brand.blue"}
        fontWeight={"normal"}
        size={{ base: "xs", md: "sm" }}
        onClick={onOpen}
        leftIcon={
          <Image
            src={"/svg/icons/sort.svg"}
            alt={"Filter Icon"}
            width={20}
            height={20}
          />
        }
      >
        Urutkan
      </Button>
      <CustomFilterButton
        drawer={drawerRef}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onSubmit={() => {
          setSortBy(tempSortBy);
          onClose();
        }}
        title={"Urutkan"}
        footer={"Terapkan"}
      >
        <RadioGroup
          onChange={(value) =>
            setTempSortBy(options.find((opt) => opt.value === value))
          }
          defaultValue={sortBy.value}
        >
          <Stack spacing={5} py={5}>
            {options.map((option, index) => (
              <Radio
                flexDirection={"row-reverse"}
                colorScheme={"brand.blue"}
                justifyContent={"space-between"}
                key={index}
                value={option.value}
              >
                {option.label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </CustomFilterButton>
    </>
  );
};

const FilterButton = ({ filterState, initialFilter }) => {
  const [filter, setFilter] = filterState;
  const [tempFilter, setTempFilter] = useState(filter);
  const drawerRef = useRef();
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const [calendarType, setCalendarType] = useState("");
  const onClose = () => {
    setTempFilter(filter);
    _onClose();
  };
  const types = [
    {
      label: "Tour",
      value: "tour",
    },
    {
      label: "Hotel",
      value: "hotel",
    },
    {
      label: "Tiket Pesawat",
      value: "flight",
    },
    {
      label: "Atraksi & Hiburan",
      value: "attraction",
    },
    {
      label: "Cruise",
      value: "cruise",
    },
    {
      label: "Visa",
      value: "visa",
    },
  ];

  return (
    <>
      <Button
        variant={"link"}
        colorScheme={"brand.blue"}
        fontWeight={"normal"}
        size={{ base: "xs", md: "sm" }}
        onClick={onOpen}
        leftIcon={
          <Image
            src={"/svg/icons/filter.svg"}
            alt={"Sort Icon"}
            width={20}
            height={20}
          />
        }
      >
        Filter
      </Button>
      <CustomFilterButton
        drawer={drawerRef}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onSubmit={() => {
          setFilter(tempFilter);
          onClose();
        }}
        onReset={() => {
          setFilter(initialFilter);
          onClose();
        }}
        title={"Filter"}
        footer={"Terapkan"}
        notrounded
      >
        <Stack spacing={"24px"} py={"24px"}>
          <Heading fontSize={"md"}>Tanggal Pesanan</Heading>
          <HStack spacing="12px" w="fit-content">
            <FormControl>
              <FormLabel fontSize="sm">Dari</FormLabel>
              <Button
                onClick={() => setCalendarType("start")}
                px="16px"
                py="13px"
                borderRadius="4px"
                colorScheme="gray"
              >
                <HStack spacing="10px">
                  <DateIcon />
                  <Text
                    color="neutral.text.low"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    {tempFilter.dates[0]
                      ? format(tempFilter.dates[0], "dd/MM/yyyy")
                      : "Pilih Tanggal"}
                  </Text>
                </HStack>
              </Button>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Sampai</FormLabel>
              <Button
                onClick={() => setCalendarType("end")}
                px="16px"
                py="13px"
                borderRadius="4px"
                colorScheme="gray"
              >
                <HStack spacing="10px">
                  <DateIcon />
                  <Text
                    color="neutral.text.low"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    {tempFilter.dates[1]
                      ? format(tempFilter.dates[1], "dd/MM/yyyy")
                      : "Pilih Tanggal"}
                  </Text>
                </HStack>
              </Button>
            </FormControl>
          </HStack>
          <Box bg="brand.blue.100" h="8px" mx="-24px!" />
          <Heading fontSize={"md"}>Tipe Produk</Heading>
          <Wrap spacingY={"16px"} spacingX={"6px"}>
            {types.map((type, index) => (
              <CustomCheckboxFill
                key={index}
                field={{
                  checked: tempFilter.types.includes(type.value),
                  onChange: () =>
                    setTempFilter({
                      ...tempFilter,
                      types: tempFilter.types.includes(type.value)
                        ? tempFilter.types.filter((i) => i !== type.value)
                        : [...tempFilter.types, type.value],
                    }),
                }}
                label={type.label}
                value={type.value}
              />
            ))}
          </Wrap>
        </Stack>
        <ModalCalendar
          type={calendarType}
          onClose={() => setCalendarType("")}
          filterState={[tempFilter, setTempFilter]}
        />
      </CustomFilterButton>
    </>
  );
};

const ModalCalendar = ({ type, onClose, filterState }) => {
  const [filter, setFilter] = filterState;
  const [selectedDates, setSelectedDates] = useState({
    start: filter.dates[0],
    end: filter.dates[1],
  });
  return (
    <CustomFilterButton
      isOpen={!!type}
      onClose={onClose}
      onSubmit={() => {
        setFilter({
          ...filter,
          dates: [selectedDates.start, selectedDates.end],
        });
        onClose();
      }}
      title="Pilih Tanggal"
      footer="Pilih"
    >
      <Stack spacing={5} py={5}>
        <CustomCalendar
          value={
            !selectedDates.end
              ? selectedDates.start
              : Object.entries(selectedDates).map(([_key, value]) => value)
          }
          onChange={(date) => {
            type === "start"
              ? setSelectedDates({ ...selectedDates, start: date })
              : setSelectedDates({ ...selectedDates, end: date });
          }}
          allowPartialRange
        />
      </Stack>
    </CustomFilterButton>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Riwayat Pesanan",
      },
    },
  };
};

export default OrderHistory;
