import { useRouter } from "next/router";
import React from "react";
import SuccessPage from "../../src/components/success-page";
import { convertDateFlightPage, convertRupiah } from "../../src/helpers";
import { getOrderDetailHotel } from "../../src/services/hotel.service";
import { checkStatus } from "../../src/services/payment.service";
// import { getOrderDetailTour } from "../../src/services/tour.service";

const OrderSuccess = (props) => {
  const { orderDetail, statusBank } = props;
  const details = [
    [
      {
        t: "Waktu Pemesanan",
        p: `${convertDateFlightPage(orderDetail.transactionDate)}`,
      },
      { t: "Transaction ID", p: `${orderDetail.invoiceNumber || "-"}` },
      { t: "Booking ID", p: `${orderDetail.orderNumber}` },
      {
        t: "Booking Ref",
        p: `${orderDetail.order_details[0]?.product_issued?.reference || "-"}`,
      },
      { t: "Metode Pembayaran", p: (orderDetail.useEspay ? `${statusBank.product_name}` : "Travel Card") },
      {
        t: "Produk",
        p: `${orderDetail.order_details[0].product.details.name}, ${orderDetail.order_details[0].product.details.rooms[0].rates[0].rooms} Kamar`,
      },
    ],
    [
      // {
      //   t: "Rincian Pembayaran",
      //   p: "",
      //   b: true,
      // },
      // {
      //   t: "Total Deposit",
      //   p: `${convertRupiah(orderDetail.downPayment)}`,
      //   b: true,
      // },
      {
        t: "Total Pembelian",
        p: `${convertRupiah(orderDetail.totalTransaction)}`,
        b: true,
      },
    ],
    // [
    //   {
    //     t: "Sisa Biaya",
    //     p: `${convertRupiah(
    //       orderDetail.totalTransaction - orderDetail.downPayment
    //     )}`,
    //     b: true,
    //   },
    //   {
    //     t: "Sisa biaya maksimal dibayarkan 2 minggu sebelum keberangkatan",
    //     p: "",
    //     b: false,
    //   },
    // ],
    // [
    //   {
    //     t: "Travel Consultan Golden Rama akan segera menghubungi Anda untuk konfirmasi terkait pesanan Anda.",
    //     p: "",
    //     b: false,
    //   },
    // ],
  ];
  return <SuccessPage orderDetail={orderDetail} details={details} />;
};

export const getServerSideProps = async (ctx) => {
  const { orderNumber } = ctx.query;

  const orderDetail = await getOrderDetailHotel({ orderNumber: orderNumber });
  const statusBank = await checkStatus({ orderNumber: orderNumber });
  orderDetail.useEspay = (statusBank ? true : false);
  return {
    props: {
      orderDetail,
      statusBank,
      meta: {
        title: "Detail Pemesanan",
      },
    },
  };
};
export default OrderSuccess;
