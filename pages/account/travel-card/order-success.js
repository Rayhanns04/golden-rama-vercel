import { Box, Button, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../../src/components/button";
import SuccessPage from "../../../src/components/success-page";
import date from "../../../src/helpers/date";
import PhoneIcon from "../../../public/svg/icons/phone-orange-filled.svg";
import { getOrderDetail } from "../../../src/services/travelcard.service";

const InsuranceOrderSuccess = (props) => {
  const { orderDetail } = props;
  const order_details = orderDetail.order_details.reduce(
    (prev, item) => (item = prev)
  );
  return (
    <SuccessPage
      details={[
        [
          {
            t: "Waktu Pemesanan",
            p: `${date(
              new Date(orderDetail.transactionDate),
              "d LLLL yyyy, KK.mm aa"
            )}`,
          },
          {
            t: "Transaction ID",
            p: `${orderDetail.orderNumber}`,
          },
          {
            t: "Produk",
            p: `Travel Privilege Card`,
          },
        ],
        [
          {
            t: "Total Pembelian",
            p: `IDR ${order_details.product.transaction.total.toLocaleString(
              "id-ID",
              { maximumFractionDigits: 0 }
            )}`,
            h: false,
            b: false,
          },
        ],
      ]}
      orderDetail={orderDetail}
    />
  );
};

export const getServerSideProps = async (ctx) => {
  const { orderNumber } = ctx.query;

  const orderDetail = await getOrderDetail({
    orderNumber: orderNumber,
  });
  return {
    props: {
      orderDetail,
      meta: {
        title: "Detail Pemesanan",
      },
    },
  };
};

export default InsuranceOrderSuccess;
