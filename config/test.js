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
    name: 'kfcmoerbeketest',
	  username:'root',
	  password:'root'
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
		secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
		expirationInterval: 60 * 60 * 1000,
		issuer: 'matti.deroos.be',
		audience: 'matti.deroos.be',
	  }
  },
};