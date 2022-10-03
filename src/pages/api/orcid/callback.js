/* eslint-disable import/no-anonymous-default-export */
import { setCookie } from 'cookies-next'
import passport from 'passport'
import connect from '../../../lib/database'
import '../../../lib/passport'

export default async function (req, res, next) {
  await connect()
  passport.authenticate('orcid', (err, user, info) => {
    if (err || !user) {
      return res.redirect('/?a=auth_fail')
    }

    // set cookie and send redirect
    setCookie('token', info.token, {
      req,
      res
    })
    res.redirect('/dashboard')
  })(req, res, next)
}
