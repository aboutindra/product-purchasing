require('./bin/app/server')();

process.on('SIGTERM', () => {
	console.info('SIGTERM signal received');
	console.log('Closing app...');

    consumerGroup.pause();
    setTimeout(() => {
        consumerGroup.close(true, () => {
            console.log("Message broker connection closed");
        })
    }, 15000).unref();
});
