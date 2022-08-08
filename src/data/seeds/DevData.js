const { tables } = require('..');
const Role = require('../../core/roles')
const { verifyPassword, hashPassword } = require('../../core/password');
const {faker} = require('@faker-js/faker');
module.exports = {

    seed: async (knex) => {
      const createFakeUser = async () => ({
        naam: faker.name.lastName(), 
        voornaam: faker.name.firstName(),
        email:faker.internet.email(),
        password_hash: await hashPassword(faker.internet.password()),
        roles: JSON.stringify([Role.USER]),
      })
      const createFakePost = async () => ({
        Title: faker.lorem.words(3), 
        Description:faker.lorem.sentences(1),
        Author: 1,
      })
      const fakePosts = [];
      const amountPosts = 10;
      for (let i = 0; i < amountPosts; i++) {
        fakePosts.push(await createFakePost())
      }
      const fakeUsers = [];
      const amount = 5;
      fakeUsers.push({ 
        UserId: 1,
        naam:'Bommele',
        voornaam:'Pieter', 
        email:'pbandere@gmail.com',
        password_hash: '$2a$12$k31rSf3yxTyP30usv4RUQ.NaZX5sd.7vTq1Sq2t.nD75gkGPhPiRe',
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
    })
      for (let i = 0; i < amount; i++) {
        fakeUsers.push(await createFakeUser())
      }
      knex('post').del()
      return knex('user').del()
      .then(function () {
        // Inserts seed entries
        return knex('user').insert(fakeUsers);
      }).then(function () {
        return knex('post').insert(fakePosts);
      });
    },
  };
  