export async function seed(knex) {
  await knex('activity_logs').del();
  await knex('activity_logs').insert([
    { action: 'Login', module: 'Authentication', user_id: 1 },
    { action: 'View', module: 'Dashboard', user_id: 2 },
    { action: 'Update', module: 'Orders', user_id: 3 },
  ]);
}
