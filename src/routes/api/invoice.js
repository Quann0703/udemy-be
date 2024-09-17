const express = require("express");
const router = express.Router();
const invoiceController = require("../../controllers/InvoiceController");
const {
  authenticateUser,
  checkUserLogin,
} = require("../../middleware/authMiddleware");

router.all("*", authenticateUser);

router.get("/:id", invoiceController.getInvoiceId);
router.get("/", invoiceController.getInvoice);
router.post("/", checkUserLogin, invoiceController.createInvoice);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
