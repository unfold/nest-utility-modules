import * as Joi from '@hapi/joi'

export const isUrl = (url: string): boolean => {
  const { error } = Joi.string().uri().required().validate(url)

  return !error
}
