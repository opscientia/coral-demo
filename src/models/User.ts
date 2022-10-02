import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  orcid: String,
  createdAt: Date,
  accessToken: String,
  token: [String]
})

const User = mongoose.model('user', userSchema)

export default User
