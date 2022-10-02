import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  orcid: String,
  createdAt: Date
})

const User = mongoose.model('user', userSchema)

export default User
