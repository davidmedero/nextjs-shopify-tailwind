import nextConnect from 'next-connect'
import middleware from '../../middleware/database'
import { getSession } from "next-auth/react"


const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {

    await req.db.collection('users').update(
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
            $set: { saved_items: { $concatArrays: [ "$saved_items", [req.body] ] } }
        },
        { $merge: 'users' },
     ] ).toArray()

})

export default handler