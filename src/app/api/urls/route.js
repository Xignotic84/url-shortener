import {NextResponse} from "next/server";
import Mongo from './../../../../services/Mongo'
import {nanoid} from 'nanoid'
import ms from 'ms'
import {models} from 'mongoose'

const url = models.url
import {headers} from 'next/headers'

function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export async function POST(req) {
    const headersList = headers()
    const auth = headersList.get('authorization')

    await Mongo()
    const body = await req.json()


    if (!isValidURL(body.url)) {
        return NextResponse.json({code: 400, message: "Invalid URL provided."}, {
            status: 400
        })
    }

    if (!auth) {
        return NextResponse.json({code: 401, message: "User ID missing, refresh page"}, {
            status: 401
        })
    }

    const shortUrl = nanoid(8)

    const offset = body.timePeriod === "Never" ? ms("100 years") : ms(body.timePeriod)
    const expirationDate = new Date(new Date().getTime() + offset)

    await url.create({
        user: auth,
        url: body.url,
        shortUrl,
        expirationDate
    })

    return NextResponse.json({shortUrl});
}


export async function GET(req) {
    const headersList = headers()
    const auth = headersList.get('authorization')
    await Mongo()

    if (!auth) {
        return NextResponse.json({code: 401, message: "User ID missing, refresh page"}, {
            status: 401
        })
    }

    const previousUrls = await url.find({user: auth})

    return NextResponse.json({previousUrls});
}

export async function DELETE(req) {
    const headersList = headers()
    const auth = headersList.get('authorization')
    const {searchParams} = new URL(req.url)
    const id = searchParams.get('id')

    await Mongo()

    const foundUrl = await url.findOne({shortUrl: id})

    if (!foundUrl) {
        return NextResponse.json({code: 404, message: "Couldn't find the URL, you're trying to delete"}, {
            status: 500
        })
    }


    console.log(auth, foundUrl.user)
    if (foundUrl.user !== auth) {
        return NextResponse.json({code: 403, message: "You don't have permission to delete this url"}, {
            status: 403
        })
    }

    try {
        await url.findOneAndDelete({shortUrl: id})
    } catch (err) {
        return NextResponse.json({code: 500, message: "Something went wrong deleting."}, {
            status: 500
        })
    }
    return NextResponse.json({code: 200})

}
