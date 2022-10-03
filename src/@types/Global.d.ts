import mongoosedb from 'mongoose'

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: typeof mongoosedb
    }
  }
}
