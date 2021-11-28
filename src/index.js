const createServer = require('./createServer');
const { getLogger } = require('./core/logging');

const logger = getLogger();

async function main() {	
	try {
		const server = await createServer();
		await server.start();

		async function onClose() {
			await server.stop();
			process.exit(0);
		  }
	  
	}
	catch (error){
		logger.error(error);
		process.exit(-1);
	}
}

main();