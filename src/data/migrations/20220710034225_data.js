
exports.up = function(knex, Promise) {
  return knex.schema.createTable('User', function(table){ 
    table.increments('userId').primary();
    table.string('naam');
    table.string('voornaam');
    table.string('email').notNullable();
    table.string('password_hash').notNullable();
    table.jsonb('roles').notNullable();
    table.string("imageURL").notNullable();
    table.timestamps();
}).createTable('Match',function(table){
    table.increments('matchID').primary();
    table.string('CourtType').notNullable();
    table.jsonb("Score").notNullable();
    table.integer('SpelerA').unsigned().references('userId').inTable('User').onDelete('CASCADE');
    table.integer('SpelerB').unsigned().references('userId').inTable('User').onDelete('CASCADE');
    table.date('date').notNullable();
})
};

exports.down = function(knex) {
  return knex.schema.dropTable("Match").dropTable('User');
};
