import Mongo from "../../../../../services/Mongo";
import { models } from 'mongoose'
import {NextResponse} from "next/server";
const url = models.url

export async function GET(req, { params }) {
    await Mongo()

    const foundUrl = await url.findOne({shortUrl: params.id})

    return NextResponse.json(foundUrl)
}
