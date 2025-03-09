// This file is kept for compatibility but is not used in the current implementation
// The application now uses a mock database layer instead

export const supabase = {
  auth: {
    signIn: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  })
};