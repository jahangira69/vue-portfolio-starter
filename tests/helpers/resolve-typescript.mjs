// Node's TypeScript stripping does not add extensions as a bundler does.
// Keep application imports idiomatic; resolve only this test's local server TS.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context)
  } catch (error) {
    if (
      error?.code === 'ERR_MODULE_NOT_FOUND' &&
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      !/\.[a-z]+$/i.test(specifier) &&
      context.parentURL?.includes('/server/')
    ) {
      return nextResolve(`${specifier}.ts`, context)
    }
    throw error
  }
}
