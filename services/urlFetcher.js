import './../models'
import Mongo from './Mongo'


import { cache } from 'react';
import {models} from 'mongoose'
console.log(models)

export const getShortUrl = cache(async (url) => {
  await Mongo()

  console.log(models)

  const shortUrl = true // await url.findOne({shortURL: url})

  return shortUrl;
});
