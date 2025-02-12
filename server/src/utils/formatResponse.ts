export const formatResponse = <T>(success: boolean, message: string, data?: T) => ({
  success,
  message,
  ...(data && { data })
});