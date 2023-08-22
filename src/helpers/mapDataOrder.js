import { format } from "date-fns";
import {
  convertRupiah,
  convertTypeToNameRoom,
  getClassCode,
  getPaxFaresName,
  getPaxTextCount,
  getPaxTypeName,
  getRangeDays,
  simplifyPaxFares,
} from ".";

export const mapDataOrderDetail = (data) => {
  const {
    id,
    attributes: {
      customer: _customer,
      type,
      status,
      payment_method,
      transactionDate,
      transactionExpiration,
      orderNumber,
    },
  } = data;
  const customer = { id: _customer?.data?.id, ..._customer?.data?.attributes };
  const { product, product_issued } =
    data.attributes.order_details.data[0].attributes;
  switch (type) {
    case "tour": {
      const { tours, traveler } = product;
      const departureDate = new Date(tours.departure.date);
      const card = {
        title: `Tour Series - ${tours.groups[0].name}`,
        subtitle: `Tour ID: ${tours.departure.code}`,
        name: tours.name,
        details: [
          {
            type: "date",
            text: `${format(departureDate, "dd MMMM yyyy")} - ${format(
              departureDate.setDate(
                departureDate.getDate() + tours.departure.duration
              ),
              "dd MMMM yyyy"
            )}`,
            tag: `${tours.departure.duration} Hari`,
          },
          {
            type: "people",
            text: `${getPaxTextCount(product.traveler)}`,
          },
          {
            type: "airline",
            text: tours.airlines.map((airline) => airline.name).join(", "),
          },
        ],
      };
      const list = [
        {
          details: [
            {
              label: "Transaction ID",
              value: data.attributes.invoiceNumber || "-",
            },
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            {
              label: "Metode Pembayaran",
              value: payment_method.data?.attributes.name,
            },
          ],
        },
        {
          title: "Rincian Biaya",
          tag: "Harga dalam Rupiah",
          details: [
            false && [
              ...convertTypeToNameRoom(tours.rooms)?.map((room) => ({
                label: `${room.name} (${room.quantity})`,
                value: convertRupiah(room.price),
              })),
              (() => {
                const data = tours.rooms.reduce(
                  (acc, room) => {
                    return {
                      ...acc,
                      value: acc.value + room.price * room.quantity,
                    };
                  },
                  {
                    label: "Total",
                    value: 0,
                    bold: ["label", "value"],
                    add_space: true,
                  }
                );
                return { ...data, value: convertRupiah(data.value) };
              })(),
            ],
            [
              data.attributes.discountPromo && {
                label: "Diskon (Kode Promo)",
                value: `-${convertRupiah(data.attributes.discountPromo)}`,
                green: ["value"],
              },
              {
                label: "Total Biaya",
                value: convertRupiah(product.transaction.total),
                bold: ["label", "value"],
                add_space: true,
              },
            ],
          ],
        },
        {
          title: "Rincian Deposit",
          details: [
            [
              {
                label: "Deposit (per-orang)",
                value: convertRupiah(tours.price.downPaymentPrice),
              },
              {
                label: `Total Deposit (${product.traveler.length})`,
                value: convertRupiah(product.transaction.downPayment),
                bold: ["label", "value"],
              },
            ],
            [
              {
                label: "Sisa Biaya",
                value: convertRupiah(
                  product.transaction.total - product.transaction.downPayment
                ),
                opacity: "50%",
                bold: ["label", "value"],
              },
              {
                label:
                  "Sisa biaya maksimal dibayarkan 2 minggu sebelum keberangkatan ",
                opacity: "50%",
              },
            ],
          ],
        },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: customer?.full_name,
              },
              { label: "Email", value: customer?.email },
              { label: "Nomor Telepon", value: customer?.phone },
            ],
            [{ resend_email: true, email: customer?.email }],
          ],
        },
        {
          title: "Detail Traveler",
          details: product.traveler.map((item, index) => [
            {
              title: `Traveler ${getPaxTypeName(item.paxType)} ${index + 1} • ${
                item.first_name
              }`,
            },
            {
              label: "Nama Lengkap",
              value: `${item.first_name} ${item.last_name}`,
            },
            {
              label: "Tanggal Lahir",
              value: format(new Date(item.dob), "dd MMMM yyyy"),
            },
            { label: "Nomor Paspor", value: item.docs.cardNum },
            {
              label: "Tanggal Berlaku",
              value: format(
                new Date(
                  `${item.docs.cardExpired.year}-${
                    item.docs.cardExpired.month + 1
                  }-${item.docs.cardExpired.day}`
                ),
                "dd MMMM yyyy"
              ),
            },
          ]),
        },
      ];
      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        traveler,
        orderNumber,
        activeUntil: departureDate.setDate(
          departureDate.getDate() + tours.departure.duration
        ),
      };
    }
    case "flight": {
      const { request, response, prices } = product;
      const journeysReq = request.journeys;
      const journeysRes = response.map((item) => item.journeys[0]);

      const card =
        journeysReq.length > 1
          ? journeysReq.map((journey, index) => {
              const segment = journey.segments[0];
              return {
                accordion_title:
                  journeysReq.length > 2
                    ? `Penerbangan ${index + 1}`
                    : index === 0
                    ? "Penerbangan Pergi"
                    : "Penerbangan Pulang",
                title: `${segment.origin.city} (${segment.origin.code}) - ${segment.destination.city} (${segment.destination.code})`,
                details: [
                  {
                    type: "airline",
                    text: `${
                      segment.flightDesignator.carrierName || "Airline"
                    } - ${segment.flightDesignator.carrierCode}${
                      segment.flightDesignator.flightNumber
                    }`,
                  },
                  {
                    type: "date",
                    text: (() => {
                      const arrive = format(
                        new Date(journeysRes[index].arrivalDateTime),
                        "dd MMMM yyyy, HH:mm"
                      );
                      const depart = format(
                        new Date(journeysRes[index].departureDateTime),
                        "dd MMMM yyyy, HH:mm"
                      );
                      if (arrive.split(",")[0] === depart.split(",")[0]) {
                        return `${depart} - ${arrive.split(",")[1]}`;
                      }
                      return `${depart} - ${arrive}`;
                    })(),
                  },
                  {
                    type: "people",
                    text: `${getPaxTextCount(
                      request.custInfo.paxNames
                    )}, ${getClassCode(segment.fareGroupCode)}`,
                  },
                ],
              };
            })
          : (() => {
              const segment = journeysReq[0].segments[0];
              return {
                title: `${segment.origin.city} (${segment.origin.code}) - ${segment.destination.city} (${segment.destination.code})`,
                details: [
                  {
                    type: "airline",
                    text: `${segment.flightDesignator.carrierName} - ${segment.flightDesignator.carrierCode}${segment.flightDesignator.flightNumber}`,
                  },
                  {
                    type: "date",
                    text: (() => {
                      const arrive = format(
                        new Date(journeysRes[0].arrivalDateTime),
                        "dd MMMM yyyy, HH:mm"
                      );
                      const depart = format(
                        new Date(journeysRes[0].departureDateTime),
                        "dd MMMM yyyy, HH:mm"
                      );
                      if (arrive.split(",")[0] === depart.split(",")[0]) {
                        return `${depart} - ${arrive.split(",")[1]}`;
                      }
                      return `${depart} - ${arrive}`;
                    })(),
                  },
                  {
                    type: "people",
                    text: `${getPaxTextCount(
                      request.custInfo.paxNames
                    )}, ${getClassCode(segment.fareGroupCode)}`,
                  },
                ],
              };
            })();
      const list = [
        {
          details: [
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            {
              label: "Airline Booking Code (PNR)",
              value: response.map((item) => item.pnrCode).join(", "),
            },
            {
              label: "Transaction ID",
              value: data.attributes.invoiceNumber || "-",
            },
            {
              label: "Produk",
              value: `${journeysReq.length} Penerbangan`,
            },
          ],
        },
        {
          title: "Rincian Harga",
          details: [
            ...journeysRes.map((journey, index) => {
              const { paxFares } = journey.fares[0];
              const simplePaxFares = simplifyPaxFares(paxFares);
              const carrierName =
                journeysReq[index].segments[0].flightDesignator.carrierName ||
                "Airline";
              return [
                { title: `Tiket Penerbangan ${index + 1} • ${carrierName}` },
                ...(prices
                  ? [
                      ...prices[index].detail.map((d) => ({
                        label: `${getPaxFaresName(d.paxType)} (${d.quantity}x)`,
                        value: convertRupiah(
                          d.totalBaseFare + prices[index].total
                        ),
                      })),
                      { label: "Pajak", value: "Sudah Termasuk" },
                    ]
                  : simplePaxFares
                      .reduce((acc, curr) => {
                        if (curr.taxPrice) {
                          if (acc.find((item) => item.label === "Pajak")) {
                            acc.find((item) => item.label === "Pajak").value +=
                              curr.taxPrice;
                          } else {
                            acc.push({
                              label: "Pajak",
                              value: curr.taxPrice,
                            });
                          }
                        }
                        if (
                          acc.find(
                            (item) =>
                              item.label === getPaxFaresName(curr.paxType)
                          )
                        ) {
                          acc.find(
                            (item) =>
                              item.label === getPaxFaresName(curr.paxType)
                          ).value += curr.farePrice;
                        } else {
                          acc.push({
                            label: getPaxFaresName(curr.paxType),
                            value: curr.farePrice,
                          });
                        }
                        return acc;
                      }, [])
                      .map((item) => ({
                        ...item,
                        value: convertRupiah(item.value),
                      }))),
              ];
            }),
            [
              data.attributes.discountPromo && {
                label: "Diskon (Kode Promo)",
                value: `-${convertRupiah(data.attributes.discountPromo)}`,
                green: ["value"],
              },
              {
                label: "Total Pembayaran",
                value: convertRupiah(data.attributes.totalTransaction),
                bold: ["value"],
              },
            ],
          ],
        },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: customer?.full_name,
              },
              { label: "Email", value: customer?.email },
              { label: "Nomor Telepon", value: customer?.phone },
            ],
            [{ resend_email: true, email: customer?.email }],
          ],
        },
      ];
      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        orderNumber,
        activeUntil: journeysRes[0].departureDateTime,
      };
    }
    case "hotel": {
      const { details, payload, transaction } = product;

      const card = {
        title: details.name,
        name: details.rooms.map((room) => room.name).join(", "),
        details: [
          {
            text: format(new Date(details.checkIn), "dd MMMM yyyy"),
            tag: "Check In",
            type: "date",
          },
          {
            text: format(new Date(details.checkOut), "dd MMMM yyyy"),
            tag: "Check Out",
            type: "date",
          },
        ],
      };

      const list = [
        {
          details: [
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            { label: "Booking ID", value: data.attributes.orderNumber || "-" },
            { label: "Booking Ref", value: product_issued?.reference || "-" },
            {
              label: "Transaction ID",
              value: data.attributes.invoiceNumber || "-",
            },
            {
              label: "Metode Pembayaran",
              value: payment_method.data?.attributes.name,
            },
          ],
        },
        {
          title: "Rincian Harga",
          details: [
            [
              {
                label: `Kamar (x${details.rooms.length})`,
                value: convertRupiah(
                  details.rooms.reduce((acc, curr) => {
                    return acc + parseInt(curr.rates[0].net);
                  }, 0)
                ),
              },
              transaction?.serviceFee && {
                label: "Service Fee",
                value: transaction?.serviceFee,
              },
              data.attributes.discountPromo && {
                label: "Diskon (Kode Promo)",
                value: `-${convertRupiah(data.attributes.discountPromo)}`,
                green: ["value"],
              },
            ],
            [
              {
                label: "Total Pembayaran",
                value: convertRupiah(data.attributes.totalTransaction),
                bold: ["label", "value"],
              },
            ],
          ],
        },
        { details: [{ remarks: payload[0].remark || "Tidak Ada" }] },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: customer?.full_name,
              },
              { label: "Email", value: customer?.email },
              { label: "Nomor Telepon", value: customer?.phone },
            ],
            [{ resend_email: true, email: customer?.email }],
          ],
        },
      ];

      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        orderNumber,
        activeUntil: details.checkOut,
      };
    }
    case "attraction": {
      const { request, response } = product;

      const card = {
        title: response.data.productTypeTitle,
        subtitle: `Tiket ID: ${response.data.code}`,
        name: response.data.productTypeTitle,
        details: [
          {
            text: format(
              new Date(request.attraction.arrivalDate),
              "dddd, dd MMMM yyyy"
            ),
          },
        ],
      };

      const list = [
        {
          details: [
            {
              label: "Transaction ID",
              value: data.attributes.invoiceNumber || "-",
            },
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            {
              label: "Metode Pembayaran",
              value: payment_method.data?.attributes.name,
            },
          ],
        },
        {
          title: "Rincian Biaya",
          tag: "Harga dalam Rupiah",
          details: [
            [
              {
                label: "Subtotal",
                value: convertRupiah(request.transaction.subTotal),
              },
              data.attributes.discountPromo && {
                label: "Diskon (Kode Promo)",
                value: `-${convertRupiah(data.attributes.discountPromo)}`,
                green: ["value"],
              },
            ],
            [
              {
                label: "Harga yang harus anda bayar",
                value: convertRupiah(request.transaction.total),
                bold: ["label", "value"],
              },
            ],
          ],
        },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: customer?.full_name,
              },
              { label: "Email", value: customer?.email },
              { label: "Nomor Telepon", value: customer?.phone },
            ],
            [{ resend_email: true, email: customer?.email }],
          ],
        },
      ];

      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        orderNumber,
        activeUntil: request.attraction.arrivalDate,
      };
    }
    case "cruise": {
      const { cruise, customer, traveler, transaction } = product;

      const card = {
        title: cruise?.type || "Cruise",
        subtitle: `Kode Paket: ${cruise.departureCode}`,
        name: cruise.title,
        details: [
          { text: format(new Date(cruise.departureDate), "dd MMMM yyyy") },
        ],
      };

      const list = [
        {
          details: [
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            { label: "Booking No", value: data.attributes.orderNumber },
          ],
        },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: customer?.full_name,
              },
              { label: "Email", value: customer?.email },
              { label: "Nomor Telepon", value: customer?.phone },
            ],
            [{ resend_email: true, email: customer?.email }],
          ],
        },
        {
          title: "Detail Traveler",
          details: traveler.map((item, index) => [
            {
              title: `Traveler ${getPaxTypeName(item.paxType)} ${index + 1} • ${
                item.first_name
              }`,
            },
            {
              label: "Nama Lengkap",
              value: `${item.first_name} ${item.last_name}`,
            },
            {
              label: "Tanggal Lahir",
              value: format(new Date(item.dob), "dd MMMM yyyy"),
            },
            { label: "Nomor Paspor", value: item.docs.cardNum },
            {
              label: "Tanggal Berlaku",
              value: item.docs.cardExpired
                ? format(
                    new Date(
                      `${item.docs.cardExpired.year}-${
                        item.docs.cardExpired.month + 1
                      }-${item.docs.cardExpired.day}`
                    ),
                    "dd MMMM yyyy"
                  )
                : "-",
            },
          ]),
        },
      ];

      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        orderNumber,
        activeUntil: cruise.departureDate,
      };
    }
    case "package": {
      const { packages, customer, traveler, transaction } = product;
      const departureDate = new Date(packages.departureDate);

      const card = {
        title: packages.title,
        subtitle: `Paket ID: ${packages.departureCode}`,
        details: [
          {
            text: format(departureDate, "dd MMMM yyyy"),
          },
        ],
      };

      const list = [
        {
          details: [
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            { label: "Booking No", value: data.attributes.orderNumber },
          ],
        },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: customer?.fullName,
              },
              { label: "Email", value: customer?.email },
              { label: "Nomor Telepon", value: customer?.phone },
            ],
            [{ resend_email: true, email: customer?.email }],
          ],
        },
        {
          title: "Detail Traveler",
          details: traveler.map((item, index) => [
            {
              title: `Traveler ${getPaxTypeName(item.paxType)} ${index + 1} • ${
                item.first_name
              }`,
            },
            {
              label: "Nama Lengkap",
              value: `${item.first_name} ${item.last_name}`,
            },
            {
              label: "Tanggal Lahir",
              value: format(new Date(item.dob), "dd MMMM yyyy"),
            },
            { label: "Nomor Paspor", value: item.docs.cardNum },
            {
              label: "Tanggal Berlaku",
              value: format(
                new Date(
                  `${item.docs.cardExpired.year}-${
                    item.docs.cardExpired.month + 1
                  }-${item.docs.cardExpired.day}`
                ),
                "dd MMMM yyyy"
              ),
            },
          ]),
        },
      ];

      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        orderNumber,
        activeUntil: departureDate,
      };
    }
    case "insurance": {
      const { payload: _payload, traveler, transaction } = product;
      const payload = _payload[0];

      const card = {
        title: payload.PlanName,
        subtitle: `Coverage ID: ${payload.CoverageIDs}`,
        details: [
          {
            text: `${payload.origins} - ${payload.destinations}`,
            tag: "Asal - Tujuan",
            type: "people",
          },
          {
            text: `${format(
              new Date(payload.travel_start_date),
              "dd MMMM yyyy"
            )} - ${format(new Date(payload.travel_end_date), "dd MMMM yyyy")}`,
            type: "date",
          },
          {
            text: `${payload.package_type}, ${payload.NumOfPersons} Orang`,
            type: "people",
          },
          {
            text: payload.TravellerTypeName,
            type: "people",
          },
          payload.additionalCoverage
            ? {
                text: payload.additionalCoverage
                  .map((coverage) => coverage.Name)
                  .join(", "),
                tag: "Tambahan",
                type: "people",
              }
            : undefined,
        ],
      };

      const list = [
        {
          details: [
            {
              label: "Waktu Pemesanan",
              value: format(new Date(transactionDate), "dd MMMM yyyy, HH:mm"),
            },
            { label: "Booking No", value: data.attributes.orderNumber },
            {
              label: "Metode Pembayaran",
              value: payment_method.data?.attributes.name,
            },
          ],
        },
        {
          title: "Rincian Biaya",
          tag: "Harga dalam Rupiah",
          details: [
            [
              {
                label: `${payload.PlanName} (${getRangeDays(
                  payload.travel_start_date,
                  payload.travel_end_date
                )} Hari)`,
                value: convertRupiah(payload.MainRate),
              },
              ...(payload.additionalCoverage
                ? payload.additionalCoverage.map((coverage) => ({
                    label: coverage.Name,
                    value: convertRupiah(coverage.MainRate),
                  }))
                : []),
            ],
            [
              {
                label: "Subtotal",
                value: convertRupiah(transaction.subTotal),
              },
              data.attributes.discountPromo && {
                label: "Diskon (Kode Promo)",
                value: `-${convertRupiah(data.attributes.discountPromo)}`,
                green: ["value"],
              },
              {
                label: "Total Pemesanan",
                value: convertRupiah(transaction.total),
              },
            ],
          ],
        },
        {
          title: "Rincian Kontak",
          details: [
            [
              {
                label: "Nama Lengkap",
                value: payload.ContactFullName,
              },
              { label: "Email", value: payload.ContactEmail },
              { label: "Nomor Telepon", value: payload.ContactPhoneNumber },
            ],
            [{ resend_email: true, email: payload.ContactEmail }],
          ],
        },
        {
          title: "Detail Traveler",
          details: traveler.map((item, index) => [
            {
              title: `Traveler ${getPaxTypeName(item.paxType)} ${index + 1} • ${
                item.first_name
              }`,
            },
            {
              label: "Nama Lengkap",
              value: `${item.first_name} ${item.last_name}`,
            },
            {
              label: "Tempat Lahir",
              value: item.birthplace,
            },
            {
              label: "Tanggal Lahir",
              value: format(new Date(item.dob), "dd MMMM yyyy"),
            },
            {
              label: "Jenis Kelamin",
              value: item.gender,
            },
            {
              label: "Email",
              value: item.email,
            },
            {
              label: "Nomor Telepon",
              value: item.phone,
            },
            {
              label: "Alamat",
              value: item.address,
            },
            {
              label: "Kota",
              value: item.city,
            },
            {
              label: "Kebutuhan Perjalanan",
              value: item.needs,
            },
            { label: "Nomor Paspor", value: item.passport },
          ]),
        },
      ];

      return {
        id,
        card,
        list,
        status,
        transactionDate,
        transactionExpiration,
        type,
        orderNumber,
        activeUntil: payload.travel_end_date,
      };
    }
    default:
      return null;
  }
};

