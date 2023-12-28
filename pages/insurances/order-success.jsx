import { Box, Button, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import SuccessPage from "../../src/components/success-page";
import date from "../../src/helpers/date";
import { getOrderDetail } from "../../src/services/insurance.service";
import PhoneIcon from "../../public/svg/icons/phone-orange-filled.svg";

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
            p: `Insurances`,
          },
        ],
        [
          {
            t: "Total Pembelian",
            p: `IDR ${order_details.product.transaction.total.toLocaleString(
              "id-ID",
              { maximumFractionDigits: 0 }
            )}`,
            h: true,
            b: true,
          },
          {
            // p: "Harga di atas dapat berubah sewaktu-waktu mengikuti ketersediaan cabin dan kurs mata uang asing pada saat pendaftaran.",
          },
        ],
      ]}
      orderDetail={orderDetail}
    />
  );
};

export const getServerSideProps = async (ctx) => {
  try {
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
  } catch (error) {
    return { notFound: true };
  }
};

export default InsuranceOrderSuccess;
