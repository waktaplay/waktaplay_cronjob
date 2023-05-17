import axios, { AxiosResponse, AxiosError } from 'axios'
import { schedule } from 'node-cron'

import errorLog from '../functions/error'
import { color } from '../functions/console'

import ThisWeek from '../models/ThisWeek'

import * as dotenv from 'dotenv'
dotenv.config()

const sheetId = '1n8bRCE_OBUOND4pfhlqwEBMR6qifVLyWk5YrHclRWfY'
const apiKey = process.env.GOOGLE_SHEETS_KEY

async function getDetailData(type: number): Promise<any> {
  if (![1, 2].includes(type)) {
    return {}
  }

  try {
    const { data: generalData }: AxiosResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`,
    )
    const { data: detailData }: AxiosResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/'${encodeURIComponent(
        generalData.sheets[type].properties.title,
      )}'!2:${generalData.sheets[type].properties.gridProperties.rowCount}?key=${apiKey}`,
    )

    return detailData
  } catch (error: AxiosError | any) {
    if (error.response?.status != 403) {
      await errorLog(error, error.config.url, process.env.WEBHOOK_CRONJOB_URL)
    }

    return { error: error }
  }
}

async function fetchMusicData() {
  try {
    let thisWeek = await getDetailData(1)
    let lastWeek = await getDetailData(2)

    if (thisWeek.error || lastWeek.error) {
      if (thisWeek.error.response?.status != 403 || lastWeek.error.response?.status != 403) {
        await errorLog(thisWeek.error || lastWeek.error, 'file://cron/cacheMusicData', process.env.WEBHOOK_CRONJOB_URL)
        console.log(`${color('red', '[CronJob]')} 음악 정보를 가져오는데 문제가 발생했습니다.`)
      } else {
        console.log(`${color('red', '[CronJob]')} 음악 정보를 가져올 수 없는 시간입니다.`)
      }

      return
    }

    await ThisWeek.deleteMany({})

    let thisWeekData = []
    thisWeek.values.forEach(element => {
      if (element[1] && element[17]) {
        thisWeekData.push({
          type: element[3] == 'NEW' ? 1 : 0,
          title: {
            simple: element[0],
            original: element[4],
          },
          videos: {
            video: element[1],
            reaction: element[2] != '0' ? element[2] : null,
          },
          uploadDate: new Date('20' + element[5].replaceAll('.', '-')),
          updateDate: new Date(new Date().setMinutes(0, 0, 0)),
        })
      }
    })

    await ThisWeek.insertMany(thisWeekData)

    console.log(`${color('green', '[CronJob]')} 음악 정보를 성공적으로 가져왔습니다.`)
  } catch (error: AxiosError | any) {
    if (error.response?.status != 403) {
      await errorLog(error, 'file://cron/cacheMusicData', process.env.WEBHOOK_CRONJOB_URL)
      console.log(`${color('red', '[CronJob]')} 음악 정보를 가져오는데 문제가 발생했습니다.`)
    } else {
      console.log(`${color('red', '[CronJob]')} 음악 정보를 가져올 수 없는 시간입니다.`)
    }

    return
  }
}

schedule('0 * * * *', async () => {
  await fetchMusicData()
})
;(async () => {
  await fetchMusicData()
})()
