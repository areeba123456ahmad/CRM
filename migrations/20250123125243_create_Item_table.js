export function up(knex) {
  return knex.schema.createTable('items', function(table) {
      table.increments('id').primary(); // Primary key
      table.string('item_description').notNullable();
      table.decimal('price', 10, 2).notNullable(); // Holds the price of the item
  });
};

export function down(knex) {
  return knex.schema.dropTableIfExists('items');
};
