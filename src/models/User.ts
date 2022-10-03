import mongoose from 'mongoose'

export interface User {
  username: string
  orcid: string
  accessToken: string
  tokens: [string]
  createdAt: Date
}
const userSchema = new mongoose.Schema({
  username: String,
  orcid: String,
  accessToken: String,
  tokens: [String],
  createdAt: Date
})
export default (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model('User', userSchema)
