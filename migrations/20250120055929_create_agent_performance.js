export async function up(knex) {
    await knex.schema.createTable('agent_performance', (table) => {
      table.increments('id').primary(); // Primary key
      table.integer('agent_id').notNullable(); // Foreign key for the agent
      table.integer('total_sales').defaultTo(0); // Total sales by the agent
      table.integer('sales_target').defaultTo(0); // Target for the agent
      table.float('fulfillment_rate', 8, 2).defaultTo(0); // Fulfillment rate
      table.integer('pending_tasks').defaultTo(0); // Pending tasks for the agent
      table.timestamp('performance_date').defaultTo(knex.fn.now()); // Use TIMESTAMP instead of DATE
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Created timestamp
      table.timestamp('updated_at').defaultTo(knex.fn.now()); // Last updated timestamp
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTable('agent_performance'); // Drop the table on rollback
  }
  