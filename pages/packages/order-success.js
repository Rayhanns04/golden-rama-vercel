import { Box, Button, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import SuccessPageCruisePackage from "../../src/components/success-page/CruisePackage";
import date from "../../src/helpers/date";
import { convertRupiah } from "../../src/helpers";
import { getOrderDetailPackage } from "../../src/services/package.service";
import PhoneIcon from "../../public/svg/icons/phone-orange-filled.svg";

const PackageOrderSuccess = (props) => {
  const { orderDetail } = props;
  const order_details = orderDetail.order_details.reduce(
    (prev, item) => (item = prev)
  );
  const details = [
    [
      {
        t: "Waktu Pemesanan",
        p: `${date(
          new Date(orderDetail.transactionDate),
          "d LLLL yyyy, KK.mm aa"
        )}`,
      },
      {
        t: "Booking ID",
        p: `${orderDetail.orderNumber}`,
      },
      {
        t: "Produk",
        p: `${order_details.product.packages.title}`,
      },
      {
        t: "Jumlah",
        p: `${[
          {
            count: order_details.product.packages.adults,
            type: "Dewasa",
          },
          {
            count: order_details.product.packages.children,
            type: "Anak-anak",
          },
        ]
          .filter((item) => {
            return parseInt(item.count) !== 0;
          })
          .map((item) => {
            return `${item.count} ${item.type}`;
          })
          .join(", ")}`,
      },
      {
        t: "Nama Hotel",
        p: `${order_details.product.packages.type.name}`,
      },
      {
        t: "Nama Fasilitas",
        p: `${order_details.product.packages.type.pax}`,
      },
      {
        t: "Harga",
        p: `IDR ${convertRupiah(order_details.product.packages.type.price)}`,
      },
    ],
    [
      {
        t: "Total Pemesanan",
        p: `IDR ${order_details.product.transaction.total.toLocaleString(
          "id-ID",
          { maximumFractionDigits: 0 }
        )}`,
        h: true,
        b: true,
      },
      {
        p: "Harga di atas dapat berubah sewaktu-waktu mengikuti ketersediaan cabin dan kurs mata uang asing pada saat pendaftaran.",
      },
    ],
    [
      {
        p: "Travel Consultant Golden Rama akan segera menghubungi Anda untuk konfirmasi terkait pesanan Anda.",
      },
      {
        p: (
          <CustomOrangeFullWidthButton
            as={Link}
            isExternal
            href="https://wa.me/6281511221133"
            isoutlined
            leftIcon={<PhoneIcon />}
          >
            Hubungi Golden Rama E-Travel Assistant
          </CustomOrangeFullWidthButton>
        ),
      },
    ],
  ];
  return (
    <SuccessPageCruisePackage details={details} orderDetail={orderDetail} />
  );
};

export const getServerSideProps = async (ctx) => {
  const { orderNumber } = ctx.query;

  const orderDetail = await getOrderDetailPackage({ orderNumber: orderNumber });
  return {
    props: {
      orderDetail,
      meta: {
        title: "Detail Pemesanan",
      },
    },
  };
};

export default PackageOrderSuccess;
