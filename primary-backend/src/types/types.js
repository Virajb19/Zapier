const {z} = require('zod')

const SignupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(4).max(10)
})

const SigninSchema = z.object({
    username: z.string(),
    password: z.string().min(4).max(10)
})

const ZapCreateSchema = z.object({
    triggerId: z.string(),
    userId: z.string(),
    triggerMetaData: z.any().optional(),
     actions: z.array(z.object({
        actionId: z.string(),
        actionMetaData: z.any().optional()
     }))
})

module.exports = {
    SignupSchema,
    SigninSchema,
    ZapCreateSchema
}