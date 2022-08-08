
exports.up = function(knex, Promise) {
  return knex.schema.createTable('User', function(table){ 
    table.increments('userId').primary();
    table.string('naam');
    table.string('voornaam');
    table.string('email').notNullable();
    table.string('password_hash')
    .notNullable();
    table.jsonb('roles')
    .notNullable();
    table.unique('email', 'idx_user_email_unique');
    table.timestamps();
}).createTable('Post',function(table){
    table.increments('postId').primary();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.integer('author').unsigned().references('userId').inTable('User').onDelete('CASCADE');
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('Post').dropTable('User');
};
