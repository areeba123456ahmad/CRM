export async function up(knex) {
    await knex.schema.createTable('permissions', (table) => {
      table.increments('id').primary();
      table.enum('role', ['SuperAdmin', 'Admin', 'Manager', 'SalesTeamSupervisor', 'Agent']).notNullable();
      table.string('module', 255).notNullable();
      table.enum('action', ['read', 'write', 'update', 'delete']).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTable('permissions');
  }
  