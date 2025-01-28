export function up(knex) {
  return knex.schema.createTable('userOrders', function(table) {
      table.increments('id').primary(); // Primary key
      table.string('customer_name').notNullable();
      table.integer('item_id').unsigned().notNullable(); // Foreign key from items table
      table.foreign('item_id').references('id').inTable('items').onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.integer('agent_id').unsigned().notNullable(); // Foreign key from agentDetails table
      table.foreign('agent_id').references('id').inTable('agentDetails').onDelete('CASCADE');
      table.date('order_date').notNullable();
      table.string('tracking_id').unique().notNullable();
  });
};

export function down(knex) {
  return knex.schema.dropTableIfExists('userOrders');
};
