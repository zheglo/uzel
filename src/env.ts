import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DATABASE_URL: {
    description: 'The database connection string.',

    schema: (value: string | undefined): string | undefined => value
  }
});