import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  orcid: String,
  accessToken: String,
  tokens: [String],
  createdAt: Date
})

const User = mongoose.model('user', userSchema)

export default User
