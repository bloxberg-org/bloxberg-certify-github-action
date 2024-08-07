import axios from 'axios'

const baseUrl = 'https://certify.bloxberg.org'
const apiKey = 'b7fe0027-b419-4b73-958d-0b3153366e7f'

export async function certify(
  data: string[],
  metaData: BloxbergCertifyMetaData
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<any> {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  console.log('certifying commit hash...')
  console.log(`commit hash: ${data}`)
  let res
  try {
    res = await axios.post(
      `${baseUrl}/generateJsonResponse`,
      {
        publicKey: metaData.bloxbergAddress,
        crid: data,
        cridType: 'sha2-256',
        enableIPFS: false,
        metadataJson: JSON.stringify({
          authorName: metaData.authorName,
          researchTitle: metaData.researchTitle,
          emailAddress: metaData.email
        })
      },
      {
        headers: {
          api_key: apiKey,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    )
  } catch (e) {
    throw new Error(`Error when sending the request: ${e}`)
  }

  if (res?.data.errors !== undefined) {
    let error = ''
    for (const err of res.data.errors) {
      error = error.concat(' ', err)
    }
    throw new Error(`Error certifying data: ${error}`)
  } else {
    if (res?.status !== 200) {
      throw new Error(
        `Expected status 200 but got ${res?.status}\nResponse: ${res}`
      )
    } else {
      return res.data
    }
  }
}

interface BloxbergCertifyMetaData {
  authorName: string
  bloxbergAddress: string
  researchTitle: string
  email: string
}
