const paymentGetWay = (productData, tran_id) => {
  const data = {
    total_amount: productData?.payableAmount,
    currency: productData?.currency,
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:3052/api/v1/payment/success/${tran_id}`,
    fail_url: `http://localhost:3052/api/v1/payment/fail/${tran_id}`,
    cancel_url: "http://localhost:3052/api/v1/cancel",
    ipn_url: "http://localhost:3052/api/v1/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: productData?.name,
    cus_email: productData?.email,
    cus_add1: productData?.address,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: productData?.number,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "10",
    ship_country: "Bangladesh",
  };

  return data;
};

module.exports = {
  paymentGetWay,
};
