//mongoDB
const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {    
    console.log('connected to MongoDB')  
  })  
  .catch((error) => {    
    console.log('error connecting to MongoDB:', error.message)  
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,    
    minLength: 3,    
    required: true,
    unique: true
  },
  number: {
    type: String,
    // custom mongoose validator to check if number is in correct format
    validate: {
      validator: (number) => /^\d{8}$|^\d{2,3}\-\d{8}$/.test(number),
      message: props => `${props.value} is not a valid phone number format!`
    },    
    required: true
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
