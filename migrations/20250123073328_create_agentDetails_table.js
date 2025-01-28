export function up(knex) {
  return knex.schema.createTable('agentDetails', function(table) {
      table.increments('id').primary(); // Primary key
      table.integer('agent_id').unsigned().notNullable(); // Foreign key from users table
      table.foreign('agent_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('agent_name').notNullable();
      table.integer('sales_completed').defaultTo(0).notNullable();
      table.integer('sales_target').notNullable();
  });
};

export function down(knex) {
  return knex.schema.dropTableIfExists('agentDetails');
};
