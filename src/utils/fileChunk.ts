/** 分片上传
 * 1.上传文件前，通过上传文件的File对象内的size 计算需要分片的数量和每片的大小
 * 2.循环整个文件大小，通过File对象的slice进行文件分片[file.slice(分片开始地址，分片结束地址)]
 * 2.1 之后通过FileReader读取文件的操作，将文件的分片进行读取，并把读取信息用SparkMD5库计算分片的MD5值
 * 2.2 计算完后，将MD5值和分片、分片索引一起存储到分片信息数组中暂存起来
 * 2.3 处理完一次分片后，更新起始位置和结束位置，进行下一次分片，下一个分片的起始位置为上一个分片的结束位置，结束位置为下一个分片起始位置+分片大小
 */

import { ElMessage } from 'element-plus'
import SparkMD5 from 'spark-md5'

export const handleFileChunk = async (file: File) => {
  const fileSize = file.size
  const fileName = file.name
  let chunkSize = 0 // 分片大小
  if (fileSize <= 5 * 1024 * 1024) {
    // 0-5M，不分片
    chunkSize = fileSize
  } else if (fileSize <= 20 * 1024 * 1024) {
    // 5-20M，每个分片大小1M
    chunkSize = 1024 * 1024
  } else if (fileSize <= 50 * 1024 * 1024) {
    // 20-50M，每个分片大小2M
    chunkSize = 2 * 1024 * 1024
  } else if (fileSize <= 100 * 1024 * 1024) {
    // 50-100M，每个分片大小4M
    chunkSize = 4 * 1024 * 1024
  } else if (fileSize <= 200 * 1024 * 1024) {
    // 100-200M，每个分片大小6M
    chunkSize = 6 * 1024 * 1024
  } else if (fileSize <= 500 * 1024 * 1024) {
    // 200-500M，每个分片大小10M
    chunkSize = 10 * 1024 * 1024
  } else if (fileSize <= 1024 * 1024 * 1024) {
    // 500M-1G，每个分片大小20M
    chunkSize = 20 * 1024 * 1024
  } else {
    // 1G以上，每个分片大小20M
    chunkSize = 20 * 1024 * 1024
  }
  const totalChunks = Math.ceil(fileSize / chunkSize) // 计算总共分了多少片
  let start = 0 // 起始地址
  let end = Math.min(chunkSize, fileSize) // 分片结束地址
  let index = 0 // 分片的索引
  const chunks = [] // 存放分片信息的数组
  while (start < fileSize) {
    const chunk = file.slice(start, end) // 通过File对象的slice对文件进行分片 file.slice(分片开始地址，分片结束地址)
    const reader = new FileReader()
    const promise = new Promise((resolve, reject) => {
      reader.onload = (e: any) => {
        // 对分片的文件进行读取，通过SparkMD5库计算当前分片的MD5值
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(e.target.result)
        resolve(spark.end())
      }
      reader.onerror = (e) => {
        reject(e)
      }
    })
    reader.readAsArrayBuffer(chunk) // 读取分片，会进入到上面的reader.onload
    try {
      const md5 = await promise
      const chunkInfo = { chunk, md5, index } // 将分片、分片的MD5值、分片索引位置存储为一个对象添加到分片信息数组中
      chunks.push(chunkInfo)
      index++ //
    } catch (e) {
      ElMessage.error((e as any).message)
      return false
    }
    // 一次分片结束后，更新起始位置和结束位置，进行下一次分片，下一个分片起始位置为上一个分片的结束位置，结束位置为下一个分片起始位置+分片大小
    start = end
    end = Math.min(start + chunkSize, fileSize)
  }
  return [chunks, totalChunks, fileSize, fileName, chunkSize]
}

/**
 * 分片完成后删除sessionStorage
 * @param chunkIndex 分片索引
 * @param chunkInfoList 分片信息
 */
export const handleChunkSuccessRemovesessionStorage = (
  sessionStorageName: string,
  chunkIndex: number
) => {
  const sessionChunk: [] = JSON.parse(
    sessionStorage.getItem(sessionStorageName) as string
  )
  const index = sessionChunk.findIndex(
    (item: { md5: string; index: number }) => item.index === chunkIndex
  )
  sessionChunk.splice(index, 1)
  sessionStorage.setItem(sessionStorageName, JSON.stringify(sessionChunk))
  if (!sessionChunk.length) {
    sessionStorage.removeItem(sessionStorageName)
  }
}
