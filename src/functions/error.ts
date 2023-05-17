import axios from 'axios'

export default async function errorLog(error: any, page: string, webhook: string) {
  if (!webhook.startsWith('https://discord.com')) {
    throw Error('Invalid webhook URL')
  }
  console.log(error)

  let content = '<@&1088841341250846770>\n\n:warning: **[오류 로그]** \n\n'
  content += `\`\`\`오류 내용: ${error.toString() || error}\`\`\`\n`
  content += `오류 페이지: ${page}\n`

  await axios.post(webhook, {
    content: content,
  })
}