module.exports = {
	log: {
		level: 'silly',
		disabled: true,
	},
	cors: {
		origins: ['http://localhost:3000'],
		maxAge: 3 * 60 * 60,
	},
	database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'webservicesTEST',
	  username:'root',
	  password:'Kaas1212'
  },
	pagination: {
    limit: 100,
    offset: 0,
  },
	auth: {
	  argon: {
		  saltLength: 16,
		  hashLength:32,
		  timeCost: 6,
		  memoryCost: 2 ** 17,
	  },
	  jwt: {
		secret: 'supercrazymoeilijkwachtwoorddatniemandraad',
		expirationInterval: 60 * 60 * 1000,
		issuer: 'pieter.bommele',
		audience: 'pieter.bommele',
	  }
  },
};