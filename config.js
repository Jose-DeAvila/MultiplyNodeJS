const config = {
  JWT_SECRET:process.env.JWT_SECRET || 'somethingsecrethere',
  MONGO_URL:process.env.MONGO_URL || 'mongodb://localhost:27017/loansApp'
}

module.exports=config;
