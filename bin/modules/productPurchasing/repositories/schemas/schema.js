const Schema = require('mongoose').Schema;

const productPurchaseSchema = new Schema({
	transactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    product: {
        productType: { type: String, required: true },
        refTransactionId: { type: String, required: true },
        refNumber: { type: String, required: true },
        productCode: { type: String, required: true },
        productName: { type: String, required: true },
        billNumber: { type: Number, required: true, default: 0 },
        billAmount: { type: Number, required: true, default: 0 },
        feeAmount: { type: Number, required: true, default: 0 },
        totalAmount: { type: Number, required: true, default: 0 }
    },
    discountAmount: { type: Number, required: true, default: 0 },
    transactionAmount: { type: Number, required: true, default: 0 },
    isPurchaseSuccess: { type: Boolean, required: true, default: false },
    additionalInformation: {}
}, {timestamps: true, strict: true});

module.exports = productPurchaseSchema;
