module.exports = {
	log: {
		level: 'silly',
		disabled: false,
	},
	cors: {
		origins: ['https://agitated-meitner-a6099c.netlify.app'],
		maxAge: 3 * 60 * 60,
	},
	database: {
    client: 'mysql2',
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
		expirationInterval: 60 * 60 * 1000,
		issuer: 'matti.deroos.be',
		audience: 'matti.deroos.be',
	  }
  },
};