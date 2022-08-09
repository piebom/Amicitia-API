const { tables } = require('..');
const Role = require('../../core/roles')
const { verifyPassword, hashPassword } = require('../../core/password');
const {faker} = require('@faker-js/faker');
module.exports = {

    seed: async (knex) => {

      const fakePosts = [];
      const amountPosts = 10;

      const fakeUsers = [{ 
        UserId: 1,
        naam:'Bommele',
        voornaam:'Pieter', 
        email:'pbandere@gmail.com',
        password_hash: '$2a$12$k31rSf3yxTyP30usv4RUQ.NaZX5sd.7vTq1Sq2t.nD75gkGPhPiRe',
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
    }];
      const amountUsers = 5;

      const fakeComments = [];
      const amountComments = 1;

      // Create users
      const createFakeUser = async (id) => ({
        UserId: id,
        naam: faker.name.lastName(), 
        voornaam: faker.name.firstName(),
        email:faker.internet.email(),
        password_hash: await hashPassword(faker.internet.password()),
        roles: JSON.stringify([Role.USER]),
      })
      
      // Create posts
      const createFakePost = async (id) => ({
        PostId: id,
        Title: faker.lorem.words(3), 
        Description:faker.lorem.sentences(1),
        Author: 1,
      })

      // Create comments
      const createFakeComment = async (id) => ({
        CommentId: id,
        Description: faker.lorem.sentences(1),
        Author: 1,
        Post: 1,
      })

      for (let i = 0; i < amountPosts; i++) {
        fakePosts.push(await createFakePost(i+1))
      }
      for (let i = 1; i <= amountUsers; i++) {
        fakeUsers.push(await createFakeUser(i+1))
      }
      for (let i = 0; i < amountComments; i++) {
        fakeComments.push(await createFakeComment(i+1))
      }
      knex('Comment').del()
      knex('Post').del()
      return knex('User').del()
      .then(function () {
        // Inserts seed entries
        return knex('user').insert(fakeUsers);
      }).then(function () {
        return knex('post').insert(fakePosts);
      })
      .then(function () {
        return knex('comment').insert(fakeComments);
      });
    },
  };
  