const supertest = require('supertest');
const createServer = require('../../src/CreateServer')
const { getKnex, tables } = require('../../src/data');


const data = {
	posts:[
	{ postId: 1,title: 'Post 1', description: 'Description 1', author: 1 },
	{ postId: 2,title: 'Post 2', description: 'Description 2', author: 1 },
	{ postId: 3,title: 'Post 3', description: 'Description 3', author: 1 },]
}

const dataToDelete = {
	posts:[
		1,2,3
]
}

describe('posts', () =>{

	let server;
	let request;
	let knex;
	let token;
	
	const url = '/api'

	beforeAll(async () => {
		server = await createServer();
		request = supertest(server.getApp().callback());
		knex = getKnex();
		await knex(tables.user).insert({ 
			UserId: 1,
			naam:'Bommele',
			voornaam:'Pieter', 
			email:'pbandere@gmail.com',
			password_hash: '$2a$12$k31rSf3yxTyP30usv4RUQ.NaZX5sd.7vTq1Sq2t.nD75gkGPhPiRe',
			roles: JSON.stringify(["admin", "user"]),
	});
		const response = await request.post(`${url}/users/login`).send({
			"email" :  "pbandere@gmail.com",
			"password" : "Kaas1212"
	});
		token = response.body.token
	});


	afterAll(async () => {
		await knex(tables.user).del();
		await server.stop();
	});

	describe('GET /api/posts', () => {
		beforeAll(async () =>{
			await knex(tables.post).insert(data.posts);
		});

		afterAll(async () => {
			await knex(tables.post)
				.whereIn('postId', dataToDelete.posts)
				.delete();
		});



		it('should 200 and return all posts', async () => {
			const response = await request.get(`${url}/posts`).set('Authorization', 'Bearer ' + token) ;
			expect(response.status).toBe(200);
			expect(response.body.limit).toBe(100);
			expect(response.body.offset).toBe(0);
			expect(response.body.data.length).toBe(3);
		 });
	});

	describe('GET /api/posts/:postId', () => {
		beforeAll(async () =>{
			await knex(tables.post).insert(data.posts);
		});

		afterAll(async () => {
			await knex(tables.post)
				.whereIn('postId', dataToDelete.posts)
				.delete();
		});



		it('should 200 and return the requested post', async () => {
			const postId = data.posts[0].postId;
			const response = await request.get(`${url}/posts/${postId}`).set('Authorization', 'Bearer ' + token) ;
			expect(response.status).toBe(200);
			expect(response.body).toEqual(data.posts[0]);

		 });
	});

	describe('PUT /api/posts', () => {

		beforeAll(async () =>{
			await knex(tables.post).insert(data.posts);
		});

		afterAll(async () => {
			await knex(tables.post)
				.whereIn('postId', dataToDelete.posts)
				.delete();
		});



		it('should 200 and return the updated post', async () => {
			const postid = data.posts[0].postId;
			const response = await request.put(`${url}/posts/${postid}`).send({title:"post update", description: "post updated"}).set('Authorization', 'Bearer ' + token) ;
			expect(response.status).toBe(200);
			expect(response.body.postId).toEqual(postid);
			expect(response.body.title).toBe("post update");
			expect(response.body.description).toBe("post updated");
		 });
	});

	describe('POST /api/posts/', () => {

		const postToDelete = [];

		beforeAll(async () =>{
			await knex(tables.post).insert(data.posts);
		});

		afterAll(async () => {
			await knex(tables.post)
				.whereIn('postId', dataToDelete.posts)
				.delete();

				await knex(tables.post)
        .whereIn('postId', postToDelete)
        .delete();
		});



		it('should 201 and return the created post', async () => {
			const response = await request.post(`${url}/posts/`).send({title:"post nieuw", description: "Dit is een nieuwe post",author: 1}).set('Authorization', 'Bearer ' + token) ;
			expect(response.status).toBe(200);
			expect(response.body.postId).toBeTruthy();
			expect(response.body.title).toBe('post nieuw');
			expect(response.body.description).toBe("Dit is een nieuwe post");
			expect(response.body.author).toBe(1);

			postToDelete.push(response.body.postId);
		 });	
	});


	describe('DELETE /api/posts/:postId', () => {

		beforeAll(async () =>{
			await knex(tables.post).insert(data.posts);
		});

		afterAll(async () => {
			await knex(tables.post)
				.whereIn('postId', dataToDelete.posts)
				.delete();
		});



		it('should 201 and return empty body', async () => {
			const postid = data.posts[0].postId;
			const response = await request.delete(`${url}/posts/${postid}`).set('Authorization', 'Bearer ' + token) ;
			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		 });
	});
})