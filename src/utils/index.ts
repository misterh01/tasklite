
export * from './randImg';

// generate a random stirng id
export const generateId = () => Math.random().toString(36).substring(2);