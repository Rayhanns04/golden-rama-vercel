import { Box, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CustomDivider } from "../../../src/components/divider";
import { FormFlightSearch } from "../../../src/components/form";
import Layout from "../../../src/components/layout";
import {
  convertDateFlight,
  filterIsDomestic,
  simplifyQuerySearch,
} from "../../../src/helpers";
import _ from "underscore";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  checkoutData,
  resetDataPrebooking,
} from "../../../src/state/prebooking/prebooking.slice";
import {
  getAllPrebooking,
  getExhibitions,
} from "../../../src/services/prebooking.service";
import { getPrebooking } from "../../../src/services/prebooking.service";
import { orderData } from "../../../src/state/order/order.slice";
import { getFlights } from "../../../src/services/flight.service";

const Prebooking = (props) => {
  const router = useRouter();
  const { fields, classes, prebooking } = props;
  const [isMultiTrip, setIsMultiTrip] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetDataPrebooking({}));
  }, []);
  const initialForm = {
    departure: {
      name: "",
      city: "",
      code: "",
    },
    destination: {
      name: "",
      city: "",
      code: "",
    },
    departure_date: new Date(),
    return_date: "",
    class: "E",
    is_round_trip: false,
    adult: 1,
    child: 0,
    infant: 0,
  };
  const handleSubmit = async (values) => {
    try {
      dispatch(
        checkoutData({
          prebookingDetail: { ...values, prebook: { id: prebooking.id } },
        })
      );
      let query = {
        departureDate: convertDateFlight(values.flights[0].departure_date),
        returnDate:
          values.flights[0].is_round_trip == true
            ? convertDateFlight(values.flights[0].return_date)
            : "",
        originCode: values.flights[0].departure.code,
        destinationCode: values.flights[0].destination.code,
        adult: values.flights[0].adult,
        child: values.flights[0].child,
        infant: values.flights[0].infant,
        class: values.flights[0].class,
        airlines: "",
        is_round_trip: values.flights[0].is_round_trip,
      };
      const parseQuery = simplifyQuerySearch(query);
      let additionalData,
        totalFlight,
        noresults = false;
      try {
        additionalData = await getFlights(parseQuery);
        if (additionalData.data[0].journeys.length === 0) {
          noresults = true;
          additionalData = false;
          totalFlight = 0;
        }
      } catch (error) {
        console.error(error);

        noresults = true;
        additionalData = false;
        totalFlight = 0;
      }
      dispatch(
        orderData({
          // data: cart,
          query: router.query,
          isDomestic: filterIsDomestic(additionalData.data),
        })
      );
      return router.push({
        pathname: "/prebooking/" + router.query.slug + "/order-details",
      });
    } catch (error) {
      return console.error(error);
    }
  };
  const exhibitionsDropdown = prebooking.exhibitions.map((item) => {
    return { label: item.city, value: item.city };
  });
  return (
    <Layout type={"alt"} pagetitle={prebooking.name} hideBottomBar>
      <Box maxW={{ lg: "container.lg", xl: "container.xl" }} mx={"auto"}>
        <Flex as={"section"} py={"24px"} justify={"space-between"}>
          <HStack onClick={() => setIsMultiTrip(false)}>
            <Box hidden={isMultiTrip}>
              <Image
                src="/svg/flights/checked.svg"
                alt="Flights"
                width={15}
                height={15}
              />
            </Box>
            <Text
              color={isMultiTrip ? "neutral.text.low" : "brand.blue.400"}
              fontWeight={isMultiTrip ? "regular" : "semibold"}
            >
              Sekali Jalan / Pergi-Pulang
            </Text>
          </HStack>
        </Flex>
      </Box>
      <CustomDivider />
      {/* Form Flight Search */}
      <FormFlightSearch
        isPrebooking
        handleSubmit={handleSubmit}
        fields={fields}
        classes={classes}
        initialForm={initialForm}
        exhibitions={exhibitionsDropdown}
      />
    </Layout>
  );
};

// Get Static Paths Nextjs
// export const getStaticPaths = async () => {
//   const prebookings = await getAllPrebooking();
//   const paths = prebookings.data.map((item) => {
//     return {
//       params: {
//         slug: item.attributes.slug,
//       },
//     };
//   });
//   return { paths, fallback: "blocking" };
// };

// export const getStaticProps = async (ctx) => {
//   try {
//     const { slug } = ctx.params;
//     const classes = [
//       { label: "Economy", value: "E" },
//       { label: "Premium Economy", value: "PE" },
//       { label: "Business Class", value: "B" },
//       { label: "First Class", value: "F" },
//     ];

//     const prebooking = await getPrebooking(slug);
//     const fields = [
//       {
//         name: "departure",
//         label: "Asal",
//       },
//       {
//         name: "destination",
//         label: "Tujuan",
//       },
//       {
//         name: "departure_date",
//         label: "Tanggal Pergi",
//       },
//       {
//         name: "return_date",
//         label: "Tanggal Pulang",
//       },
//       {
//         name: "class",
//         label: "Kelas Penerbangan",
//       },
//       [
//         {
//           name: "adult",
//           label: "Dewasa",
//           description: "Lebih dari 12 tahun",
//         },
//         {
//           name: "child",
//           label: "Anak",
//           description: "2 - 11 tahun",
//         },
//         {
//           name: "infant",
//           label: "Bayi",
//           description: "6 bulan - 1 tahun",
//         },
//       ],
//     ];

//     return {
//       props: {
//         classes,
//         fields,
//         prebooking,
//         meta: {
//           title: prebooking.name,
//         },
//       },
//       revalidate: 10,
//     };
//   } catch (error) {
//     console.error(error);
//     // return { notFound: true };
//   }
// };

export const getServerSideProps = async (ctx) => {
  try {
    const { slug } = ctx.params;
    const classes = [
      { label: "Economy", value: "E" },
      { label: "Premium Economy", value: "PE" },
      { label: "Business Class", value: "B" },
      { label: "First Class", value: "F" },
    ];

    const prebooking = await getPrebooking(slug);
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
          description: "Lebih dari 12 tahun",
        },
        {
          name: "child",
          label: "Anak",
          description: "2 - 11 tahun",
        },
        {
          name: "infant",
          label: "Bayi",
          description: "6 bulan - 1 tahun",
        },
      ],
    ];

    return {
      props: {
        classes,
        fields,
        prebooking,
        meta: {
          title: prebooking.name,
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};


export default Prebooking;
