export const delay = async (timeMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), timeMs)
  })
