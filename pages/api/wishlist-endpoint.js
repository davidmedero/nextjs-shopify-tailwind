import nextConnect from 'next-connect'
import middleware from '../../middleware/database'
import { getSession } from "next-auth/react"


const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {

    await req.db.collection('users').updateOne(
        { "saved_items": { $exists : false } }, 
        { $set: { "saved_items": [] } }
    )

    res.json(await req.db.collection('users').find({}).toArray())

})

handler.post(async (req, res) => {
    const session = await getSession({ req })
    const email = JSON.stringify(session?.user.email)

    await req.db.collection('users').aggregate( [
        {
            $match: { email: JSON.parse(email) }
        },
        {
            $set: { saved_items: { $concatArrays: [ "$saved_items", [JSON.parse(req.body)] ] } }
        },
        { 
            $merge: 'users' 
        },
     ] ).toArray()

     res.json(await req.db.collection('users').find({}).toArray())

})

handler.delete(async (req, res) => {
    const session = await getSession({ req })
    const email = JSON.stringify(session?.user.email)

    await req.db.collection('users').updateOne(
        { email: JSON.parse(email) },
        { $pull: { "saved_items": { $in: [JSON.parse(req.body)] } } }
    )

    res.json(await req.db.collection('users').find({}).toArray())

})

export default handler