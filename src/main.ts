import aVar from './utils/create-server'

const PORT = process.env.PORT || 3001

aVar.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})
