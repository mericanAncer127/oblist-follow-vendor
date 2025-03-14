const { getprofile, triggerProfile } = require("../../helper");
const send_email_router = require("express").Router();

send_email_router.post("/emails", async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      return res
        .status(400)
        .json({ success: false, message: "Collection id is required" });
    }

    const emails = await getprofile(data.id);
    for (let i = 0; i < emails.length; i++) {
      try {
        await triggerProfile(emails[i].customerEmail, data);
      } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Emails send are vendors is customers.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = send_email_router;
