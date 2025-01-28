export function seed(knex) {
  // Deletes ALL existing entries
  return knex('agentDetails').del()
      .then(() => {
          // Inserts seed entries
          return knex('agentDetails').insert([
              { agent_id: 44, agent_name: 'John Doe', sales_completed: 1, sales_target: 10 },
              { agent_id: 45, agent_name: 'Jane Smith', sales_completed: 1, sales_target: 15 },
              { agent_id: 46, agent_name: 'Sam Wilson', sales_completed: 1, sales_target: 8 }
          ]);
      });
}
