import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DATABASE_URL: {
    description: 'The database connection string.',

    validate: {
      '~standard': {
        version: 1,
        vendor: 'raz',

        validate(value: unknown) {
          if (
            value === undefined ||
            typeof value === 'string'
          ) {
            return { value };
          }

          return {
            issues: [
              {
                message: 'DATABASE_URL must be a string.'
              }
            ]
          };
        }
      }
    }
  }
});