import mongoosedb from 'mongoose'
declare global {
  const mongoose: typeof mongoosedb
}
