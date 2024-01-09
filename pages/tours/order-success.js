import { useRouter } from "next/router";
import React from "react";
import SuccessPage from "../../src/components/success-page";
import { convertDateFlightPage, convertRupiah } from "../../src/helpers";
import { getOrderDetailTour } from "../../src/services/tour.service";

const OrderSuccess = (props) => {
  const { orderDetail } = props;
  const details = [
    [
      {
        t: "Waktu Pemesanan",
        p: `${convertDateFlightPage(orderDetail.transactionDate)}`,
      },
      { t: "Transaction ID", p: `${orderDetail.orderNumber}` },
      { t: "Produk Tour Series", p: `${orderDetail.product}` },
    ],
    [
      {
        t: "Rincian Pembayaran",
        p: "",
        b: true,
      },
      {
        t: "Total Deposit",
        p: `${convertRupiah(orderDetail.downPayment)}`,
        b: true,
      },
      {
        t: "Total Biaya",
        p: `${convertRupiah(orderDetail.totalTransaction)}`,
        b: true,
      },
    ],
    [
      {
        t: "Sisa Biaya",
        p: `${convertRupiah(
          orderDetail.totalTransaction - orderDetail.downPayment
        )}`,
        b: true,
      },
      {
        t: "Sisa biaya maksimal dibayarkan 2 minggu sebelum keberangkatan",
        p: "",
        b: false,
      },
    ],
    [
      {
        t: "Travel Consultan Golden Rama akan segera menghubungi Anda untuk konfirmasi terkait pesanan Anda.",
        p: "",
        b: false,
      },
    ],
  ];
  return <SuccessPage orderDetail={orderDetail} details={details} />;
};

export const getServerSideProps = async (ctx) => {
  try {
    const { orderNumber } = ctx.query;

    const orderDetail = await getOrderDetailTour({ orderNumber: orderNumber });
    return {
      props: { orderDetail },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
export default OrderSuccess;
