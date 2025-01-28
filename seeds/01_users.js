// `seeds/02_users.js`

export async function seed(knex) {
  await knex('users').del(); // Clears existing data

  await knex('users').insert([
      {  email: 'superadmin@crm.com', password: '123', role: 'SuperAdmin', created_at: knex.fn.now(), updated_at: knex.fn.now() },
      {  email: 'admin@crm.com', password: '123', role: 'Admin', created_at: knex.fn.now(), updated_at: knex.fn.now() },
      { email: 'manager@crm.com', password: '123', role: 'Manager', created_at: knex.fn.now(), updated_at: knex.fn.now() },
      {  email: 'Supervisor@crm.com', password: '123', role: 'SalesTeamSupervisor', created_at: knex.fn.now(), updated_at: knex.fn.now() },
      {  email: 'agent1@crm.com', password: '123', role: 'Agent', created_at: knex.fn.now(), updated_at: knex.fn.now() },
      {  email: 'agent2@crm.com', password: '123', role: 'Agent', created_at: knex.fn.now(), updated_at: knex.fn.now() },
      {  email: 'agent3@crm.com', password: '123', role: 'Agent', created_at: knex.fn.now(), updated_at: knex.fn.now() },
  ]);
}
