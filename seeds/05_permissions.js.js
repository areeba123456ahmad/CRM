export async function seed(knex) {
  await knex('permissions').del();
  await knex('permissions').insert([
    { role: 'SuperAdmin', module: 'Users', action: 'read' },
    { role: 'Admin', module: 'Orders', action: 'write' },
    { role: 'Agent', module: 'Sales', action: 'update' },
  ]);
}
