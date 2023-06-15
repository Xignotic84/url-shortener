import {NextResponse} from "next/server";
import Mongo from './../../../../services/Mongo'
import { nanoid } from 'nanoid'
import { models } from 'mongoose'
const url = models.url

function isValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

export async function POST(req) {
  await Mongo()
  const body = await req.json()

  if (!isValidURL(body.url)) {
    return NextResponse.json({code: 400, message: "Invalid URL provided."}, {
      status: 400
    })
  }

  const shortUrl = nanoid(8)

  await url.create({
    url: body.url,
    shortUrl
  })

  return NextResponse.json({shortUrl});
}


export async function GET(req) {
  await Mongo()

  const previousUrls = await url.find()

  return NextResponse.json({previousUrls});
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  await Mongo()

  try {
    await url.findOneAndDelete({shortUrl: id})
  } catch (err) {
    return NextResponse.json({code: 500, message: "Something went wrong deleting."}, {
      status: 500
    })
  }
  return NextResponse.json({code: 200})

}