export const mapDataOrders = (orders) => {
  return orders?.map((order) => {
    const product = order.order_details[0].product;
    switch (order.type) {
      case "tour": {
        const { tours } = product;
        const departureDate = new Date(tours.departure.date);
        return {
          ...order,
          activeUntil: departureDate.setDate(
            departureDate.getDate() + tours.departure.duration
          ),
          card: {
            title: `Tour Series - ${tours.groups[0].name}`,
            subtitle: `Tour ID: ${tours.departure.code}`,
            name: tours.name,
            details: [
              {
                text: `${format(departureDate, "dd MMMM yyyy")} - ${format(
                  departureDate.setDate(
                    departureDate.getDate() + tours.departure.duration
                  ),
                  "dd MMMM yyyy"
                )}`,
                tag: `${tours.departure.duration} Hari`,
              },
            ],
          },
        };
      }
      case "flight": {
        const { request, response } = product;
        const journeysReq = request.journeys;
        const journeysRes = response[0].journeys;
        const segment = journeysReq[0].segments[0];

        return {
          ...order,
          activeUntil: journeysRes[0].departureDateTime,
          card: {
            title: `${segment.origin.city} (${segment.origin.code}) - ${segment.destination.city} (${segment.destination.code})`,
            details: [
              {
                text: (() => {
                  const arrive = format(
                    new Date(journeysRes[0].arrivalDateTime),
                    "dd MMMM yyyy, HH:mm"
                  );
                  const depart = format(
                    new Date(journeysRes[0].departureDateTime),
                    "dd MMMM yyyy, HH:mm"
                  );
                  if (arrive.split(",")[0] === depart.split(",")[0]) {
                    return `${depart} - ${arrive.split(",")[1]}`;
                  }
                  return `${depart} - ${arrive}`;
                })(),
              },
            ],
          },
        };
      }
      case "hotel": {
        const { details } = product;
        return {
          ...order,
          activeUntil: details.checkOut,
          card: {
            title: details.name,
            name: details.rooms.map((room) => room.name).join(", "),
            details: [
              {
                text: format(new Date(details.checkIn), "dd MMMM yyyy"),
                tag: "Check In",
              },
              {
                text: format(new Date(details.checkOut), "dd MMMM yyyy"),
                tag: "Check Out",
              },
            ],
          },
        };
      }
      case "attraction": {
        const { request, response } = product;
        return {
          ...order,
          activeUntil: request.attraction.arrivalDate,
          card: {
            title: response.data.productTypeTitle,
            subtitle: `Tiket ID: ${response.data.code}`,
            name: response.data.productTypeTitle,
            details: [
              {
                text: format(
                  new Date(request.attraction.arrivalDate),
                  "dddd, dd MMMM yyyy"
                ),
              },
            ],
          },
        };
      }
      case "cruise": {
        const { cruise } = product;
        return {
          ...order,
          activeUntil: cruise.departureDate,
          card: {
            title: "Paket Cruise Only",
            subtitle: `Kode Paket: ${cruise.departureCode}`,
            name: cruise.title,
            details: [
              { text: format(new Date(cruise.departureDate), "dd MMMM yyyy") },
            ],
          },
        };
      }
      case "package": {
        const { packages } = product;
        const departureDate = new Date(packages.departureDate);
        return {
          ...order,
          activeUntil: departureDate,
          card: {
            title: packages.title,
            subtitle: `Paket ID: ${packages.departureCode}`,
            details: [
              {
                text: format(departureDate, "dd MMMM yyyy"),
              },
            ],
          },
        };
      }
      case "insurance": {
        const { payload: _payload } = product;
        const payload = _payload[0];
        return {
          ...order,
          activeUntil: payload.travel_end_date,
          card: {
            title: payload.PlanName,
            subtitle: `Coverage ID: ${payload.CoverageIDs}`,
            details: [
              {
                text: `${format(
                  new Date(payload.travel_start_date),
                  "dd MMMM yyyy"
                )} - ${format(
                  new Date(payload.travel_end_date),
                  "dd MMMM yyyy"
                )}`,
              },
            ],
          },
        };
      }
      default:
        return null;
    }
  });
};
