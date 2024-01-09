import * as Yup from "yup";

import {
  Box,
  Center,
  Spinner,
  Stack,
  Tab,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { HotelListItem, PackageListItem, TourListItem } from "../card";
import { Swiper, SwiperSlide } from "swiper/react";
import { addDays, differenceInDays } from "date-fns";
import { getHotelDetail, getHotels } from "../../services/hotel.service";
import {
  getPackages,
  getTotalDataPackageV2,
} from "../../services/package.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { CustomOrangeFullWidthButton } from "../button";
import { CustomRadioFill } from "../checkbox";
import { FormTourFilter } from "../form";
import Image from "next/image";
import { SearchFilters } from "../search";
import { convertToArray } from "../../helpers";
import date from "../../helpers/date";
import { getToursV2 } from "../../services/tour.service";
import { useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";

export const CustomToursTabs = ({
  airlines,
  item,
  sort,
  tour_type,
  tour_duration,
  tour_tags,
  tours,
  handleSubmit,
  ...props
}) => {
  const router = useRouter();
  const { query } = router;
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = tours;
  // scroll to view
  const { ref: buttonRef, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const pageParams = tours.data?.pageParams || [];
    const hasNextPage =
      pageParams?.length >= 0
        ? typeof pageParams[pageParams.length - 1] === "undefined"
          ? true
          : pageParams[pageParams.length - 1]
        : true;
    if (inView && hasNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNextPage, inView, buttonRef]);
  const initialValues = {
    tour_type: convertToArray(query?.tour_type) ?? [],
    sort: query?.sort ?? "",
    tour_tags: query?.tour_tags ?? "All",
    // tour_tags: convertToArray(query?.tour_tags) ?? [],
    destination: query?.destination ?? "",
    tour_duration: query?.tour_duration ?? "",
    airlines: convertToArray(query?.airlines) ?? [],
    min_price: query?.min_price ?? 0,
    max_price: query?.max_price ?? 100000000,
    // period_month: selected.period_month ?? String,
    // period_year: selected.period_year ?? String,
  };

  return (
    <Stack spacing="24px">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={() =>
          Yup.object().shape({
            // period_year: Yup.string().required("Tahun wajib diisi"),
            // period_month: Yup.string().required("Bulan wajib diisi"),
          })
        }
      >
        <Stack>
          <SearchFilters
            isLoading={tours.isLoading}
            title={"Tour"}
            filter={
              <FormTourFilter
                tour_type={tour_type}
                airlines={airlines || []}
                tour_duration={tour_duration}
              />
            }
            result={tours}
            data={tours.data}
            totalData={tours.data?.pages.reduce((acc, cur) => {
              return acc + cur.length;
            }, 0)}
            sort={sort}
          />
          <Box
            as={Swiper}
            spaceBetween={12}
            slidesPerView={"auto"}
            w="full"
            h="full"
            px={{ md: "24px" }}
          >
            {!tour_tags.isLoading &&
              tour_tags.data?.map((item, index) => (
                <SwiperSlide style={{ width: "fit-content" }} key={index}>
                  <Field name="tour_tags" type="radio" value={item.name}>
                    {({ field, form }) => (
                      <CustomRadioFill
                        onClick={() => {
                          form.setFieldValue("tour_tags", item.name);
                          form.submitForm();
                        }}
                        field={field}
                        value={item.name}
                        form={form}
                        label={item.name}
                        additionalconf={{
                          unchecked: {
                            bgColor: "#F6F6F6",
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                          },
                        }}
                      />
                    )}
                  </Field>
                  {/* <Box
                          display={"flex"}
                          width={"max-content"}
                          px={"16px"}
                          py={"8px"}
                          rounded="full"
                          fontSize={"sm"}
                          fontWeight="normal"
                          bgColor={"neutral.color.bg.secondary"}
                          color={"neutral.text.medium"}
                          _selected={{
                            bgColor: "brand.blue.400",
                            color: "brand.blue.100",
                          }}
                        >
                          {item.name}
                        </Box> */}
                </SwiperSlide>
              ))}
          </Box>
        </Stack>
      </Formik>
      <Stack className="tour-list" px={{ md: "24px" }}>
        {/* {item.description && item.image ? (
          <Stack spacing={"12px"} py={"24px"}>
            <Center>
              <Image
                src={`/png/tour-tags/${item.image}`}
                width={120}
                height={70}
              />
            </Center>
            <Text fontSize={"sm"} textAlign="center">
              {item.description}
            </Text>
          </Stack>
        ) : (
          <></>
        )} */}
        <Stack m="auto" spacing={"16px"}>
          <TourListItem query={tours} />
        </Stack>
        <Box>
          <Box ref={buttonRef} maxW={"400px"} mx={"auto"}>
            <CustomOrangeFullWidthButton
              hidden={!hasNextPage}
              onClick={fetchNextPage}
              type="submit"
              isLoading={isFetchingNextPage}
            >
              Lihat Lebih Banyak
            </CustomOrangeFullWidthButton>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export const CustomPackagesTabs = (props) => {
  const { ref: trigger, inView } = useInView();
  useEffect(() => {
    if (inView) {
      showMoreItems();
    }
  }, [inView]);
  const { item } = props;

  const packages = useInfiniteQuery(
    ["getPackages", item.isDomestic],
    async ({ pageParam = 1 }) => {
      try {
        const response = await getPackages(item, pageParam);
        return Promise.resolve(response);
      } catch (error) {
        console.error(error);
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

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = packages;

  const showMoreItems = () => {
    fetchNextPage();
  };

  return (
    <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
      <Stack spacing={"16px"}>
        <PackageListItem query={packages} />
      </Stack>
      <Center mt={4}>{hasNextPage && <Spinner ref={trigger}></Spinner>}</Center>
      {/* <Box maxW={"400px"} mx={"auto"}>
        <CustomOrangeFullWidthButton
          hidden={!hasNextPage}
          onClick={fetchNextPage}
          type="submit"
          isLoading={isFetchingNextPage}
        >
          Lihat Lebih Banyak
        </CustomOrangeFullWidthButton>
      </Box> */}
    </Box>
  );
};

export const CustomHotelsTabs = (props) => {
  const { item } = props;
  const { ref: trigger, inView } = useInView();
  useEffect(() => {
    if (inView) {
      showMoreItems();
    }
  }, [inView]);
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
  });

  const checkin = date(addDays(new Date(), 1), "yyyy-MM-dd");
  const checkout = date(addDays(new Date(), 2), "yyyy-MM-dd");

  const differenceDate = differenceInDays(
    new Date(checkout),
    new Date(checkin)
  );

  const getHotel = async ({ pageParam = 1 }) => {
    let filter = {
      stay: {
        checkIn: checkin,
        checkOut: checkout,
      },
      occupancies: [
        {
          rooms: 1,
          adults: 1,
          children: 0,
        },
      ],
      language: "IND",
      limit: 6,
      loop: 2,
      page: pageParam || 1,
      customfilters: {
        sort: "RANK_DESC",
        stars: [],
      },
    };
    if (coords?.latitude && coords?.longitude && item?.code === "NEARBY") {
      filter.geolocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: 20,
        unit: "km",
      };
    } else {
      filter.regions = {
        code: item?.code || "BAI",
        type: "region",
        zoneCode: null,
      };
    }
    let response = await getHotels(filter);
    return response.data;
  };

  const hotels = useInfiniteQuery(["getHotels", item.code, coords], getHotel, {
    getNextPageParam: (lastpage) => {
      if (lastpage.hasMore) {
        return lastpage.page + 1;
      } else {
        return false;
      }
    },
    keepPreviousData: true,
  });

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = hotels;

  const showMoreItems = () => {
    fetchNextPage();
  };

  return (
    <Box mx={"auto"} maxW={{ lg: "container.lg", xl: "container.xl" }}>
      <Stack spacing={"16px"}>
        <HotelListItem query={hotels} differenceDate={differenceDate} />
      </Stack>
      <Center mt={4}>
        {hasNextPage && <Spinner ref={trigger}></Spinner>}

        {/* <CustomOrangeFullWidthButton
          hidden={!hasNextPage}
          onClick={fetchNextPage}
          type="submit"
          isLoading={isFetchingNextPage}
        >
          Lihat Lebih Banyak
        </CustomOrangeFullWidthButton> */}
      </Center>
    </Box>
  );
};
