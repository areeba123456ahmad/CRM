export async function seed (knex) {
  // Clear existing entries in the permissions table
  await knex('permissions').del();

  // Select users except admin and superadmin
  const users = await knex('users').whereNotIn('role', ['admin', 'superadmin']);

  // Generate permission entries
  const permissions = users.map((user) => ({
    user_id: user.id,
    Per_edit: false, // Default permission
    Per_add: false, // Default permission
    Per_performance: false, // Default permission
  }));

  // Insert permissions into the table
  await knex('permissions').insert(permissions);
};
