const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI


console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneNumberValidator = (value) => {
  if (value.length < 8) return false
  // The regex pattern to match phone numbers with a '-' and either seven or six digits
  const phoneNumberPattern = /^\d{2,3}-\d+$/

  // Test the value against the regex pattern
  return phoneNumberPattern.test(value)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: phoneNumberValidator,
      message: 'Invalid phone number format. Use format: xx-xxxxxxx or xxx-xxxxxx' },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)