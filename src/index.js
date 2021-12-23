const createServer = require('./createServer');

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
		console.log(error)
		process.exit(-1);
	}
}

main();