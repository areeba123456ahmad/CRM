export async function up (knex) {
    return knex.schema.createTable('permissions', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('Per_edit').defaultTo(false);
      table.boolean('Per_add').defaultTo(false);
      table.boolean('Per_performance').defaultTo(false);
      table.timestamps(true, true); // Adds created_at and updated_at columns
    });
  };
  
  export async function down(knex) {
    return knex.schema.dropTableIfExists('permissions');
  };
  