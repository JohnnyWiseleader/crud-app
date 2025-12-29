// Here we export some useful types and functions for interacting with the Anchor program.
import CrudappIDL from '../target/idl/crudapp.json'

// Re-export the generated IDL and type
export { CrudappIDL }

export * from './client/js'
