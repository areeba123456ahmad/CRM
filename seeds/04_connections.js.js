export async function seed(knex) {
  await knex('connections').del();
  await knex('connections').insert([
    { name: 'Connection A', details: 'Details about Connection A', status: 'Active' },
    { name: 'Connection B', details: 'Details about Connection B', status: 'Inactive' },
  ]);
}
