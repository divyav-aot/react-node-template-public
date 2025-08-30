import { Joi } from 'express-validation'

export default {
  createUser: {
    body: Joi.object({
      firstName: Joi.string().max(50).regex(/^[a-zA-Z ]+$/).required(),
      middleName: Joi.string().max(50).regex(/^[a-zA-Z ]+$/).allow('').allow(null),
      lastName: Joi.string().max(50).regex(/^[a-zA-Z ]+$/).required(),
      dateOfBirth: Joi.date().required()
    })
  },

  updateUser: {
    params: Joi.object({
      userId: Joi.number().positive().required()
    }),
    body: Joi.object({
      firstName: Joi.string().max(50).regex(/^[a-zA-Z ]+$/).optional(),
      middleName: Joi.string().max(50).regex(/^[a-zA-Z ]+$/).allow('').allow(null).optional(),
      lastName: Joi.string().max(50).regex(/^[a-zA-Z ]+$/).optional(),
      dateOfBirth: Joi.date().required()
    })
  },

  findOrDeleteUser: {
    params: Joi.object({
      userId: Joi.number().positive().required()
    })
  }
}
