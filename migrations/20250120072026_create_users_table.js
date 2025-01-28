export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
      table.increments('id').primary(); // Primary key
      table.integer('agent_id').unsigned().notNullable(); // Foreign key for the agent
      table.foreign('agent_id').references('performance.id').onDelete('CASCADE'); // Foreign key constraint
      table.string('email', 255).notNullable().unique(); // Email of the user
      table.string('password', 255).notNullable(); // Password of the user
      table.enum('role', ['SuperAdmin', 'Admin', 'Manager', 'SalesTeamSupervisor', 'Agent']).notNullable(); // Role of the user
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Created timestamp
      table.timestamp('updated_at').defaultTo(knex.fn.now()); // Last updated timestamp
  });
}

export async function down(knex) {
  await knex.schema.dropTable('users'); // Drop the table on rollback
}
