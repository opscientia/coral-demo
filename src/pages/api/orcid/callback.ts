import { setCookies } from 'cookies-next'
import passport from 'passport'
import dbConnect from '@utils/auth/database'
import '@utils/auth/passport'

export default async function (req, res, next) {
  await dbConnect()
  passport.authenticate('orcid', (err, user, info) => {
    if (err || !user) {
      console.error(
        'Encountered an error while authenticating, redirecting to login. Error:' +
          err
      )
      return res.redirect('/login')
    }

    // set cookie and send redirect
    setCookies('token', info.token, {
      req,
      res
    })
    res.redirect('/dashboard')
  })(req, res, next)
}
