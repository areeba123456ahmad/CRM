export async function up(knex) {
    await knex.schema.createTable('sales', (table) => {
      table.increments('id').primary();
      table.integer('agent_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('customer_name', 255).notNullable();
      table.string('product', 255).notNullable();
      table.enum('status', ['Pending', 'Confirmed', 'Delivered']).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTable('sales');
  }
  