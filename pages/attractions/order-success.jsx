import React from "react";
import SuccessPage from "../../src/components/success-page";
import { convertDateFlightPage, convertRupiah } from "../../src/helpers";
import { getOrderDetail } from "../../src/services/attraction.service";

const OrderSuccess = ({ orderDetail }) => {
  const details = [
    [
      {
        t: "Waktu Pemesanan",
        p: `${convertDateFlightPage(orderDetail.transactionDate)}`,
      },
      { t: "Transaction ID", p: `${orderDetail.orderNumber}` },
      { t: "Attraction", p: `${orderDetail.product}` },
    ],
    [
      {
        t: "Total Pembelian",
        p: `IDR ${convertRupiah(orderDetail.totalTransaction)}`,
        b: true,
      },
    ],
  ];
  return <SuccessPage orderDetail={orderDetail} details={details} />;
};

export const getServerSideProps = async (ctx) => {
  const { orderNumber } = ctx.query;

  const orderDetail = await getOrderDetail({ orderNumber: orderNumber });
  return {
    props: {
      orderDetail,
      meta: {
        title: "Detail Pemesanan",
      },
    },
  };
};
export default OrderSuccess;
