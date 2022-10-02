import OrcidStrategy from 'passport-orcid'
import { createUser, findUser } from './user'
export const OrcidAuth = new OrcidStrategy(
  {
    sandbox: true, // remove this to use the production API
    state: false, // remove this if not using sessions
    clientID: process.env.ORCID_CLIENT_ID,
    clientSecret: process.env.ORCID_CLIENT_SECRET,
    callbackURL: '/auth/orcid/redirect'
  },
  (accessToken, refreshToken, params, profile, done) => {
    // `profile` is empty as ORCID has no generic profile URL,
    // so populate the profile object from the params instead
    profile = { orcid: params.orcid, name: params.name }

    createUser({
      orcid: profile.orcid,
      username: profile.name
    }).then((currentUser: unknown) => {
      if (currentUser) {
        // User already exists, log their info
        console.log('User is:' + currentUser)
        done(null, currentUser)
      } else {
        findUser(profile).then((newUser: unknown) => {
          console.log('New User Created:' + newUser)
          done(null, newUser)
        })
      }
    })
  }
)
