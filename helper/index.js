const axios = require("axios");
const VendorModel = require("../db/model");

const apiKey = process.env.API_KEY || "";
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

const triggerProfile = async (email, data) => {
  try {
    console.log(data);
    if (data?.status === "active") {
      const options = {
        method: "POST",
        url: "https://a.klaviyo.com/api/events/",
        headers: {
          accept: "application/json",
          revision: "2024-05-15",
          "content-type": "application/json",
          Authorization: `Klaviyo-API-Key ${apiKey}`,
        },
        data: {
          data: {
            type: "event",
            attributes: {
              properties: {
                vendor_name: data?.vendor || "",
                ImageURL: data?.image?.src || "",
                product_name: data?.title || "",
                product_link: `https://oblist.com/products/${
                  data?.handle || ""
                }`,
              },
              metric: {
                data: {
                  type: "metric",
                  attributes: { name: "Email Matric" },
                },
              },
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    email: email,
                  },
                },
              },
            },
          },
        },
      };
      await axios.request(options);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getprofile = async (id) => {
  const custom_url = `https://the-oblist.myshopify.com/admin/api/2024-07/custom_collections.json?product_id=${id.toString()}`;
  const smart_url = `https://the-oblist.myshopify.com/admin/api/2024-07/smart_collections.json?product_id=${id.toString()}`;

  try {
    const [customData, smartData] = await Promise.all([
      axios.get(custom_url, {
        headers: { "X-Shopify-Access-Token": accessToken },
      }),
      axios.get(smart_url, {
        headers: { "X-Shopify-Access-Token": accessToken },
      }),
    ]);

    const customCollections = customData?.data?.custom_collections || [];
    const smartCollections = smartData?.data?.smart_collections || [];

    // Combine and remove duplicates by converting to a Set
    const collectionTitles = [
      ...new Set([
        ...customCollections?.map((collection) => collection?.title),
        ...smartCollections?.map((collection) => collection?.title),
      ]),
    ];

    const vendorCustomerEmails = await VendorModel.find({
      vendor: { $in: collectionTitles },
    });

    return vendorCustomerEmails;
  } catch (error) {
    console.error("Error fetching profiles:", error.message);
    throw new Error(error.response?.data?.errors || error.message);
  }
};


module.exports = { getprofile, triggerProfile };
