import * as Joi from 'joi'

export const isEmail = (email: string): boolean => {
  const { error } = Joi.string().email().required().validate(email)

  return !error
}
