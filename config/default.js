require('dotenv').config()

module.exports = {
    port: process.env.PORT,
    mongoDbProductPurchasingUrl: process.env.MONGO_DB_PRODUCT_PURCHASING_URL,
    kafkaProductPurchasingUrl: process.env.KAFKA_PRODUCT_PURCHASING_URL,
    kafkaGroupName: process.env.KAFKA_GROUP_NAME,
    kafkaConsumedTopic: process.env.KAFKA_CONSUMED_TOPIC,
    kafkaProductPurchasingTopic: process.env.KAFKA_PRODUCT_PURCHASING_TOPIC,
    virtualAccountMutationTopic: process.env.KAFKA_MUTATE_VA_TOPIC,
    refundPointTopic: process.env.KAFKA_REFUND_POINT_TOPIC,
    transactionServiceUrl: process.env.TRANSACTION_SERVICE_URL,
    transactionPath: process.env.TRANSACTION_PATH,
    dsnSentryUrl: process.env.DSN_SENTRY_URL,
    ApmServerUrl : process.env.ELASTIC_APM_SERVER_URL,
    ApmActive: process.env.ELASTIC_APM_ACTIVE,
    MongoDB: [
        {
            index: "product-purchasing-mongodb",
            config: {
                uri: process.env.MONGO_DB_PRODUCT_PURCHASING_URL
            }
        }
    ],
    KafkaProducer: [
        {
            index: "product-purchasing-kafka",
            config: {
                uri: process.env.KAFKA_PRODUCT_PURCHASING_URL
            }
        }
    ]
}
